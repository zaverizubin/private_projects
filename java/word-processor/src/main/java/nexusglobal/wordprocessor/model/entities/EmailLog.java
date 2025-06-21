package nexusglobal.wordprocessor.model.entities;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = EmailLog.TABLE_NAME)
public class EmailLog extends BaseVersionedEntity {

	public static final String TABLE_NAME = "email_log";

	@NotNull
	private LocalDateTime date;

	@NotNull
	private Boolean status;

	@NotNull
	private String sender;

	@NotNull
	private String receiver;

	private String logMessage;

	@NotNull
	private String message;

	private String subject;

	public EmailLog() {
		// Required by JPA
		super();
	}

	public EmailLog(final LocalDateTime date, final Boolean status, final String sender,
					final String receiver, final String logMessage, final String message) {
		super();
		this.date = date;
		this.status = status;
		this.sender = sender;
		this.receiver = receiver;
		this.logMessage = logMessage;
		this.message = message;
	}

	public LocalDateTime getDate() {
		return this.date;
	}

	public void setDate(final LocalDateTime date) {
		this.date = date;
	}

	public Boolean getStatus() {
		return this.status;
	}

	public void setStatus(final Boolean status) {
		this.status = status;
	}

	public String getSender() {
		return this.sender;
	}

	public void setSender(final String sender) {
		this.sender = sender;
	}

	public String getReceiver() {
		return this.receiver;
	}

	public void setReceiver(final String receiver) {
		this.receiver = receiver;
	}

	public String getLogMessage() {
		return this.logMessage;
	}

	public void setLogMessage(final String logMessage) {
		this.logMessage = logMessage;
	}

	public String getMessage() {
		return this.message;
	}

	public void setMessage(final String message) {
		this.message = message;
	}

	public String getSubject() {
		return this.subject;
	}

	public void setSubject(String subject) {
		this.subject = subject;
	}

}
