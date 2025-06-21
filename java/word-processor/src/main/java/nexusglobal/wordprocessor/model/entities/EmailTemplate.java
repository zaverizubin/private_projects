package nexusglobal.wordprocessor.model.entities;

import nexusglobal.wordprocessor.enums.EmailTemplateType;
import org.hibernate.envers.Audited;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Lob;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

@Entity
@Table(name = "email_templates")
@Audited
public class EmailTemplate extends BaseVersionedEntity {

	@Column(name="\"email_template_type\"", unique = true)
	@NotNull
	private EmailTemplateType type;

	@Lob
	private String template = "";

	@Column(name="\"custom_footer\"")
	@Lob
	private String customFooter = "";

	public EmailTemplate() {
		super();
	}

	public EmailTemplate(final EmailTemplateType templateType) {
		setType(templateType);
	}

	public EmailTemplateType getType() {
		return this.type;
	}

	public void setType(final EmailTemplateType value) {
		this.type = value;
	}

	public String getTemplate() {
		return this.template;
	}

	public void setTemplate(final String value) {
		this.template = value;
	}

	public String getCustomFooter() {
		return this.customFooter;
	}

	public void setCustomFooter(final String customFooter) {
		this.customFooter = customFooter;
	}

	@Override
	public String toString() {
		return getType().name();
	}

}
