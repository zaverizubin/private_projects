package nexusglobal.wordprocessor.ui.shared;

import com.vaadin.flow.component.HasElement;
import com.vaadin.flow.component.Tag;
import com.vaadin.flow.component.dependency.JsModule;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.polymertemplate.Id;
import com.vaadin.flow.component.polymertemplate.PolymerTemplate;
import com.vaadin.flow.router.AfterNavigationEvent;
import com.vaadin.flow.router.AfterNavigationObserver;
import com.vaadin.flow.router.ParentLayout;
import com.vaadin.flow.router.RouterLayout;
import com.vaadin.flow.templatemodel.TemplateModel;
import nexusglobal.wordprocessor.annotations.UIScopedComponent;
import nexusglobal.wordprocessor.interfaces.ContentView;
import nexusglobal.wordprocessor.interfaces.Loggable;
import org.springframework.beans.factory.annotation.Autowired;

@ParentLayout(MainView.class)
@UIScopedComponent
@Tag("main-component")
@JsModule("./src/views/shared/main-component.js")
public class MainComponent extends PolymerTemplate<MainComponent.MainComponentModel> implements RouterLayout, AfterNavigationObserver, Loggable {

    // Autowired components

    // UI components
    @Id("headerDiv")
    private Div headerDiv;

    // Global variables

    public interface MainComponentModel extends TemplateModel {

    }

    @Autowired
    public MainComponent() {
        super();
    }

    @Override
    public void afterNavigation(AfterNavigationEvent afterNavigationEvent) {
        //do nothing
    }

    @Override
    public void showRouterLayoutContent(final HasElement content) {

        if (content instanceof ContentView) {
            // Add header component
            this.headerDiv.removeAll();
            this.headerDiv.add(((ContentView) content).getHeaderComponent());

            // Do this here instead of having to do it in every class since it's consistent
            ((ContentView) content).getHeaderComponent().setTitle(((ContentView) content).getPageTitle());

            // Add content component
            this.getElement().removeAllChildren();
            this.getElement().appendChild(((ContentView) content).getContentComponent().getElement());
        }
    }
}

