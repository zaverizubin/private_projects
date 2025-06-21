package nexusglobal.wordprocessor.utils;

import com.vaadin.flow.component.ClickEvent;
import com.vaadin.flow.component.UI;
import com.vaadin.flow.component.Unit;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.button.ButtonVariant;
import com.vaadin.flow.component.contextmenu.MenuItem;
import com.vaadin.flow.component.contextmenu.SubMenu;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.icon.Icon;
import com.vaadin.flow.component.icon.IronIcon;
import com.vaadin.flow.component.icon.VaadinIcon;
import com.vaadin.flow.component.menubar.MenuBar;
import com.vaadin.flow.component.menubar.MenuBarVariant;
import com.vaadin.flow.server.StreamResource;

import java.io.InputStream;
import java.util.List;
import java.util.function.Consumer;
import java.util.function.Supplier;

public final class ButtonUtils {

    private ButtonUtils() {
    }

    public static Button createQuietFontAwesomeButton(final ApmFontAwesome fontAwesomeIcon) {
        final Button button = createFontAwesomeButton(fontAwesomeIcon);
        makeQuietButton(button);

        return button;
    }

    public static Button createQuietButton() {
        Button button = new Button();
        makeQuietButton(button);

        return button;
    }

    public static Button createFontAwesomeButton(final ApmFontAwesome fontAwesomeIcon) {
        final Span iconSpan = createFontAwesomeIconSpan(fontAwesomeIcon);
        final Button button = new Button();
        button.setIcon(iconSpan);

        return button;
    }

    public static Button createPrimaryFontAwesomeButton(final ApmFontAwesome fontAwesomeIcon) {
        final Span iconSpan = createFontAwesomeIconSpan(fontAwesomeIcon);
        final Button button = createPrimaryButton();
        button.setIcon(iconSpan);

        return button;
    }

    public static void createAddButton(Button button) {
        button.addThemeVariants(ButtonVariant.LUMO_PRIMARY);
        button.setIcon(new Icon(VaadinIcon.PLUS_CIRCLE));
    }

    public static Button createAddButton() {
        final Button addButton = createPrimaryButton();
        addButton.setIcon(new Icon(VaadinIcon.PLUS_CIRCLE));
        return addButton;
    }

    public static Button createSmallAddButton() {
        final Button addButton = createPrimaryButton();

        addButton.setIcon(new Icon(VaadinIcon.PLUS_CIRCLE));
        addButton.addThemeName("small");

        return addButton;
    }

    public static Button createWhiteAddButton() {
        final Button addButton = createWhiteButton();
        addButton.setIcon(new Icon(VaadinIcon.PLUS_CIRCLE));
        addButton.addThemeName("small");
        return addButton;
    }

    private static Button createWhiteButton() {
        final Button button = new Button();
        button.getStyle().set("background-color", "white");
        button.getStyle().set("color", "var(--application-main-color)");
        return button;
    }

    public static Button createDeleteButton() {
        final Button deleteButton = createFontAwesomeButton(ApmFontAwesome.TRASH_SOLID);
        deleteButton.setThemeName(ApmTheme.THEME_BUTTON_DELETE);
        deleteButton.addThemeVariants(ButtonVariant.LUMO_ICON);
        return deleteButton;
    }

    public static Button createRefreshButton() {
        Button button = ButtonUtils.createWhiteButton();
        button.setWidth(35, Unit.PIXELS);
        button.setHeight(35, Unit.PIXELS);
        button.setIcon(new Icon(VaadinIcon.REFRESH));
        ButtonUtils.addTooltip(button, button.getTranslation("Show/Hide Columns"));

        return button;
    }

    public static Button createGridColumnsButton() {
        Button button = ButtonUtils.createWhiteButton();
        button.setWidth(30, Unit.PIXELS);
        button.setHeight(35, Unit.PIXELS);
        button.setIcon(new Icon(VaadinIcon.ELLIPSIS_V));
        ButtonUtils.addTooltip(button, button.getTranslation("Show/Hide Columns"));

        return button;
    }

    public static Button createEditButton() {
        return createQuietFontAwesomeButton(ApmFontAwesome.PENCIL_LIGHT);
    }

    public static Button createViewButton() {
        return createQuietFontAwesomeButton(ApmFontAwesome.EYE);
    }

    public static Button createUnavailableButton() {
        return createQuietFontAwesomeButton(ApmFontAwesome.TIMES_CIRCLE_LIGHT);
    }

    public static void makeQuietButton(final Button button) {
        button.setThemeName(ApmTheme.THEME_BUTTON_QUIET);
        button.addThemeVariants(ButtonVariant.LUMO_ICON);
    }

    public static void addTooltip(final Button button, final String tooltip) {
        button.getElement().setAttribute("title", tooltip);
    }

    public static Button createPrimaryButton() {
        return createPrimaryButton("");
    }

    public static Button createPrimaryButton(String text) {
        final Button button = new Button();
        button.addThemeVariants(ButtonVariant.LUMO_PRIMARY);
        button.setText(text);

        return button;
    }

    public static Button createCloseButton() {
        final Button closeButton = createPrimaryButton();
        closeButton.addThemeVariants(ButtonVariant.LUMO_ERROR, ButtonVariant.LUMO_SMALL, ButtonVariant.LUMO_ICON);
        closeButton.setIcon(new IronIcon("lumo", "cross"));
        return closeButton;
    }

    public static Button createHelpButton() {
        return createQuietFontAwesomeButton(ApmFontAwesome.QUESTION_CIRCLE_LIGHT);
    }

    public static Button createLinkButton(String text) {
        Button linkButton = new Button();
        linkButton.addThemeVariants(ButtonVariant.LUMO_TERTIARY_INLINE);
        linkButton.setText(text);

        return linkButton;
    }

    public static Button createSaveButton() {
        Button saveButton = createPrimaryButton();
        saveButton.addThemeVariants(ButtonVariant.LUMO_SUCCESS);
        saveButton.setIcon(new IronIcon("lumo", "checkmark"));

        return saveButton;
    }

    public static Button createSaveButton(String text) {
        Button saveButton = createSaveButton();
        saveButton.setText(text);

        return saveButton;
    }

    public static Button createDeleteButtonWithText(String text) {
        Button deleteButton = createPrimaryFontAwesomeButton(ApmFontAwesome.TRASH_SOLID);
        deleteButton.setText(text);
        deleteButton.addThemeVariants(ButtonVariant.LUMO_ERROR);

        return deleteButton;
    }

    public static Span createFontAwesomeIconSpan(final ApmFontAwesome fontAwesomeIcon) {
        final Span iconSpan = new Span();
        iconSpan.setClassName(fontAwesomeIcon.cssClass());

        return iconSpan;
    }

    public static Button createPrintButton(String text, Supplier<String> fileNameSupplier, Supplier<InputStream> inputStreamSupplier) {
        final Button printButton = createPrimaryFontAwesomeButton(ApmFontAwesome.PRINT_LIGHT);
        printButton.setText(text);
        printButton.addClickListener(event -> {
            // Get the input stream while the session is still available. If we do it inside the InputStreamFactory, we lose session
            InputStream inputStream = inputStreamSupplier.get();
            String fileName = fileNameSupplier.get();
            printButton.getElement().setAttribute("reporturl", new StreamResource(fileName, () -> inputStream));
            UI.getCurrent().getPage().open(printButton.getElement().getAttribute("reporturl"));
        });

        return printButton;
    }

    public static void anchorButtonToRight(Button button) {
        button.getElement().getStyle().set("margin-left", "auto").set("margin-right", "10px");
    }

    public static MenuBar createMultiSelectButton(Consumer<ClickEvent<MenuItem>> listener, String menuText, List<String> submenuTextList) {
        final MenuBar menuBar = new MenuBar();
        menuBar.addThemeVariants(MenuBarVariant.LUMO_SMALL, MenuBarVariant.LUMO_TERTIARY);

        final Button addButton = ButtonUtils.createWhiteAddButton();
        addButton.setText(menuText);
        addButton.addClickListener(event -> {
        });
        final MenuItem menuItem = menuBar.addItem(addButton);

        final SubMenu subMenu = menuItem.getSubMenu();
        for (final String submenuText : submenuTextList) {
            subMenu.addItem(submenuText, listener::accept);
        }
        return menuBar;
    }
}
