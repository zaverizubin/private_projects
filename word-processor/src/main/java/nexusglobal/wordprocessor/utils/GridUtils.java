package nexusglobal.wordprocessor.utils;

import com.vaadin.flow.component.ClickEvent;
import com.vaadin.flow.component.Component;
import com.vaadin.flow.component.ComponentEventListener;
import com.vaadin.flow.component.HasSize;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.checkbox.Checkbox;
import com.vaadin.flow.component.combobox.ComboBox;
import com.vaadin.flow.component.contextmenu.ContextMenu;
import com.vaadin.flow.component.contextmenu.MenuItem;
import com.vaadin.flow.component.grid.ColumnTextAlign;
import com.vaadin.flow.component.grid.Grid;
import com.vaadin.flow.component.grid.Grid.Column;
import com.vaadin.flow.component.grid.GridSortOrder;
import com.vaadin.flow.component.textfield.TextField;
import com.vaadin.flow.data.binder.BeanValidationBinder;
import com.vaadin.flow.data.binder.Binder;
import com.vaadin.flow.data.binder.Setter;
import com.vaadin.flow.data.provider.SortDirection;
import com.vaadin.flow.data.renderer.Renderer;
import com.vaadin.flow.data.renderer.TemplateRenderer;
import com.vaadin.flow.data.validator.BeanValidator;
import com.vaadin.flow.function.ValueProvider;
import nexusglobal.wordprocessor.interfaces.Translatable;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.function.BooleanSupplier;
import java.util.function.Consumer;
import java.util.function.Predicate;
import java.util.function.Supplier;

public final class GridUtils {

    public static final String EDIT_COLUMN_KEY = "editColumn";

    private GridUtils() {

    }

    public static <T> TextField createTextField(final T entity, final String propertyName, final ValueProvider<T, String> getter, final Setter<T, String> setter) {
        final TextField textField = createTextField();

        final Binder<T> binder = new Binder<>();
        binder.forField(textField).withValidator(createBeanValidator(entity, propertyName)).bind(getter, setter);
        binder.setBean(entity);

        return textField;
    }

    public static Checkbox createCheckBox(final BooleanSupplier getter, final Consumer<Boolean> setter) {

        final Checkbox checkBox = createCheckBox();
        checkBox.setValue(getter.getAsBoolean());
        checkBox.addValueChangeListener(event -> setter.accept(event.getValue()));

        return checkBox;
    }

    public static <T> ComboBox<String> createComboBox(final T entity, final Class<T> beanType, final List<String> items, final ValueProvider<T, String> getter, final Setter<T, String> setter) {

        final ComboBox<String> comboBox = createComboBox();
        comboBox.setItems(items);

        final BeanValidationBinder<T> binder = new BeanValidationBinder<>(beanType);
        binder.bind(comboBox, getter, setter);

        binder.setBean(entity);

        return comboBox;
    }

    public static ComboBox<String> createComboBox(final List<String> items, final Supplier<String> getter, final Consumer<String> setter) {

        final ComboBox<String> comboBox = createComboBox();
        comboBox.setValue(getter.get());
        comboBox.addValueChangeListener(event -> setter.accept(event.getValue()));
        comboBox.setItems(items);

        return comboBox;
    }

    public static Button createLinkButton(final String caption, final ComponentEventListener<ClickEvent<Button>> clickListener) {
        final Button button = createButton();
        button.setText(caption);
        button.addClickListener(clickListener);
        return button;
    }

    public static TextField createTextField() {
        final TextField textField = new TextField();
        textField.setWidth("100%");

        return textField;
    }

    public static Checkbox createCheckBox() {
        return new Checkbox();
    }

    public static Button createButton() {
        return new Button();
    }

    public static ComboBox<String> createComboBox() {
        final ComboBox<String> comboBox = new ComboBox<>();
        comboBox.setWidth("100%");

        return comboBox;
    }

    private static <T> BeanValidator createBeanValidator(final T entity, final String propertyName) {
        return new BeanValidator(entity.getClass(), propertyName);
    }

    public static <T> Column<T> addDefaultProperties(final Column<T> column) {
        column.setResizable(true).setSortable(true);
        return column;
    }

    public static <T> Column<T> addColumn(Grid<T> grid, ValueProvider<T, ?> valueProvider) {
        return addDefaultProperties(grid.addColumn(valueProvider));
    }

    public static <T> Column<T> addColumn(Grid<T> grid, ValueProvider<T, ?> valueProvider, String header) {
        return addDefaultProperties(grid.addColumn(valueProvider)).setHeader(header);
    }

    public static <T> Column<T> addColumn(Grid<T> grid, Renderer<T> renderer, String header) {
        return addDefaultProperties(grid.addColumn(renderer)).setHeader(header);
    }

    public static <T, E extends Component & HasSize> Column<T> addColumn(Grid<T> grid, ValueProvider<T, ?> valueProvider, String header, final E editorComponent) {
        editorComponent.setSizeFull();
        return addDefaultProperties(grid.addColumn(valueProvider)).setHeader(header).setEditorComponent(editorComponent);
    }

    public static <T, V extends Component> Column<T> addComponentColumn(Grid<T> grid, ValueProvider<T, V> componentProvider, String header) {
        return grid.addComponentColumn(componentProvider).setHeader(header).setResizable(true);
    }

    public static <T, V extends Component> Column<T> addIconColumn(Grid<T> grid, ValueProvider<T, V> componentProvider, String header) {
        return grid.addComponentColumn(componentProvider).setHeader(header);
    }

    public static <T, V extends Component, E extends Component & HasSize> Column<T> addComponentColumn(Grid<T> grid, ValueProvider<T, V> componentProvider, final String header,
                                                                                                       final E editorComponent) {
        return grid.addComponentColumn(componentProvider).setHeader(header).setResizable(true).setEditorComponent(editorComponent);
    }

    public static <T> void sort(final Grid<T> grid, final Column<T> column, final SortDirection sortDirection) {
        grid.sort(Collections.singletonList(new GridSortOrder<>(column, sortDirection)));
    }

    public static <T> Column<T> addEditColumn(Grid<T> grid, final Consumer<T> editListener, Component component, final Predicate<T> predicateIsEnabled) {
        if (grid.getColumnByKey(EDIT_COLUMN_KEY) != null) {
            return grid.getColumnByKey(EDIT_COLUMN_KEY);
        } else {
            return grid.addComponentColumn(entity -> {
                final Button editButton = ButtonUtils.createEditButton();
                editButton.addClickListener(event -> editListener.accept(entity));
                editButton.setEnabled(predicateIsEnabled.test(entity));
                return editButton;

            }).setKey(EDIT_COLUMN_KEY).setHeader(component.getTranslation("Edit")).setTextAlign(ColumnTextAlign.CENTER).setFlexGrow(0);
        }
    }

    public static <T, E extends Component & HasSize> Column<T> addBooleanColumnRenderer(Component view, Grid<T> grid, Predicate<T> booleanProperty, final String header,
                                                                                        final E editorComponent) {
        return grid
                .addColumn(TemplateRenderer.<T>of("[[item.booleanPropertyAsString]]").withProperty("booleanPropertyAsString",
                        item -> booleanProperty.test(item) ? view.getTranslation("Yes") : view.getTranslation("No")))
                .setHeader(header).setSortable(true).setResizable(true).setEditorComponent(editorComponent);
    }

    public static <T, U extends Enum<U>> ContextMenu buildGridColumnsContextMenu(Grid<T> grid, Set<U> gridColumnEnumSet) {
        ContextMenu contextMenu = new ContextMenu();
        contextMenu.setOpenOnClick(true);
        for (Enum<U> gridColumnEnum : gridColumnEnumSet) {
            createMenuItem(contextMenu, grid, gridColumnEnum);
        }
        return contextMenu;
    }

    private static <T, U extends Enum<U>> void createMenuItem(ContextMenu contextMenu, Grid<T> grid, Enum<U> gridColumnEnum) {
        String checkedAttribute = "menu-item-checked";

        MenuItem menuItem = contextMenu.addItem(((Translatable) gridColumnEnum).translate(grid), event -> {
            Column<T> column = grid.getColumnByKey(gridColumnEnum.name());
            if (column != null) {
                column.setVisible(event.getSource().isChecked());
                event.getSource().setChecked(column.isVisible());
            }
        });

        menuItem.setId(gridColumnEnum.name());
        menuItem.setCheckable(true);
        menuItem.getElement().setAttribute("onclick", "event.stopPropagation()");
        menuItem.getElement().addEventListener("click", e -> {
            if (!menuItem.isCheckable()) {
                return;
            }
            if (menuItem.isChecked()) {
                menuItem.getElement().executeJs("this.setAttribute('" + checkedAttribute + "', '')");
            } else {
                menuItem.getElement().executeJs("this.removeAttribute('" + checkedAttribute + "')");
            }
        }).addEventData("event.preventDefault()");
    }

}
