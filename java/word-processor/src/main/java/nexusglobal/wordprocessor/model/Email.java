package nexusglobal.wordprocessor.model;

import java.io.File;
import java.util.List;

public class Email {

	private String from = "epop-admin@nexusglobal.com";

	private String[] to;

	private String[] cc;

	private String[] bcc;

	private String subject;

	private String body;

	private String header;

	private String footer;

	private String customFooter = "";

	private File attachment;

	private String recipientName;


	public String getFrom() {
		return this.from;
	}

	public void setFrom(final String from) {
		this.from = from;
	}

	public String[] getTo() {
		return this.to;
	}

	public void setTo(final String... to) {
		this.to = to;
	}

	public void setTo(final List<String> toList) {
		this.to = toList.toArray(new String[0]);
	}

	public void setTo(final String to) {
		this.to = new String[] { to };
	}

	public String[] getCc() {
		return this.cc;
	}

	public void setCc(final String... cc) {
		this.cc = cc;
	}

	public void setCc(final List<String> ccList) {
		this.cc = ccList.toArray(new String[0]);
	}

	public void setCc(final String cc) {
		this.cc = new String[] { cc };
	}

	public String[] getBcc() {
		return this.bcc;
	}

	public void setBcc(final String... bcc) {
		this.bcc = bcc;
	}

	public void setBcc(final List<String> bccList) {
		this.bcc = bccList.toArray(new String[0]);
	}

	public void setBcc(final String bcc) {
		this.bcc = new String[] { bcc };
	}

	public String getSubject() {
		return this.subject;
	}

	public void setSubject(final String subject) {
		this.subject = subject;
	}

	public String getBody() {
		return this.body;
	}

	public void setBody(final String body) {
		this.body = body;
	}

	public String getHeader() {
		return this.header;
	}

	public void setHeader(final String header) {
		this.header = header;
	}

	public String getFooter() {
		return this.footer;
	}

	public void setFooter(final String footer) {
		this.footer = footer;
	}

	public String getCustomFooter() {
		return this.customFooter;
	}

	public void setCustomFooter(final String customFooter) {
		this.customFooter = customFooter;
	}

	public File getAttachment() {
		return this.attachment;
	}

	public void setAttachment(final File attachment) {
		this.attachment = attachment;
	}

	public String getRecipientName() {
		return this.recipientName;
	}

	public void setRecipientName(final String recipientName) {
		this.recipientName = recipientName;
	}

}
