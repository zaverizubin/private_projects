package nexusglobal.controlpanel.ui.components;

import com.vaadin.flow.component.Component;
import com.vaadin.flow.component.Unit;
import com.vaadin.flow.component.dialog.Dialog;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import nexusglobal.controlpanel.utils.ApmTheme;
import org.apache.commons.lang3.StringUtils;

import java.util.ArrayList;
import java.util.List;

public class HeaderDialog extends Dialog {
    // Autowired Components

    // Global Variables
    private final List<Runnable> closeListeners = new ArrayList<>();
    // UI Components
    protected HorizontalLayout headerHLayout = new HorizontalLayout();
    protected Span headerTextSpan = new Span();
    private int headerTextWidth = 100;

    public HeaderDialog() {
        super();
        buildUI();
    }

    public HeaderDialog(int headerTextWidth) {
        super();
        this.headerTextWidth = headerTextWidth;
        buildUI();
    }

    private void buildUI() {
        setupHeaderLayout();
        setupDialog();
    }

    private void setupHeaderLayout() {
        this.headerTextSpan.addClassName(ApmTheme.DIALOG_HEADER_TEXT);
        this.headerTextSpan.getStyle().set("width", StringUtils.join(this.headerTextWidth, "%"));
        this.headerHLayout.addComponentAsFirst(this.headerTextSpan);

        this.headerHLayout.setWidthFull();
        this.headerHLayout.setPadding(true);
        this.headerHLayout.getStyle().set("cursor", "move");
        this.headerHLayout.getStyle().set("border-radius", "10px");
        this.headerHLayout.getStyle().set("border-top-right-radius", "var(--lumo-border-radius-m)");
        this.headerHLayout.addClassName("draggable");

        add(this.headerHLayout);
    }

    private void setupDialog() {
        getElement().setAttribute("theme", ApmTheme.NO_PADDING);

        setCloseOnOutsideClick(false);
        setCloseOnEsc(false);
        setDraggable(true);
        setResizable(true);

        addOpenedChangeListener(event -> {
            if (!event.isOpened()) {
                for (Runnable closeListener : this.closeListeners) {
                    closeListener.run();
                }
            }
        });
    }

    public void setSizeInPixels(int width, int height) {
        setWidth(width, Unit.PIXELS);
        setHeight(height, Unit.PIXELS);
    }

    public void setSizeInPercentage(int width, int height) {
        setWidth(width, Unit.PERCENTAGE);
        setHeight(height, Unit.PERCENTAGE);
    }

    public void addHeader(String text) {
        this.headerTextSpan.setText(text);
    }

    public void addContent(Component... components) {
        final VerticalLayout vLayout = new VerticalLayout();
        vLayout.setMargin(true);
        vLayout.setPadding(false);
        vLayout.setSpacing(false);
        vLayout.setWidth(95, Unit.PERCENTAGE);
        vLayout.setHeight(80, Unit.PERCENTAGE);
        vLayout.add(components);
        vLayout.getElement().getStyle().set("overflow", "auto");
        add(vLayout);
    }

    public void addCloseListener(Runnable closeListener) {
        this.closeListeners.add(closeListener);
    }
}