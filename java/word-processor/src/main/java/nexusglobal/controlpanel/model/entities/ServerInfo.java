package nexusglobal.controlpanel.model.entities;

import org.hibernate.envers.Audited;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.util.Date;

@Entity
@Table(name = "server_info")
@Audited
public class ServerInfo extends BaseEntity {

    @Column(unique = true)
    private String name;

    private String location;

    private String ip;

    private String serverID;

    private String level;

    private String storage;

    private Date dateCreated;

    private String backupId;

    private String status;

    private String userName;

    private String password;

    public String getName() {
        return this.name;
    }

    public void setName(final String name) {
        this.name = name;
    }

    public String getLocation() {
        return this.location;
    }

    public void setLocation(final String location) {
        this.location = location;
    }

    public String getIp() {
        return this.ip;
    }

    public void setIp(final String ip) {
        this.ip = ip;
    }

    public String getServerID() {
        return this.serverID;
    }

    public void setServerID(final String serverID) {
        this.serverID = serverID;
    }

    public String getLevel() {
        return this.level;
    }

    public void setLevel(final String level) {
        this.level = level;
    }

    public String getStorage() {
        return this.storage;
    }

    public void setStorage(final String storage) {
        this.storage = storage;
    }

    public Date getDateCreated() {
        return this.dateCreated;
    }

    public void setDateCreated(final Date dateCreated) {
        this.dateCreated = dateCreated;
    }

    public String getBackupId() {
        return this.backupId;
    }

    public void setBackupId(final String backupId) {
        this.backupId = backupId;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(final String status) {
        this.status = status;
    }

    public String getUserName() {
        return this.userName;
    }

    public void setUserName(final String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return this.password;
    }

    public void setPassword(final String password) {
        this.password = password;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = super.hashCode();
        result = prime * result + ((this.serverID == null) ? 0 : this.serverID.hashCode());
        return result;
    }

    @Override
    public boolean equals(final Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        final ServerInfo other = (ServerInfo) obj;
        if (this.serverID == null) {
            return other.serverID == null;
        } else return this.serverID.equals(other.serverID);
    }

}
