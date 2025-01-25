package nexusglobal.controlpanel.interfaces;

import com.vaadin.flow.component.Component;
import nexusglobal.controlpanel.ui.shared.HeaderComponent;

public interface ContentView extends View {

    String getPageTitle();

    HeaderComponent getHeaderComponent();

    Component getContentComponent();

}
