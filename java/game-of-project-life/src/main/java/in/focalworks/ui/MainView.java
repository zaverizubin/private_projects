package in.focalworks.ui;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.vaadin.flow.component.HasElement;
import com.vaadin.flow.component.Tag;
import com.vaadin.flow.component.dependency.HtmlImport;
import com.vaadin.flow.component.page.Viewport;
import com.vaadin.flow.component.polymertemplate.Id;
import com.vaadin.flow.component.polymertemplate.PolymerTemplate;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.RouterLayout;
import com.vaadin.flow.templatemodel.TemplateModel;

import in.focalworks.ui.components.AppNavigation;
import in.focalworks.ui.entities.PageInfo;
import in.focalworks.ui.utils.AppConst;


@Tag("main-view")
@HtmlImport("src/main-view.html")
@PageTitle(AppConst.TITLE_DEFAULT)
@Viewport(AppConst.VIEWPORT)
public class MainView extends PolymerTemplate<TemplateModel> implements RouterLayout {

	@Id("appNavigation")
	private AppNavigation appNavigation;

	@Autowired
	public MainView() {
		final List<PageInfo> pages = new ArrayList<>();

		pages.add(new PageInfo(AppConst.PAGE_USERS, AppConst.ICON_USERS, AppConst.TITLE_USERS));
		pages.add(new PageInfo(AppConst.PAGE_TEAMS, AppConst.ICON_TEAMS, AppConst.TITLE_TEAMS));
		pages.add(new PageInfo(AppConst.PAGE_ROOMS, AppConst.ICON_ROOMS, AppConst.TITLE_ROOMS));
		pages.add(new PageInfo(AppConst.PAGE_SESSIONS, AppConst.ICON_SESSIONS, AppConst.TITLE_SESSIONS));
		pages.add(new PageInfo(AppConst.PAGE_LOGOUT, AppConst.ICON_LOGOUT, AppConst.TITLE_LOGOUT));

		appNavigation.init(pages, AppConst.PAGE_DEFAULT, AppConst.PAGE_LOGOUT);
	}

	@Override
	public void showRouterLayoutContent(final HasElement content) {
		if (content != null) {
			getElement().appendChild(content.getElement());
		}
	}

}
