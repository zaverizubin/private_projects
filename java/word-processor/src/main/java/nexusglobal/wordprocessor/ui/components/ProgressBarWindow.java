package nexusglobal.wordprocessor.ui.components;

import com.vaadin.flow.component.UI;
import com.vaadin.flow.component.dialog.Dialog;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.progressbar.ProgressBar;

public class ProgressBarWindow extends Dialog {
    private static final String INNER_HTML = "innerHTML";

    // Autowired components

    // UI components
    private final ProgressBar progressBar = new ProgressBar();
    private final Div div;

    // Global variables
    private UI currentUI;
    private String errorMessage = "";
    private float progress = 0f;

    public ProgressBarWindow(final UI currentUI, final String caption) {
        super();
        this.div = new Div();
        this.div.getElement().setProperty(INNER_HTML, caption);
        initialize(currentUI, caption);
    }

    private void initialize(final UI currentUI, final String caption) {
        this.currentUI = currentUI;
        currentUI.access(() -> {
            currentUI.setPollInterval(200);
            setCloseOnEsc(false);
            setCloseOnOutsideClick(false);

            final VerticalLayout vLayout = new VerticalLayout();
            vLayout.setSpacing(true);
            vLayout.setMargin(false);
            this.div.setText(caption);
            vLayout.add(this.div);
            vLayout.add(this.progressBar);
            add(vLayout);

            open();
        });
    }

    public void setText(String caption) {
        this.currentUI.access(() -> this.div.setText(caption));
    }

    public void setTextAdditive(String caption) {
        this.currentUI.access(() -> this.div.getElement().setProperty(INNER_HTML, this.div.getElement().getProperty(INNER_HTML) + "<br/>" + caption));
    }

    public void cleanUp() {
        this.currentUI.access(() -> {
            this.currentUI.setPollInterval(-1);
            close();
        });
    }

    public void setProgressAdditive(final float progress) {
        this.progress += progress;
        this.currentUI.access(() -> this.progressBar.setValue(this.progress));
    }

    public void setProgress(final float progress) {
        this.currentUI.access(() -> this.progressBar.setValue(progress));
    }

    public boolean hasError() {
        return !this.errorMessage.equals("");
    }

    public String getErrorMessage() {
        return this.errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }


}

