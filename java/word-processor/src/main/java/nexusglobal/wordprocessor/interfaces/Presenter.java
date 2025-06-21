package nexusglobal.wordprocessor.interfaces;

public interface Presenter<V extends View> extends Loggable {

    void setView(V view);
}
