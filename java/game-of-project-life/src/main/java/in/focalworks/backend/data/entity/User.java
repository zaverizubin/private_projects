package in.focalworks.backend.data.entity;

import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Entity
@Table(name = "User")
public class User extends AbstractEntity {

	@NotBlank
	@Size(max = 255)
	private String username;

	@NotNull
	@Size(min = 4, max = 255)
	private String password;

	@NotNull
	private boolean enabled;

	@OneToMany(mappedBy = "facilitator", cascade = CascadeType.ALL, orphanRemoval = true)
	private Set<Room> roomsAsFacilitator;

	@OneToMany(mappedBy = "scorer", cascade = CascadeType.ALL, orphanRemoval = true)
	private Set<Room> roomsAsScorer;

	@ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.ALL })
	@JoinTable(name = "userrole", joinColumns = @JoinColumn(name = "user"), inverseJoinColumns = @JoinColumn(name = "role"))
	private Set<Role> roles;

	public User() {
	}

	public User(final String username, final String password, final boolean enabled) {
		this.username = username;
		this.password = password;
		this.enabled = enabled;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(final String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(final String password) {
		this.password = password;
	}

	public boolean getEnabled() {
		return enabled;
	}

	public void setEnabled(final boolean enabled) {
		this.enabled = enabled;
	}


	public Set<Role> getRoles() {
		return roles;
	}

	public void setRoles(final Set<Role> roles) {
		this.roles = roles;
	}

	@Override
	public String toString() {
		return User.class.getName() + " username:" + username;

	}

}
