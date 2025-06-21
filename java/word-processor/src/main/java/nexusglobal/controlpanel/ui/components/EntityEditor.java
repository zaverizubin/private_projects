package nexusglobal.controlpanel.ui.components;

import com.vaadin.flow.component.ClickEvent;
import com.vaadin.flow.component.Component;
import com.vaadin.flow.component.ComponentEventListener;
import com.vaadin.flow.component.Tag;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.button.ButtonVariant;
import com.vaadin.flow.component.dependency.JsModule;
import com.vaadin.flow.component.grid.ColumnTextAlign;
import com.vaadin.flow.component.grid.Grid;
import com.vaadin.flow.component.grid.Grid.Column;
import com.vaadin.flow.component.grid.Grid.SelectionMode;
import com.vaadin.flow.component.html.Label;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.orderedlayout.FlexComponent;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.polymertemplate.Id;
import com.vaadin.flow.component.polymertemplate.PolymerTemplate;
import com.vaadin.flow.component.splitlayout.SplitLayout;
import com.vaadin.flow.data.binder.Binder;
import com.vaadin.flow.data.provider.DataProvider;
import com.vaadin.flow.data.provider.ListDataProvider;
import com.vaadin.flow.function.SerializablePredicate;
import com.vaadin.flow.function.ValueProvider;
import com.vaadin.flow.shared.Registration;
import com.vaadin.flow.templatemodel.TemplateModel;
import nexusglobal.controlpanel.exceptions.ValidationFailedException;
import nexusglobal.controlpanel.interfaces.ControlPanelEntity;
import nexusglobal.controlpanel.interfaces.Loggable;
import nexusglobal.controlpanel.utils.*;
import org.apache.commons.lang.StringUtils;

import java.util.*;
import java.util.function.Consumer;
import java.util.function.Predicate;

@Tag("entity-editor")
@JsModule("./src/views/components/entity-editor.js")
public class EntityEditor<T extends ControlPanelEntity> extends PolymerTemplate<EntityEditor.EntityEditorModel> implements Loggable {

    private static final String DELETE_COLUMN_KEY = "deleteColumn";
    // Listeners
    private final List<Consumer<EntityEditor<T>>> addEvents = new ArrayList<>();
    private final List<Consumer<T>> afterDeleteEvents = new ArrayList<>();

    private final Random random = new Random();

    // UI Components
    @Id("mainVLayout")
    private VerticalLayout mainVLayout;
    @Id("label")
    private Label label;
    @Id("gridSplitLayout")
    private SplitLayout gridSplitLayout;
    @Id("grid")
    private Grid<T> grid;
    @Id("detailsVLayout")
    private VerticalLayout detailsVLayout;
    @Id("hLayout")
    private HorizontalLayout hLayout;
    @Id("buttonsHLayout")
    private HorizontalLayout componentsTopHLayout;

    private Button addButton;


    // Global Variables
    private Collection<T> entities; // Force a list because so much depends on an index or ordered list
    private ListDataProvider<T> dataProvider;
    private boolean useInlineEditor;
    private boolean isReadOnly = false;
    private String labelString;
    private Registration inlineEditorRegistration;


    public interface EntityEditorModel extends TemplateModel {
        // Add setters and getters for template properties here.
    }

    public EntityEditor() {
        super();

        this.label.setVisible(false);
        this.mainVLayout.setPadding(false);
        this.componentsTopHLayout.setWidthFull();
        this.componentsTopHLayout.setJustifyContentMode(FlexComponent.JustifyContentMode.END);
        this.hideDetailsLayout();
    }

    private void internalAddEntity(final T entity) {
        entity.setId(-this.random.nextInt(10000000));
        if (this.entities instanceof List) {
            ((List<T>) this.entities).add(0, entity);
        } else {
            this.entities.add(entity);
        }
        // Not sure why this isn't getting updated properly, but added this and it seems to fix it
        this.grid.getDataCommunicator().refresh(entity);
        this.getDataProvider().refreshAll();
    }

    private void updateItemCount() {
        long count = this.getDataProvider().getItems().stream().filter(entity -> !entity.isMarkedToDelete()).count();
        if (StringUtils.isNotEmpty(this.labelString)) {
            if (count > 0) {
                this.label.setText(this.labelString + String.format("(%s)", count));
            } else {
                this.label.setText(this.labelString);
            }
        }
    }

    private void addDeletedItemsFilter() {
        this.dataProvider.addFilterByValue(T::isMarkedToDelete, false);
    }

    public ListDataProvider<T> getDataProvider() {
        return this.dataProvider;
    }

    public void setDataProvider(final ListDataProvider<T> dataProvider) {
        this.dataProvider = dataProvider;
        this.dataProvider.addDataProviderListener(event -> updateItemCount());

        this.entities = dataProvider.getItems();

        addDeletedItemsFilter();
        this.grid.setDataProvider(dataProvider);
        dataProvider.refreshAll();
    }

    public void enableDeleting() {
        enableDeleting(entity -> true);
    }

    public void disableDeleting() {
        if (this.grid.getColumnByKey(DELETE_COLUMN_KEY) != null) {
            this.grid.removeColumnByKey(DELETE_COLUMN_KEY);
        }
    }

    public void disableEditing() {
        if (this.grid.getColumnByKey(GridUtils.EDIT_COLUMN_KEY) != null) {
            this.grid.removeColumnByKey(GridUtils.EDIT_COLUMN_KEY);
        }
    }

    public void enableDeleting(final Predicate<T> deleteButtonEnabledFunction) {
        if (this.grid.getColumnByKey(DELETE_COLUMN_KEY) == null) {
            this.grid.addComponentColumn(entity -> {

                final Span iconSpan = new Span();
                iconSpan.setClassName(ApmFontAwesome.TRASH_SOLID.cssClass());
                final Button deleteButton = new Button(iconSpan);
                deleteButton.setEnabled(deleteButtonEnabledFunction.test(entity));

                deleteButton.setThemeName(ApmTheme.THEME_BUTTON_DELETE);
                deleteButton.addThemeVariants(ButtonVariant.LUMO_ICON);
                deleteButton.addClickListener(event -> {
                    if (entity.isNew()) {
                        this.entities.remove(entity);
                    } else {
                        entity.markToDelete();
                    }

                    for (final Consumer<T> deleteEvent : this.afterDeleteEvents) {
                        deleteEvent.accept(entity);
                    }

                    if (this.useInlineEditor) {
                        this.grid.getEditor().cancel(); // Vaadin requires the editor to be closed before refreshing the dataProvider
                        // If you delete the currently edited bean, remove it from the binder, so that it doesn't try to validate on save
                        if (this.grid.getEditor().getBinder() != null && this.grid.getEditor().getBinder().getBean() == entity) {
                            this.grid.getEditor().getBinder().removeBean();
                        }
                    }

                    this.getDataProvider().refreshAll();
                });

                return deleteButton;
            }).setKey(DELETE_COLUMN_KEY).setFlexGrow(0);
        }
    }

    public Column<T> addEditColumn(final Consumer<T> editListener) {
        if (this.grid.getColumnByKey(GridUtils.EDIT_COLUMN_KEY) != null) {
            return this.grid.getColumnByKey(GridUtils.EDIT_COLUMN_KEY);
        } else {
            return this.grid.addComponentColumn(entity -> {
                final Button editButton = ButtonUtils.createEditButton();
                editButton.addClickListener(event -> editListener.accept(entity));
                return editButton;
            }).setKey(GridUtils.EDIT_COLUMN_KEY).setHeader("Edit").setTextAlign(ColumnTextAlign.CENTER).setFlexGrow(0);
        }

    }

    public Column<T> addEditColumn(final Consumer<T> editListener, final Predicate<T> predicateIsEnabled) {
        if (this.grid.getColumnByKey(GridUtils.EDIT_COLUMN_KEY) != null) {
            return this.grid.getColumnByKey(GridUtils.EDIT_COLUMN_KEY);
        } else {
            return this.grid.addComponentColumn(entity -> {
                final Button editButton = ButtonUtils.createEditButton();
                editButton.addClickListener(event -> editListener.accept(entity));
                editButton.setEnabled(predicateIsEnabled.test(entity));
                return editButton;

            }).setKey(GridUtils.EDIT_COLUMN_KEY).setHeader("Edit").setTextAlign(ColumnTextAlign.CENTER).setFlexGrow(0);
        }
    }

    public Column<T> addColumn(ValueProvider<T, ?> valueProvider) {
        return GridUtils.addColumn(this.grid, valueProvider);
    }

    public void addAfterDeleteEvent(final Consumer<T> afterDeleteEvent) {
        this.afterDeleteEvents.add(afterDeleteEvent);
    }

    public void addAddEvent(final Consumer<EntityEditor<T>> addEvent) {
        this.addEvents.add(addEvent);
    }

    public Grid<T> getGrid() {
        return this.grid;
    }

    public void addEntity(final T entity) {
        if (this.useInlineEditor) {
            if (editorIsSaved()) {
                internalAddEntity(entity);
                selectEntity(entity);
            }
        } else {
            internalAddEntity(entity);
        }
    }

    public Collection<T> getEntites() {
        return this.entities;
    }

    public boolean isEmpty() {
        if (this.entities.isEmpty()) {
            return true;
        }
        for (final T entity : this.entities) {
            if (!entity.isMarkedToDelete()) {
                return false;
            }
        }
        return true;
    }

    public void setEntities(final Collection<T> entities) {
        /*There's a chance that an editor will still be opened when a grid is refreshed.
        This just makes sure the open editor is valid and closed before refreshing*/
        if (this.useInlineEditor && !editorIsSaved()) {
            return;
        }
        this.entities = entities;

        /*We're recreating the data provider each time so that we can reuse the existing collection of entities rather than copying them to a new collection.
        This allows us flexibility to edit the original entity list and have the grid update.*/
        this.dataProvider = DataProvider.ofCollection(entities);
        this.dataProvider.addDataProviderListener(event -> updateItemCount());
        // Filter out items marked for deletion
        this.dataProvider.addFilterByValue(T::isMarkedToDelete, false);
        this.grid.setDataProvider(this.getDataProvider());
        this.dataProvider.refreshAll();
    }

    public void addFilter(final SerializablePredicate<T> filter) {
        if (editorIsSaved()) {
            this.dataProvider.addFilter(filter);
            this.grid.getDataCommunicator().reset();
            this.grid.recalculateColumnWidths();
        }
    }

    public void clearEntities() {
        if (editorIsSaved() && this.entities != null) {
            this.entities.clear();
            this.dataProvider.refreshAll();
        }
    }

    public void deleteAllEntities() {
        Iterator<T> iterator = this.entities.iterator();
        while (iterator.hasNext()) {
            T entity = iterator.next();
            if (entity.getId() > 0) {
                entity.markToDelete();
            } else {
                iterator.remove();
            }
        }
        this.dataProvider.refreshAll();
    }

    public void resetFilters() {
        if (editorIsSaved()) {
            this.dataProvider.clearFilters();
            addDeletedItemsFilter();
        }
    }

    public Button createAddButton(String text) {
        Button button = ButtonUtils.createAddButton();
        button.setText(text);
        setAddButton(button);

        this.mainVLayout.add(this.addButton);
        return this.addButton;
    }

    public Button createAddButton(String text, final ComponentEventListener<ClickEvent<Button>> buttonClickEvent) {
        createAddButton(text);
        this.addButton.addClickListener(buttonClickEvent);

        return this.addButton;
    }

    public void setAddButton(final Button addButton) {
        this.addButton = addButton;
        this.addButton.addClickListener(event -> {
            for (final Consumer<EntityEditor<T>> addEvent : this.addEvents) {
                addEvent.accept(this);
            }
        });
    }

    public void disableAdding() {
        if (this.addButton != null) {
            this.mainVLayout.remove(this.addButton);
        }
    }

    public boolean editorIsSaved() {
        return !this.grid.getEditor().isOpen() || this.grid.getEditor().save();
    }

    public void useInlineEditor(final Binder<T> binder, final Consumer<T> itemClickListener) {
        this.useInlineEditor = true;

        this.grid.setSelectionMode(SelectionMode.NONE);
        this.grid.getEditor().setBinder(binder);
        this.grid.getEditor().setBuffered(true);

        this.inlineEditorRegistration = this.grid.addItemClickListener(event -> itemClickListener.accept(event.getItem()));
    }

    public void toggleAddButton(final boolean visible) {
        if (this.addButton != null) {
            this.addButton.setVisible(visible);
        }
    }

    public void useInlineEditor(final Binder<T> binder) {
        this.useInlineEditor = true;

        this.grid.setSelectionMode(SelectionMode.NONE);
        this.grid.getEditor().setBinder(binder);
        this.grid.getEditor().setBuffered(true);

        this.inlineEditorRegistration = this.grid.addItemClickListener(event -> selectEntity(Optional.ofNullable(event.getItem())));
    }

    public void reinstateInlineEditor() {
        if (this.useInlineEditor) {
            this.inlineEditorRegistration = this.grid.addItemClickListener(event -> selectEntity(Optional.ofNullable(event.getItem())));
        }
    }

    public void disableInlineEditor() {
        this.useInlineEditor = false;
        this.grid.addItemClickListener(event -> {
        });
    }

    public void selectEntity(final Optional<T> entityOptional) {
        entityOptional.ifPresent(this::selectEntity);
    }

    public void selectEntity(final T entity) {
        if (this.useInlineEditor) {
            if (editorIsSaved()) {
                this.grid.getEditor().cancel();
                this.grid.getEditor().editItem(entity);
                this.grid.getEditor().getBinder().setBean(entity);
            }
        } else {
            this.grid.select(entity);
        }
    }

    public String getLabel() {
        return this.label.getText();
    }

    public void setLabel(final String label) {
        this.labelString = label;
        this.label.setText(label);
        this.label.setVisible(true);
    }

    public void setReadOnly(final boolean readOnly) {
        if (this.addButton != null) {
            this.addButton.setEnabled(!readOnly);
        }
        this.useInlineEditor = !readOnly;
        if (readOnly) {
            if (!this.isReadOnly && this.inlineEditorRegistration != null) {
                this.inlineEditorRegistration.remove();
            }
            disableDeleting();
            disableEditing();
        }
        this.isReadOnly = readOnly;
    }

    public void validate() throws ValidationFailedException {
        ValidationUtils.validateBinder(this.grid.getEditor().getBinder());
        this.grid.getEditor().save();
    }

    public void hideDetailsLayout() {
        this.detailsVLayout.setVisible(false);
        this.gridSplitLayout.setSplitterPosition(100);
    }

    public VerticalLayout showDetailsLayout() {
        return showDetailsLayout(60);
    }

    public VerticalLayout showDetailsLayout(final int defaultSplitterPosition) {
        this.detailsVLayout.setVisible(true);
        this.gridSplitLayout.setSplitterPosition(defaultSplitterPosition);
        return this.detailsVLayout;
    }

    public void addHeaderComponents(Component... components) {
        for (final Component component : components) {
            this.componentsTopHLayout.addComponentAtIndex(this.componentsTopHLayout.getComponentCount(), component);
        }
    }

    public void addHeaderComponentsAtIndex(int index, Component... components) {
        for (final Component component : components) {
            this.componentsTopHLayout.addComponentAtIndex(index, component);
        }
    }
}
