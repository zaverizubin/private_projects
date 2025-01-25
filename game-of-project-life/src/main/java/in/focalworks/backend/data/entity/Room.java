package in.focalworks.backend.data.entity;

import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Entity
public class Room extends AbstractEntity {

	@NotBlank
	@Size(max = 255)
	private String name;

	@NotNull
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "facilitator")
	private User facilitator;

	@NotNull
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "scorer")
	private User scorer;

	@OneToMany(mappedBy = "room", cascade = CascadeType.ALL, orphanRemoval = true)
	private Set<Session> sessions;

	@ManyToMany(cascade = { CascadeType.ALL })
	@JoinTable(name = "roomteam", joinColumns = @JoinColumn(name = "room"), inverseJoinColumns = @JoinColumn(name = "team"))
	private Set<Team> teams;

	public Room() {
	}

	public Room(final String name, final User facilitator, final User scorer) {
		this.name = name;
		this.facilitator = facilitator;
		this.scorer = scorer;
	}

	public String getName() {
		return name;
	}

	public void setName(final String name) {
		this.name = name;
	}

	public User getFacilitator() {
		return facilitator;
	}

	public void setFacilitator(final User facilitator) {
		this.facilitator = facilitator;
	}

	public User getScorer() {
		return facilitator;
	}

	public void setScorer(final User scorer) {
		this.scorer = scorer;
	}


	public Set<Session> getSessions() {
		return sessions;
	}

	public void setSessions(final Set<Session> sessions) {
		this.sessions = sessions;
	}

	public Set<Team> getTeams() {
		return teams;
	}

	public void setTeams(final Set<Team> teams) {
		this.teams = teams;
	}

	@Override
	public String toString() {
		return Room.class.getName() + " name:" + name;
	}
}
