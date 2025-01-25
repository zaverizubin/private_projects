package nexusglobal.wordprocessor.ui;

import nexusglobal.wordprocessor.interfaces.Presenter;
import nexusglobal.wordprocessor.model.entities.DocumentSection;
import nexusglobal.wordprocessor.model.entities.DocumentTag;
import nexusglobal.wordprocessor.model.entities.ProcessDocument;
import nexusglobal.wordprocessor.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import java.util.List;


@Component
@Scope(BeanDefinition.SCOPE_PROTOTYPE)
public class DocumentPresenter implements Presenter<DocumentView> {

    //Autowired
    private final DocumentService documentService;

    //UI Components
    private DocumentView view;

    //Global
    private ProcessDocument activeProcessDocument;

    @Autowired
    public DocumentPresenter(final DocumentService documentService) {
        super();
        this.documentService = documentService;
    }

    public ProcessDocument getActiveProcessDocument() {
        return this.activeProcessDocument;
    }

    public void setActiveProcessDocument(final ProcessDocument selectedProcessDocument) {
        this.activeProcessDocument = selectedProcessDocument;
    }

    public List<DocumentTag> readDocTags() {
        return this.documentService.readDocTags(this.activeProcessDocument);
    }

    public List<DocumentSection> readDocSections() {
        return this.documentService.readDocSections(this.activeProcessDocument);
    }

    public void processDocTags(final List<DocumentTag> documentTags) {
        try {
            this.documentService.processDocTags(documentTags, this.getActiveProcessDocument());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void processDocSections(final List<DocumentSection> documentSections) {
        try {
            this.documentService.processDocSections(documentSections, this.getActiveProcessDocument());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void setView(DocumentView view) {
        this.view = view;
    }


}
