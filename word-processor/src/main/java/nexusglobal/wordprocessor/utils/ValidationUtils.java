package nexusglobal.wordprocessor.utils;

import com.vaadin.flow.data.binder.Binder;
import com.vaadin.flow.data.binder.BinderValidationStatus;
import nexusglobal.wordprocessor.exceptions.ValidationFailedException;
import nexusglobal.wordprocessor.interfaces.Loggable;
import org.springframework.stereotype.Component;

import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;
import java.util.HashSet;
import java.util.Set;
import java.util.regex.Pattern;

@Component
public final class ValidationUtils implements Loggable {

    public static final String VALID_EMAIL_REGEX = "^([a-zA-Z0-9_\\.\\-+])+@(([a-zA-Z0-9-])+\\.)+([a-zA-Z0-9]{2,4})+$";
    public static final String VALID_PASSWORD_REGEX = "^(?=.*\\d)(?=.*[a-zA-Z]).{8,}$";

    private ValidationUtils() {
        super();
    }

    public static <T> void validateObject(final T objectToValidate) throws ValidationFailedException {

        final ValidatorFactory validatorFactory = Validation.buildDefaultValidatorFactory();
        final Validator validator = validatorFactory.getValidator();

        final Set<ConstraintViolation<T>> validationErrors = validator.validate(objectToValidate);
        if (!validationErrors.isEmpty()) {
            throw new ValidationFailedException(new HashSet<>(validationErrors));
        }
    }

    public static <T> void validateBinder(final Binder<T> binder) throws ValidationFailedException {
        // Bean is null if readBean is used so as a secondary check, see if any fields have been bound. If so, then validate them.
        if (binder.getBean() != null) {
            final BinderValidationStatus<T> status = binder.validate();

            if (status.hasErrors()) {
                throw new ValidationFailedException(status.getValidationErrors());
            }
        }
    }

    public static boolean isNotNullOrEmpty(final String stringToValidate) {
        return stringToValidate != null && !stringToValidate.isEmpty();
    }

    public static boolean isValidPassword(final String password) {
        return isNotNullOrEmpty(password) && Pattern.matches(VALID_PASSWORD_REGEX, password);
    }

}