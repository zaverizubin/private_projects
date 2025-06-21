package nexusglobal.wordprocessor.service;

import nexusglobal.wordprocessor.enums.TagTypes;
import nexusglobal.wordprocessor.model.entities.DocumentSection;
import nexusglobal.wordprocessor.model.entities.DocumentTag;
import nexusglobal.wordprocessor.model.entities.ProcessDocument;
import org.apache.poi.xwpf.usermodel.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class WordTemplateReader {

    private static final Logger LOGGER = LoggerFactory.getLogger(WordTemplateReader.class);
    private static final String TAG_PATTERN = "<(.*?)>";

    private void populateTagFromContent(final List<DocumentTag> documentTagList, final List<DocumentSection> documentSectionList, final XWPFDocument document, TagTypes tagType) {
        List<XWPFTable> tables = document.getTables();
        List<XWPFParagraph> paragraphs = document.getParagraphs();
        Pattern pattern = Pattern.compile(TAG_PATTERN, Pattern.DOTALL);

        for (XWPFTable table : tables) {
            for (XWPFTableRow row : table.getRows()) {
                for (XWPFTableCell cell : row.getTableCells()) {
                    for (XWPFParagraph paragraph : cell.getParagraphs()) {
                        extractTagsFromParagraphs(documentTagList, documentSectionList, tagType, pattern, paragraph);
                    }
                }
            }
        }

        for (XWPFParagraph paragraph : paragraphs) {
            extractTagsFromParagraphs(documentTagList, documentSectionList, tagType, pattern, paragraph);
        }
    }

    private void extractTagsFromParagraphs(final List<DocumentTag> documentTagList, final List<DocumentSection> documentSectionList, final TagTypes tagType, final Pattern pattern, final XWPFParagraph paragraph) {
        if (!paragraph.getText().isEmpty()) {
            Matcher matcher = pattern.matcher(paragraph.getText());

            while (matcher.find()) {
                String tagContent = matcher.group(1).trim(); // Get the content inside the angle brackets

                final boolean isSurroundingTag = tagContent.toLowerCase().startsWith("start_") || tagContent.toLowerCase().startsWith("end_");
                if (tagType.equals(TagTypes.TAG) && !isSurroundingTag) {
                    addTagIfNotPresent(documentTagList, new DocumentTag(tagContent, null));
                }

                if (tagType.equals(TagTypes.SURROUNDING_TAG) && isSurroundingTag) {
                    String surroundingTagContent = tagContent.split("_")[1].trim();
                    addSectionIfNotPresent(documentSectionList, new DocumentSection(surroundingTagContent, false));
                }
            }
        }
    }

    private void addTagIfNotPresent(final List<DocumentTag> documentTagList, final DocumentTag documentTag) {
        Optional<DocumentTag> documentTagOptional = documentTagList.stream().filter(tag -> tag.getTag().equalsIgnoreCase(documentTag.getTag())).findAny();
        if (documentTagOptional.isEmpty()) {
            documentTagList.add(documentTag);
        }
    }

    private void addSectionIfNotPresent(final List<DocumentSection> documentSectionList, final DocumentSection documentSection) {
        Optional<DocumentSection> documentSectionOptional = documentSectionList.stream().filter(tag -> tag.getTag().equalsIgnoreCase(documentSection.getTag())).findAny();
        if (documentSectionOptional.isEmpty()) {
            documentSectionList.add(documentSection);
        }
    }

    public List readTagsFromTemplate(ProcessDocument processDocument, TagTypes tagType) {
        List<DocumentTag> documentTagList = new ArrayList<>();
        List<DocumentSection> documentSectionList = new ArrayList<>();
        if (processDocument.getBytes() != null) {
            try {
                try (InputStream is = new ByteArrayInputStream(processDocument.getBytes());
                     XWPFDocument document = new XWPFDocument(is)) {

                    populateTagFromContent(documentTagList, documentSectionList, document, tagType);
                }

            } catch (Exception e) {
                LOGGER.error(e.getMessage());
            }

        } else {
            LOGGER.error("Document Bytes Data can't be null...");
        }
        return tagType.equals(TagTypes.TAG) ? documentTagList : documentSectionList;
    }
}

