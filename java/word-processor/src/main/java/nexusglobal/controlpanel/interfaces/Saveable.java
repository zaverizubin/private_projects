package nexusglobal.controlpanel.interfaces;


import nexusglobal.controlpanel.exceptions.ValidationFailedException;

public interface Saveable {
    void save() throws ValidationFailedException;
}
