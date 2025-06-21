package nexusglobal.controlpanel.annotations;

import com.vaadin.flow.spring.annotation.SpringComponent;
import com.vaadin.flow.spring.annotation.UIScope;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

@UIScope
@SpringComponent
@Retention(RetentionPolicy.RUNTIME)
public @interface UIScopedComponent {

    String value() default "";
}
