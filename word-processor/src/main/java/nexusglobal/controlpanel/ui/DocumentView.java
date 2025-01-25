package nexusglobal.controlpanel.ui;

import com.vaadin.flow.component.Component;
import com.vaadin.flow.component.UI;
import com.vaadin.flow.component.Unit;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.confirmdialog.ConfirmDialog;
import com.vaadin.flow.component.grid.Grid;
import com.vaadin.flow.component.grid.GridVariant;
import com.vaadin.flow.component.html.Label;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.notification.NotificationVariant;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.textfield.TextField;
import com.vaadin.flow.component.upload.StartedEvent;
import com.vaadin.flow.component.upload.SucceededEvent;
import com.vaadin.flow.component.upload.Upload;
import com.vaadin.flow.data.binder.BeanValidationBinder;
import com.vaadin.flow.router.AfterNavigationEvent;
import com.vaadin.flow.router.AfterNavigationObserver;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.component.checkbox.Checkbox;
import com.vaadin.flow.server.StreamResource;
import nexusglobal.controlpanel.interfaces.ContentView;
import nexusglobal.controlpanel.model.entities.DocumentSection;
import nexusglobal.controlpanel.model.entities.DocumentTag;
import nexusglobal.controlpanel.model.entities.ProcessDocument;
import nexusglobal.controlpanel.ui.components.EntityEditor;
import nexusglobal.controlpanel.ui.components.notifications.ErrorNotification;
import nexusglobal.controlpanel.ui.components.notifications.GeneralNotification;
import nexusglobal.controlpanel.ui.shared.HeaderComponent;
import nexusglobal.controlpanel.ui.shared.MainComponent;
import nexusglobal.controlpanel.utils.ButtonUtils;
import nexusglobal.controlpanel.utils.GridUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;

@Route(value = "documents", layout = MainComponent.class)
public class DocumentView extends VerticalLayout implements ContentView, AfterNavigationObserver {

    private static final Logger errorLogger = LoggerFactory.getLogger("error");
    private static final String ACCEPTABLE_MIME_TYPES = "application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    private static final String DOCUMENT_TO_PROCESS_LABEL = "Documents To Process";
    private static final String DOCUMENT_TAGS_LABEL = "Document Tags";
    private static final String DOCUMENT_SECTIONS_LABEL = "Document Sections";
    private static final Integer GRID_HEIGHT = 410;

    // Autowired components
    private final HeaderComponent mainHeaderComponent;
    private final DocumentPresenter presenter;


    // UI components
    private Upload uploadComponent;

    private final EntityEditor<ProcessDocument> processDocumentEntityEditor = new EntityEditor<>();
    private final Grid<ProcessDocument> processDocumentGrid = this.processDocumentEntityEditor.getGrid();
    private final EntityEditor<DocumentTag> documentTagEntityEditor = new EntityEditor<>();
    private final EntityEditor<DocumentSection> documentSectionEntityEditor = new EntityEditor<>();
    private final Label documentLabel = new Label();
    private final Button exportDocumentButton = ButtonUtils.createPrimaryButton("Export Document");
    private final TextField tagTextField = new TextField();
    private final TextField tagReplacementTextField = new TextField();
    private final HorizontalLayout topHLayout = new HorizontalLayout();
    private final HorizontalLayout middleHLayout = new HorizontalLayout();
    private final HorizontalLayout bottomHLayout = new HorizontalLayout();


    // Global variables
    private final BeanValidationBinder<DocumentTag> documentTagBinder = new BeanValidationBinder<>(DocumentTag.class);
    private final List<ProcessDocument> processDocumentList = new ArrayList<>();
    private transient ByteArrayOutputStream bos;
    private boolean hasUnsavedChanges = false;


    @Autowired
    public DocumentView(final HeaderComponent mainHeaderComponent, final DocumentPresenter presenter) {
        super();
        this.mainHeaderComponent = mainHeaderComponent;
        this.presenter = presenter;


        buildUI();
        this.presenter.setView(this);
    }

    private void buildUI() {
        setupUploadComponent();
        setupProcessDocumentsGrid();
        setupTagsGrid();
        setupSectionsGrid();
        bindDocumentTagFields();
        setupActionButtons();
        setupLayout();
        captureChanges();
    }

    private void setupUploadComponent() {
        Label label = new Label("Upload Document");

        this.uploadComponent = new Upload();
        this.uploadComponent.setWidth(300, Unit.PIXELS);
        this.uploadComponent.setAcceptedFileTypes(ACCEPTABLE_MIME_TYPES);
        this.uploadComponent.setReceiver(this::uploadReceiverHandler);
        this.uploadComponent.addSucceededListener(this::fileUploadSucceedHandler);
        this.uploadComponent.addStartedListener(this::uploadStartedHandler);
        this.uploadComponent.setMaxFileSize(50*1024*1024);

        VerticalLayout vLayout = new VerticalLayout(label, this.uploadComponent);
        vLayout.getStyle().set("border", "2px dashed lightgrey");
        vLayout.setPadding(true);
        vLayout.setMargin(false);
        vLayout.setWidth(50, Unit.PERCENTAGE);

        this.topHLayout.add(vLayout);
    }

    private void setupProcessDocumentsGrid() {
        this.processDocumentGrid.addThemeVariants(GridVariant.LUMO_WRAP_CELL_CONTENT);

        GridUtils.addColumn(this.processDocumentGrid, ProcessDocument::getFilename, "Document Name").setFlexGrow(1);
        GridUtils.addColumn(this.processDocumentGrid, ProcessDocument::getContentLength, "Size(MB)").setWidth("150px").setFlexGrow(0);
        this.processDocumentEntityEditor.addEditColumn(this::onEditProcessDocumentClicked);
        GridUtils.addComponentColumn(this.processDocumentGrid, processDocument -> {
            final Button deleteButton = ButtonUtils.createDeleteButton();
            ButtonUtils.addTooltip(deleteButton, getTranslation("Delete Document"));
            deleteButton.addClickListener(event -> onProcessDocumentDeleteClick(processDocument));
            return deleteButton;
        }, "").setFlexGrow(1).setKey("").setWidth("80px").setFlexGrow(0);
        this.processDocumentEntityEditor.setLabel(DOCUMENT_TO_PROCESS_LABEL);

        this.processDocumentGrid.setWidth(50, Unit.PERCENTAGE);
        this.processDocumentGrid.setHeight(200, Unit.PIXELS);
    }

    private void setupTagsGrid() {
        final Grid<DocumentTag> documentTagGrid = this.documentTagEntityEditor.getGrid();
        documentTagGrid.addThemeVariants(GridVariant.LUMO_WRAP_CELL_CONTENT);
        documentTagGrid.setHeight(GRID_HEIGHT, Unit.PIXELS);

        GridUtils.addColumn(documentTagGrid, DocumentTag::getTag, "Tag", this.tagTextField).setWidth("250px").setFlexGrow(0);
        GridUtils.addColumn(documentTagGrid, DocumentTag::getText, "Replace With", this.tagReplacementTextField).setFlexGrow(1);

        this.documentTagEntityEditor.getElement().getStyle().set("width", "60%");
        this.documentTagEntityEditor.useInlineEditor(this.documentTagBinder);

        this.documentTagEntityEditor.setLabel(DOCUMENT_TAGS_LABEL);
    }

    private void setupSectionsGrid() {
        final Grid<DocumentSection> documentSectionGrid = this.documentSectionEntityEditor.getGrid();
        documentSectionGrid.addThemeVariants(GridVariant.LUMO_WRAP_CELL_CONTENT);

        GridUtils.addColumn(documentSectionGrid, DocumentSection::getTag, "Tag").setFlexGrow(1);
        GridUtils.addComponentColumn(documentSectionGrid, documentSection -> {
            Checkbox checkbox = new Checkbox();
            checkbox.addValueChangeListener(event -> {
                documentSection.setIsIncluded(event.getValue());
                this.hasUnsavedChanges = true;
            });
            return checkbox;
        }, "Is Included").setFlexGrow(0).setWidth("120px");

        this.documentSectionEntityEditor.getElement().getStyle().set("width", "40%");
        documentSectionGrid.setHeight(GRID_HEIGHT, Unit.PIXELS);
        this.documentSectionEntityEditor.setLabel(DOCUMENT_SECTIONS_LABEL);
    }

    private void setupActionButtons() {
        this.exportDocumentButton.addClickListener(event ->exportDocument());
    }

    private void bindDocumentTagFields() {
        this.documentTagBinder.bind(this.tagTextField, DocumentTag.FIELD_TAG_TEXT);
        this.documentTagBinder.bind(this.tagReplacementTextField, DocumentTag.FIELD_REPLACEMENT_TEXT);
    }

    private void setupLayout() {
        this.topHLayout.add(this.processDocumentEntityEditor);
        this.middleHLayout.add(this.documentTagEntityEditor, this.documentSectionEntityEditor);
        this.bottomHLayout.add(this.exportDocumentButton);

        this.topHLayout.setWidthFull();
        this.middleHLayout.setWidthFull();
        this.bottomHLayout.setWidthFull();
        this.bottomHLayout.setJustifyContentMode(JustifyContentMode.CENTER);
        this.bottomHLayout.setPadding(false);

        add(this.topHLayout, this.documentLabel, this.middleHLayout, this.bottomHLayout);
        setSizeFull();
    }

    private void captureChanges() {
        this.documentTagBinder.addValueChangeListener(event ->{
           if(event.isFromClient()){
               this.hasUnsavedChanges = true;
           }
        });
    }

    private void onProcessDocumentDeleteClick(final ProcessDocument processDocument) {
        if(processDocument.equals(this.presenter.getActiveProcessDocument())){
            ConfirmDialog dialog = new ConfirmDialog("Confirm",
                    "This will clear all work related to this document. Are you sure?", "Yes",
                    e ->{
                        deleteProcessDocument(processDocument);
                        this.hasUnsavedChanges = false;
                    }, "Cancel", c -> {
            });
            dialog.open();
        }else{
            deleteProcessDocument(processDocument);
        }
    }

    private void deleteProcessDocument(final ProcessDocument processDocument) {
        this.documentTagEntityEditor.clearEntities();
        this.documentSectionEntityEditor.clearEntities();
        this.processDocumentEntityEditor.getEntites().remove(processDocument);
        this.processDocumentEntityEditor.getDataProvider().refreshAll();
        this.documentLabel.setText("");
        this.presenter.setActiveProcessDocument(null);
    }

    private void onEditProcessDocumentClicked(final ProcessDocument processDocument){
        if(!processDocument.equals(this.presenter.getActiveProcessDocument())){
            if(this.hasUnsavedChanges){
                ConfirmDialog dialog = new ConfirmDialog("Confirm",
                        "This will clear all work related to the current document. Are you sure?", "Yes",
                        e ->onEditProcessDocument(processDocument), "Cancel", c -> {
                });
                dialog.open();
            }else{
                onEditProcessDocument(processDocument);
            }
        }
    }

    private void onEditProcessDocument(final ProcessDocument processDocument){
        this.presenter.setActiveProcessDocument(processDocument);

        List<DocumentTag> documentTags = this.presenter.readDocTags();
        List<DocumentSection> documentSections = this.presenter.readDocSections();

        this.documentLabel.setText("Editing Document: " + processDocument.getFilename().split("\\.")[0]);
        this.documentLabel.getElement().getStyle().set("font-weight", "500");
        this.documentLabel.getElement().getStyle().set("font-size", "var(--lumo-font-size-l)");
        this.documentLabel.getElement().getStyle().set("color", "#3964a8");

        this.documentTagEntityEditor.setEntities(documentTags);
        this.documentSectionEntityEditor.setEntities(documentSections);
        this.hasUnsavedChanges = false;
    }

    private void exportDocument() {
        if(this.presenter.getActiveProcessDocument() == null){
            GeneralNotification.show("Select a document to export");
        }
        this.presenter.processDocTags(new ArrayList<>(this.documentTagEntityEditor.getEntites()));
        this.presenter.processDocSections(new ArrayList<>(this.documentSectionEntityEditor.getEntites()));

        this.exportDocumentButton.getElement().setAttribute("reporturl", new StreamResource(this.presenter.getActiveProcessDocument().getFilename(),
                () -> new ByteArrayInputStream(this.presenter.getActiveProcessDocument().getBytes())));
        UI.getCurrent().getPage().open(this.exportDocumentButton.getElement().getAttribute("reporturl"));

        Notification notification = Notification.show("Document successfully exported", 1000, Notification.Position.MIDDLE);
        notification.addThemeVariants(NotificationVariant.LUMO_SUCCESS);
    }

    private void uploadStartedHandler(final StartedEvent event) {
        if (!validateUpload(event)) {
            this.uploadComponent.interruptUpload();
        }
    }

    private OutputStream uploadReceiverHandler(final String filename, final String mimeType) {
        this.bos = new ByteArrayOutputStream();
        return this.bos;
    }

    private void fileUploadSucceedHandler(final SucceededEvent event) {
        String fileName = event.getFileName();
        long contentLength = event.getContentLength();
        this.processDocumentList.add(new ProcessDocument(fileName, contentLength, this.bos.toByteArray()));
        this.processDocumentEntityEditor.setEntities(this.processDocumentList);
    }

    private boolean validateUpload(final StartedEvent event) {
        boolean isValid = true;
        if (event.getContentLength() == 0 || event.getFileName().isEmpty()) {
            isValid = false;
            ErrorNotification.show("Select a word document to upload.");
        } else if (!ACCEPTABLE_MIME_TYPES.contains(event.getMIMEType().toLowerCase())) {
            isValid = false;
            ErrorNotification.show("Upload file types are restricted to *.doc, *.docx");
        } else if (event.getContentLength() / (1024 * 1024) > 50) {
            isValid = false;
            ErrorNotification.show("Uploads cannot be greater than 5 MB.");
        }else if(this.processDocumentEntityEditor.getEntites() != null && this.processDocumentEntityEditor.getEntites().size() == 2){
            isValid = false;
            ErrorNotification.show("Demo version - Cannot upload more than 2 documents.");
        }
        return isValid;
    }

    public void bindData() {

    }

    private void validate(){

    }

    public void save() {

    }

    @Override
    public String getPageTitle() {
        return "Documents";
    }

    @Override
    public HeaderComponent getHeaderComponent() {
        return this.mainHeaderComponent;
    }

    @Override
    public Component getContentComponent() {
        return this;
    }

    @Override
    public void afterNavigation(AfterNavigationEvent afterNavigationEvent) {

    }
}

