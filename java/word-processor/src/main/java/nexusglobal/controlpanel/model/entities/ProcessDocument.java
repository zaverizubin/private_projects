package nexusglobal.controlpanel.model.entities;

import nexusglobal.controlpanel.interfaces.ControlPanelEntity;

import java.util.Random;

public class ProcessDocument extends BaseEntity {

	private String filename;

	private byte[] bytes;

	private long contentLength;

	public ProcessDocument() {
		super();
	}

	public ProcessDocument(final String filename, long contentLength, final byte[] bytes) {
		super();
		this.id = -new Random().nextInt(10000000);
		this.filename = filename;
		this.contentLength = contentLength;
		this.bytes = bytes;
	}

	public String getFilename() {
		return this.filename;
	}

	public void setFilename(final String filename) {
		this.filename = filename;
	}

	public  byte[] getBytes() {
		return this.bytes;
	}

	public void setBytes(final byte[] bytes) {
		this.bytes = bytes;
	}

	public float getContentLength() {
		return Math.round(this.contentLength/ (1024f * 1024f));
	}

	public void setContentLength(final long contentLength) {
		this.contentLength = contentLength;
	}

}
