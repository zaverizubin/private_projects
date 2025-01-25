package nexusglobal.controlpanel.ui.shared;

import com.vaadin.flow.component.Tag;
import com.vaadin.flow.component.contextmenu.MenuItem;
import com.vaadin.flow.component.dependency.JsModule;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.icon.Icon;
import com.vaadin.flow.component.icon.VaadinIcon;
import com.vaadin.flow.component.menubar.MenuBar;
import com.vaadin.flow.component.menubar.MenuBarVariant;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.polymertemplate.Id;
import com.vaadin.flow.component.polymertemplate.PolymerTemplate;
import com.vaadin.flow.spring.annotation.SpringComponent;
import com.vaadin.flow.templatemodel.TemplateModel;
import nexusglobal.controlpanel.ui.ChangePasswordComponent;
import nexusglobal.controlpanel.utils.SecurityUtils;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Scope;

@SpringComponent
@Scope(BeanDefinition.SCOPE_PROTOTYPE)
@Tag("header-component")
@JsModule("./src/views/shared/header-component.js")
public class HeaderComponent extends PolymerTemplate<HeaderComponent.HeaderComponentModel> {

    //Autowired
    private final SecurityUtils securityUtils;
    private final ChangePasswordComponent changePasswordComponent;

    // UI Components
    @Id("menuSectionHLayout")
    protected HorizontalLayout menuSectionHLayout;
    @Id("firstSectionComponentsHLayout")
    private HorizontalLayout firstSectionComponentsHLayout;
    @Id("titleSpan")
    private Span titleSpan;


    // Global Variables
    private String title;
    protected MenuBar helpMenu;
    protected MenuItem helpMenuItem;

    public interface HeaderComponentModel extends TemplateModel {
        String getTitle();

        void setTitle(String title);
    }

    protected HeaderComponent(final SecurityUtils securityUtils, final ChangePasswordComponent changePasswordComponent) {
        super();
        this.securityUtils = securityUtils;
        this.changePasswordComponent = changePasswordComponent;

        addMenu();
    }

    private void addMenu() {
        this.helpMenu = new MenuBar();
        this.helpMenu.addThemeVariants(MenuBarVariant.LUMO_PRIMARY);
        this.helpMenu.addThemeVariants(MenuBarVariant.LUMO_LARGE);

        this.helpMenuItem = this.helpMenu.addItem(new Icon(VaadinIcon.QUESTION_CIRCLE_O));
        this.helpMenuItem.getSubMenu().addItem("Logout", event -> this.securityUtils.logout());

        this.menuSectionHLayout.add(this.helpMenu);
    }

    public String getTitle() {
        return this.title;
    }

    public void setTitle(final String title) {
        this.title = title;
        getModel().setTitle("Document Processor" + " - " + title);
        getElement().executeJs("document.title = '" + title + "'");
    }


}
