package nexusglobal.wordprocessor.interfaces;


import nexusglobal.wordprocessor.exceptions.ValidationFailedException;

public interface Saveable {
    void save() throws ValidationFailedException;
}
