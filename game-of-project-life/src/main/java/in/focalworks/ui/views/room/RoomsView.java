package in.focalworks.ui.views.room;

import org.springframework.beans.factory.annotation.Autowired;

import com.vaadin.flow.component.Tag;
import com.vaadin.flow.component.dependency.HtmlImport;
import com.vaadin.flow.component.polymertemplate.PolymerTemplate;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.router.RouterLayout;
import com.vaadin.flow.templatemodel.TemplateModel;

import in.focalworks.ui.MainView;
import in.focalworks.ui.utils.AppConst;

@Tag("rooms-view")
@HtmlImport("src/views/room/rooms-view.html")
@Route(value = AppConst.PAGE_ROOMS, layout = MainView.class)
@PageTitle(AppConst.TITLE_ROOMS)

public class RoomsView extends PolymerTemplate<TemplateModel> implements RouterLayout {

	@Autowired
	public RoomsView() {

	}
}

