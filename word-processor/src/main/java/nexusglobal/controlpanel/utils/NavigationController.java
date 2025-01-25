package nexusglobal.controlpanel.utils;


import com.vaadin.flow.component.Component;
import com.vaadin.flow.component.UI;
import com.vaadin.flow.router.HasUrlParameter;
import com.vaadin.flow.router.QueryParameters;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.router.RouteConfiguration;
import com.vaadin.flow.spring.annotation.SpringComponent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.*;

@SpringComponent
public class NavigationController {

    private static final Logger LOGGER = LoggerFactory.getLogger(NavigationController.class);
    private static final String INTEGER_PARAMETER = "Query String Integer Parameter";


    @Autowired
    public NavigationController() {
        super();
    }

    public static void refreshPage() {
        UI.getCurrent().getPage().reload();
    }

    public static String[] splitParameters(final String parameters) {
        return parameters.split("/");
    }

    public static Optional<Integer> getIntegerParameter(final String[] parameters, final int parameterIndex) {

        Integer integerParameter = null;
        try {
            integerParameter = Integer.parseInt(parameters[parameterIndex]);
        } catch (IndexOutOfBoundsException | NumberFormatException ex) {
            LOGGER.debug(INTEGER_PARAMETER, ex);
        }

        return Optional.ofNullable(integerParameter);
    }

    public static Optional<String> getStringParameter(final String parameterString, final int parameterIndex) {

        if (parameterString == null || parameterString.isEmpty()) {
            return Optional.empty();
        }

        String stringParameter = null;
        try {
            stringParameter = parameterString.split("/")[parameterIndex];
        } catch (final IndexOutOfBoundsException ex) {
            LOGGER.debug(INTEGER_PARAMETER, ex);
        }

        return Optional.ofNullable(stringParameter);
    }

    public static Optional<String> getStringParameter(final String[] parameters, final int parameterIndex) {

        String stringParameter = null;
        try {
            stringParameter = parameters[parameterIndex];
        } catch (final IndexOutOfBoundsException ex) {
            LOGGER.debug(INTEGER_PARAMETER, ex);
        }

        return Optional.ofNullable(stringParameter);
    }

    private <T, C extends Component & HasUrlParameter<T>> String getFullURLForViewClass(final Class<C> viewClass, final T parameter) {
        return RouteConfiguration.forApplicationScope().getUrl(viewClass, parameter);
    }

    public void openView(final Class<? extends Component> viewClass) {
        UI.getCurrent().navigate(viewClass);
    }

    public <T, C extends Component & HasUrlParameter<T>> void openView(final Class<? extends C> viewClass, final T parameter) {
        UI.getCurrent().navigate(viewClass, parameter);
    }

    public <C extends Component & HasUrlParameter<String>> void openView(final Class<? extends C> viewClass, final Object... parameters) {

        final StringBuilder parameterBuilder = new StringBuilder();
        for (final Object parameter : parameters) {
            parameterBuilder.append(parameter.toString()).append("/");
        }
        UI.getCurrent().navigate(viewClass, parameterBuilder.toString());
    }

    public <T, C extends Component & HasUrlParameter<T>> void openViewWithQueryParameter(final Class<? extends C> viewClass, final T parameter, final String queryParameterName,
                                                                                         final String queryParameterValue) {
        final Map<String, List<String>> queryParameters = new HashMap<>();
        queryParameters.put(queryParameterName, Collections.singletonList(queryParameterValue));

        openViewWithQueryParameters(viewClass, parameter, queryParameters);
    }

    public <T, C extends Component & HasUrlParameter<T>> void openViewWithQueryParameters(final Class<? extends C> viewClass, final T parameter, final Map<String, List<String>> parameters) {
        final String location = getFullURLForViewClass(viewClass, parameter);
        UI.getCurrent().navigate(location, new QueryParameters(parameters));
    }

    public void openView(final String url) {
        UI.getCurrent().navigate(url);
    }

    public void openView(final String viewName, final String... parameters) {

        final StringBuilder parameterBuilder = new StringBuilder();
        for (final String parameter : parameters) {
            parameterBuilder.append("/").append(Base64.getEncoder().encodeToString(parameter.getBytes()));
        }
        UI.getCurrent().navigate(viewName + parameterBuilder);
    }

    public void openViewAsync(final UI currentUI, final String viewName) {
        currentUI.access(() -> currentUI.navigate(viewName));
    }

    public void openViewAsync(final UI currentUI, final String viewName, final String... parameters) {

        final StringBuilder parameterBuilder = new StringBuilder();
        for (final String parameter : parameters) {
            parameterBuilder.append("/").append(Base64.getEncoder().encodeToString(parameter.getBytes()));
        }
        currentUI.access(() -> currentUI.navigate(viewName + parameterBuilder));
    }

    public void goBack() {
        UI.getCurrent().getPage().getHistory().back();
    }

    public String getPathForViewClass(final Class<? extends Component> viewClass) {
        if (!viewClass.isAnnotationPresent(Route.class)) {
            throw new UnsupportedOperationException();
        }
        return viewClass.getAnnotation(Route.class).value();
    }

    public <T, C extends HasUrlParameter<T>> String getPathForViewClass(final Class<C> viewClass, final T parameter) {
        if (!viewClass.isAnnotationPresent(Route.class)) {
            throw new UnsupportedOperationException();
        }
        return viewClass.getAnnotation(Route.class).value() + "/" + parameter.toString();
    }

    public <C extends HasUrlParameter<String>> String getPathForViewClassWithWildcardParameters(final Class<C> viewClass, final Object... parameters) {
        if (!viewClass.isAnnotationPresent(Route.class)) {
            throw new UnsupportedOperationException();
        }
        final StringBuilder parameterBuilder = new StringBuilder();
        for (final Object parameter : parameters) {
            parameterBuilder.append(parameter.toString()).append("/");
        }
        return viewClass.getAnnotation(Route.class).value() + "/" + parameterBuilder;
    }


}
