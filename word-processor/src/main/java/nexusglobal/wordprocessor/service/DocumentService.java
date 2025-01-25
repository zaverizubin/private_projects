package nexusglobal.wordprocessor.service;

import nexusglobal.wordprocessor.enums.TagTypes;
import nexusglobal.wordprocessor.model.entities.DocumentSection;
import nexusglobal.wordprocessor.model.entities.DocumentTag;
import nexusglobal.wordprocessor.model.entities.ProcessDocument;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
public class DocumentService {

    private final WordTemplateReader wordTemplateReader;
    private final WordTemplateWriter wordTemplateWriter;

    @Autowired
    public DocumentService(final WordTemplateReader wordTemplateReader, final WordTemplateWriter wordTemplateWriter) {

        this.wordTemplateReader = wordTemplateReader;
        this.wordTemplateWriter = wordTemplateWriter;
    }

    public List<DocumentTag> readDocTags(final ProcessDocument processDocument) {
        return this.wordTemplateReader.readTagsFromTemplate(processDocument, TagTypes.TAG);
    }

    public List<DocumentSection> readDocSections(final ProcessDocument processDocument) {
        return this.wordTemplateReader.readTagsFromTemplate(processDocument, TagTypes.SURROUNDING_TAG);
    }

    public void processDocTags(final List<DocumentTag> documentTags, final ProcessDocument processDocument) throws IOException {
        this.wordTemplateWriter.replaceTagsWithGivenValue(documentTags, processDocument);
    }

    public void processDocSections(final List<DocumentSection> documentSections, final ProcessDocument processDocument) throws IOException {
        this.wordTemplateWriter.removeSurroundingTags(documentSections, processDocument);
    }
}