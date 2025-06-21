package nexusglobal.controlpanel.model.entities;

import java.util.Random;

public class DocumentSection extends BaseEntity {

	private String tag;

	private Boolean isIncluded;


	public DocumentSection() {
		super();
	}



	public DocumentSection(final String tag, boolean isIncluded) {
		super();
		this.id = -new Random().nextInt(10000000);
		this.tag = tag;
		this.isIncluded = isIncluded;
	}

	public String getTag() {
		return this.tag;
	}

	public void setTag(final String tag) {
		this.tag = tag;
	}

	public Boolean getIsIncluded() {
		return this.isIncluded;
	}

	public void setIsIncluded(final boolean isIncluded) {
		this.isIncluded = isIncluded;
	}

}
