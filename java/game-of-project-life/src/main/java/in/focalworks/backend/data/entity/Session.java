package in.focalworks.backend.data.entity;

import java.util.Date;
import java.util.UUID;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Entity
public class Session extends AbstractEntity {

	@NotBlank
	@Size(max = 100)
	private String sessionkey;

	@NotNull
	private boolean completed;

	@NotNull
	private Date startdate;

	@NotNull
	private Date enddate;

	private String sessiondata;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "room")
	private Room room;

	public Session() {
	}

	public Session(final Room room, final Date startdate, final Date enddate) {
		this.room = room;
		this.startdate = startdate;
		this.enddate = enddate;
		sessionkey = UUID.randomUUID().toString();
	}

	public String getSessionKey() {
		return sessionkey;
	}

	public void setSessionKey(final String sessionkey) {
		this.sessionkey = sessionkey;
	}

	public boolean getCompleted() {
		return completed;
	}

	public void setCompleted(final boolean completed) {
		this.completed = completed;
	}

	public Date getStartDate() {
		return startdate;
	}

	public void setStartDate(final Date startdate) {
		this.startdate = startdate;
	}

	public Date getEndDate() {
		return enddate;
	}

	public void setEndDate(final Date endDate) {
		enddate = endDate;
	}

	public String getSessionData() {
		return sessiondata;
	}

	public void setSessionData(final String sessiondata) {
		this.sessiondata = sessiondata;
	}

	public Room getRoom() {
		return room;
	}

	public void setRoom(final Room room) {
		this.room = room;
	}

	@Override
	public String toString() {
		return Session.class.getName() + " sessionKey:" + sessionkey;
	}

}
