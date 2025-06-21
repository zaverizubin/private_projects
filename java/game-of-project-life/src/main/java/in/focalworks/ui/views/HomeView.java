package in.focalworks.ui.views;

import org.springframework.beans.factory.annotation.Autowired;

import com.vaadin.flow.component.Tag;
import com.vaadin.flow.component.dependency.HtmlImport;
import com.vaadin.flow.component.polymertemplate.PolymerTemplate;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.router.RouterLayout;
import com.vaadin.flow.templatemodel.TemplateModel;

import in.focalworks.ui.MainView;

@Tag("home-view")
@HtmlImport("src/views/home-view.html")
@Route(value = "", layout = MainView.class)
@PageTitle("Game of Project Life")

public class HomeView extends PolymerTemplate<TemplateModel> implements RouterLayout {

	@Autowired
	public HomeView() {

	}

}
