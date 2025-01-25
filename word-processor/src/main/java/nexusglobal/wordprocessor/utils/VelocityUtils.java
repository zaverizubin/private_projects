package nexusglobal.wordprocessor.utils;

import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.Velocity;
import org.springframework.stereotype.Component;

import java.io.StringWriter;

@Component
public class VelocityUtils {

    public String evaluate(final VelocityContext context, final String templateToEvaluate) {
        final StringWriter writer = new StringWriter();
        Velocity.evaluate(context, writer, "velocity log", templateToEvaluate);
        return writer.toString();
    }
}
