package nexusglobal.wordprocessor.interfaces;


import nexusglobal.wordprocessor.exceptions.ValidationFailedException;


public interface SaveablePresenter<V extends View> extends Saveable, Presenter<V>, Validatable {

    @Override
    void save() throws ValidationFailedException;

    void saveAndClose() throws ValidationFailedException;

    void cancel();
}
