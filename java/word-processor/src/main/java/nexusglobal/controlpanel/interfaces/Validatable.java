package nexusglobal.controlpanel.interfaces;


import nexusglobal.controlpanel.exceptions.ValidationFailedException;

public interface Validatable {

    void validate() throws ValidationFailedException;
}
