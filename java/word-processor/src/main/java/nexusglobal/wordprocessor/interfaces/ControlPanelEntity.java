package nexusglobal.wordprocessor.interfaces;

public interface ControlPanelEntity {
    Integer getId();

    void setId(Integer id);

    boolean isMarkedToDelete();

    void markToDelete();

    boolean isNew();
}
