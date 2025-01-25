package nexusglobal.wordprocessor.interfaces;

import com.vaadin.flow.component.Component;
import nexusglobal.wordprocessor.ui.shared.HeaderComponent;

public interface ContentView extends View {

    String getPageTitle();

    HeaderComponent getHeaderComponent();

    Component getContentComponent();

}
