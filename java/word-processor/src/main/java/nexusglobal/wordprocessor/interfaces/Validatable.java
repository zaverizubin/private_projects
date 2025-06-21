package nexusglobal.wordprocessor.interfaces;


import nexusglobal.wordprocessor.exceptions.ValidationFailedException;

public interface Validatable {

    void validate() throws ValidationFailedException;
}
