package in.focalworks.backend.data.entity;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.ManyToMany;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Entity
public class Team extends AbstractEntity {

	@NotBlank
	@Size(max = 255)
	private String name;

	@NotNull
	private String description;

	@NotNull
	private boolean enabled;


	@ManyToMany(mappedBy = "teams")
	private Set<Room> rooms = new HashSet<>();

	public Team() {
	}

	public Team(final String name, final String description, final boolean enabled) {
		this.name = name;
		this.description = description;
		this.enabled = enabled;
	}

	public String getName() {
		return name;
	}

	public void setName(final String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(final String description) {
		this.description = description;
	}

	public boolean getEnabled() {
		return enabled;
	}

	public void setEnabled(final boolean enabled) {
		this.enabled = enabled;
	}

	public Set<Room> getRooms() {
		return rooms;
	}

	public void setRooms(final Set<Room> rooms) {
		this.rooms = rooms;
	}

	@Override
	public String toString() {
		return Team.class.getName() + " name:" + name;
	}
}
