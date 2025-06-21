package nexusglobal.wordprocessor.service;

import nexusglobal.wordprocessor.model.entities.DocumentSection;
import nexusglobal.wordprocessor.model.entities.DocumentTag;
import nexusglobal.wordprocessor.model.entities.ProcessDocument;
import org.apache.poi.xwpf.usermodel.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.Files;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class WordTemplateWriter {

    private static final Logger LOGGER = LoggerFactory.getLogger(WordTemplateWriter.class);

    private void replaceWordsInParagraphs(List<XWPFParagraph> paragraphList, String[] wordsToReplace, String[] replacements) {
        for (XWPFParagraph paragraph : paragraphList) {
            for (XWPFRun run : paragraph.getRuns()) {
                String text = run.getText(0);
                if (text != null && !text.isEmpty()) {
                    for (int i = 0; i < wordsToReplace.length; i++) {
                        if (replacements[i] != null && !replacements[i].isEmpty()) {
                            text = text.replace(wordsToReplace[i], replacements[i]);
                        } else {
                            text = text.replace(wordsToReplace[i], "");
                        }
                    }
                    run.setText(text, 0);
                }
            }
        }
    }

    private void replaceWordsInTables(XWPFDocument document, String[] wordsToReplace, String[] replacements) {
        for (XWPFTable table : document.getTables()) {
            for (XWPFTableRow row : table.getRows()) {
                for (XWPFTableCell cell : row.getTableCells()) {
                    replaceWordsInParagraphs(cell.getParagraphs(), wordsToReplace, replacements);
                }
            }
        }
    }

    private void replaceWordsInHeader(List<XWPFHeader> headerList, String[] wordsToReplace, String[] replacements) {
        for (XWPFHeader header : headerList) {
            replaceWordsInParagraphs(header.getParagraphs(), wordsToReplace, replacements);
        }
    }

    private String[] convertKeysToTags(final List<DocumentTag> documentTags) {
        return documentTags.stream()
                .map(documentTag -> "<" + documentTag.getTag() + ">")
                .toArray(String[]::new);
    }

    private String[] convertKeysToStartTags(final List<DocumentSection> documentSections) {
        return documentSections.stream()
                .map(documentSection -> "<start_" + documentSection.getTag() + ">")
                .toArray(String[]::new);
    }

    private String[] convertKeysToEndTags(final List<DocumentSection> documentSections) {
        return documentSections.stream()
                .map(documentSection -> "<end_" + documentSection.getTag() + ">")
                .toArray(String[]::new);
    }

    private byte[] readByteDataFromTempFile(final File file) throws IOException {
        try (FileInputStream fis = new FileInputStream(file);
             ByteArrayOutputStream bos = new ByteArrayOutputStream()) {
            byte[] buffer = new byte[1024];
            int bytesRead;
            while ((bytesRead = fis.read(buffer)) != -1) {
                bos.write(buffer, 0, bytesRead);
            }
            return bos.toByteArray();
        }
    }

    private Set<XWPFParagraph> findListOfParagraphsToRemoved(List<DocumentSection> documentSections, final XWPFDocument document, final String[] startTags, final String[] endTags) {
        // Flag to indicate whether to remove paragraphs between tags
        boolean removeParagraphs = false;

        // Create a list to store the paragraphs to be removed
        Set<XWPFParagraph> paragraphsToRemove = new HashSet<>();

        // Iterate through paragraphs
        List<XWPFParagraph> paragraphs = document.getParagraphs();

        for (final XWPFParagraph paragraph : paragraphs) {
            String text = paragraph.getText();
            int index = 0;
            for (DocumentSection section : documentSections) {
                if (!section.getIsIncluded() && !text.isEmpty()) {
                    if (text.contains(startTags[index])) {
                        removeParagraphs = true;
                        paragraphsToRemove.add(paragraph);
                    }

                    if (removeParagraphs) {
                        paragraphsToRemove.add(paragraph);
                        if (text.contains(endTags[index])) {
                            removeParagraphs = false;
                        }
                    }

                }
                index++;
            }
        }
        return paragraphsToRemove;
    }

    private void removeUnwantedParagraphs(final XWPFDocument document, final Set<XWPFParagraph> paragraphsToRemove) {
        // Remove the identified paragraphs
        for (XWPFParagraph paragraph : paragraphsToRemove) {
            document.removeBodyElement(document.getPosOfParagraph(paragraph));
        }
    }

    private void removeUnwantedTables(final XWPFDocument document, final Set<XWPFTable> tableToRemove) {
        // Remove the identified paragraphs
        for (XWPFTable table : tableToRemove) {
            document.removeBodyElement(document.getPosOfTable(table));
        }
    }

    private Set<XWPFTable> findListOfTableToRemoved(final List<DocumentSection> documentSections, final XWPFDocument document, final String[] startTags, final String[] endTags) {

        // Create a set to store the tables to be removed
        Set<XWPFTable> tablesToRemove = new HashSet<>();

        // Iterate through tables
        for (XWPFTable table : document.getTables()) {
            for (XWPFTableRow row : table.getRows()) {
                for (XWPFTableCell cell : row.getTableCells()) {
                    for (XWPFParagraph paragraph : cell.getParagraphs()) {
                        String text = paragraph.getText();
                        int index = 0;
                        for (DocumentSection section : documentSections) {
                            if (!section.getIsIncluded() && !text.isEmpty()) {
                                if (paragraph.getText().contains(startTags[index]) || paragraph.getText().contains(endTags[index])) {
                                    tablesToRemove.add(table);
                                }
                            }
                            index++;
                        }
                    }
                }
            }
        }
        return tablesToRemove;
    }

    private void removeSurroundingTagText(XWPFDocument document, String[] wordsToReplace) {
        for (XWPFTable table : document.getTables()) {
            for (XWPFTableRow row : table.getRows()) {
                for (XWPFTableCell cell : row.getTableCells()) {
                    for (XWPFParagraph paragraph : cell.getParagraphs()) {
                        replaceSurroundingTagFromParagraph(paragraph, wordsToReplace);
                    }
                }
            }
        }
        for (XWPFParagraph paragraph : document.getParagraphs()) {
            replaceSurroundingTagFromParagraph(paragraph, wordsToReplace);
        }

    }

    private void replaceSurroundingTagFromParagraph(final XWPFParagraph paragraph, final String[] wordsToReplace) {
        for (XWPFRun run : paragraph.getRuns()) {
            String text = run.getText(0);
            if (text != null && !text.isEmpty()) {
                for (int i = 0; i < wordsToReplace.length; i++) {
                    text = text.replace(wordsToReplace[i], "");
                }
                run.setText(text, 0);
            }
        }
    }

    public void replaceTagsWithGivenValue(final List<DocumentTag> documentTags, final ProcessDocument processDocument) throws IOException {
        File tempFile = File.createTempFile("Temp_", ".docx");
        try {
            try (InputStream is = new ByteArrayInputStream(processDocument.getBytes());
                 XWPFDocument document = new XWPFDocument(is)) {

                String[] wordsToReplace = convertKeysToTags(documentTags);
                String[] replacements = documentTags.stream().map(DocumentTag::getText).toArray(String[]::new);

                //Replace words in header section
                replaceWordsInHeader(document.getHeaderList(), wordsToReplace, replacements);

                // Replace words in paragraphs
                replaceWordsInParagraphs(document.getParagraphs(), wordsToReplace, replacements);

                // Replace words in tables
                replaceWordsInTables(document, wordsToReplace, replacements);

                // Save the modified document
                FileOutputStream fos = new FileOutputStream(tempFile);
                document.write(fos);
                fos.close();
                if (tempFile.exists()) {
                    processDocument.setBytes(readByteDataFromTempFile(tempFile));
                }
            }
        } catch (Exception e) {
            LOGGER.error(e.getMessage());
        } finally {
            Files.deleteIfExists(tempFile.toPath());
        }
    }

    public void removeSurroundingTags(final List<DocumentSection> documentSections, final ProcessDocument processDocument) throws IOException {
        File tempFile = File.createTempFile("Temp_", ".docx");
        try {

            try (InputStream is = new ByteArrayInputStream(processDocument.getBytes());
                 XWPFDocument document = new XWPFDocument(is)) {

                // Define your start and end tags
                String[] startTags = convertKeysToStartTags(documentSections);
                String[] endTags = convertKeysToEndTags(documentSections);

                Set<XWPFParagraph> paragraphsToRemove = findListOfParagraphsToRemoved(documentSections, document, startTags, endTags);
                //Set<XWPFTable> tablesToRemove = findListOfTableToRemoved(documentSections, document, startTags, endTags);
                removeUnwantedParagraphs(document, paragraphsToRemove);
                //removeUnwantedTables(document, tablesToRemove);

//                int mergedLength = startTags.length + endTags.length;
//                String[] surroundingTagsToRemove = new String[mergedLength];
//                System.arraycopy(startTags, 0, surroundingTagsToRemove, 0, startTags.length);
//                System.arraycopy(endTags, 0, surroundingTagsToRemove, startTags.length, endTags.length);
//                removeSurroundingTagText(document, surroundingTagsToRemove);
                // Save the modified document
                FileOutputStream fos = new FileOutputStream(tempFile);
                document.write(fos);
                fos.close();
                if (tempFile.exists()) {
                    processDocument.setBytes(readByteDataFromTempFile(tempFile));
                }
            }
        } catch (Exception e) {
            LOGGER.error(e.getMessage());
        } finally {
            Files.deleteIfExists(tempFile.toPath());
        }
    }

}
