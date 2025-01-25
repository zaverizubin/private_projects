package nexusglobal.wordprocessor.exceptions;

import com.vaadin.flow.data.binder.ValidationResult;

import javax.validation.ConstraintViolation;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

public class ValidationFailedException extends Exception {

    private Set<ConstraintViolation<?>> validationErrors = null;
    private List<ValidationResult> validationResults = null;
    private String title = null;
    private String validationErrorMessage = null;

    public ValidationFailedException() {
        super();
    }

    public ValidationFailedException(final Set<ConstraintViolation<?>> validationErrors) {
        this.validationErrors = new LinkedHashSet<>();
        this.validationErrors.addAll(validationErrors);
    }

    public ValidationFailedException(final List<ValidationResult> validationErrors) {
        this.validationResults = new ArrayList<>();
        this.validationResults.addAll(validationErrors);
    }

    public ValidationFailedException(final String validationErrorMessage) {
        this.validationErrorMessage = validationErrorMessage;
    }

    public ValidationFailedException(final String title, final String validationErrorMessage) {
        this.title = title;
        this.validationErrorMessage = validationErrorMessage;
    }

    private String getConstraintViolationErrorMessages() {
        final StringBuilder errorMessagesBuilder = new StringBuilder();
        for (final ConstraintViolation<?> error : this.validationErrors) {
            errorMessagesBuilder.append(error.getMessage()).append("<br>");
        }
        errorMessagesBuilder.delete(errorMessagesBuilder.lastIndexOf("<br>"), errorMessagesBuilder.length());
        return errorMessagesBuilder.toString();
    }

    private String getValidationResultsErrorMessages() {
        final StringBuilder errorMessagesBuilder = new StringBuilder();
        for (final ValidationResult result : this.validationResults) {
            errorMessagesBuilder.append(result.getErrorMessage()).append("<br>");
        }
        errorMessagesBuilder.delete(errorMessagesBuilder.lastIndexOf("<br>"), errorMessagesBuilder.length());
        return errorMessagesBuilder.toString();
    }

    public String getTitle() {
        return this.title != null ? this.title : "";
    }

    @Override
    public String getMessage() {
        final StringBuilder errorMessagesBuilder = new StringBuilder();
        if (this.validationErrorMessage != null) {
            errorMessagesBuilder.append(this.validationErrorMessage);
        }
        if (this.validationResults != null) {
            errorMessagesBuilder.append(getValidationResultsErrorMessages());
        }
        if (this.validationErrors != null) {
            errorMessagesBuilder.append(getConstraintViolationErrorMessages());
        }
        return errorMessagesBuilder.toString();
    }
}
