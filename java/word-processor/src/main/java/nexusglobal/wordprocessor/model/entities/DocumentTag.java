package nexusglobal.wordprocessor.model.entities;

import java.util.Random;

public class DocumentTag extends BaseEntity {


	public static final String FIELD_TAG_TEXT = "tag";
	public static final String FIELD_REPLACEMENT_TEXT = "text";

	private String tag;

	private String text;


	public DocumentTag() {
		super();
	}



	public DocumentTag(final String tag, String text) {
		super();
		this.id = -new Random().nextInt(10000000);
		this.tag = tag;
		this.text = text;
	}

	public String getTag() {
		return this.tag;
	}

	public void setTag(final String tag) {
		this.tag = tag;
	}

	public String getText() {
		return this.text;
	}

	public void setText(final String text) {
		this.text = text;
	}

}
