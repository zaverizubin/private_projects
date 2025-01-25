package nexusglobal.controlpanel.model.entities;

import org.apache.shiro.authc.credential.PasswordService;
import org.hibernate.envers.Audited;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

@Entity
@Table(name = "users")
@Audited
public class User extends BaseVersionedEntity {

    public static final String ADMIN_USERNAME = "admin";
    public static final String ADMIN_DEFAULT_PASSWORD = "admin";
    public static final String SERVICE_USERNAME = "serviceUser";

    String firstName;

    String lastName;

    String userName;

    String hashedPassword;

    @Transient
    String plainPassword;

    public String getFirstName() {
        return this.firstName;
    }

    public void setFirstName(final String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return this.lastName;
    }

    public void setLastName(final String lastName) {
        this.lastName = lastName;
    }

    public String getUserName() {
        return this.userName;
    }

    public void setUserName(final String userName) {
        this.userName = userName;
    }

    public String getHashedPassword() {
        return this.hashedPassword;
    }

    public void setHashedPassword(final String hashedPassword) {
        this.hashedPassword = hashedPassword;
    }

    public String getPlainPassword() {
        return this.plainPassword;
    }

    public void setPlainPassword(final String plainPassword) {
        this.plainPassword = plainPassword;
    }

    public void encryptPassword(final PasswordService passwordService) {
        if (this.plainPassword != null) {
            this.hashedPassword = passwordService.encryptPassword(this.plainPassword);
        }
    }

}
