package nexusglobal.wordprocessor.annotations;

import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

@Component
@Scope(BeanDefinition.SCOPE_PROTOTYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface PrototypeComponent {

    String value() default "";
}

