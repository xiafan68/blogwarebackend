package ecnu.yjsy.domain;

import java.sql.Date;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "Event")
public class Event {
	public static enum ProcessingState {
		PROCESSING, PROCESSED, FAILED, WAITING, INIT
	}

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer id = null;
	private String pattern = null;
	private String name = null;
	private String description = null;
	private String url = null;
	// @Column(name = "imageURL")
	private String imageURL = null;
	// @Column(name = "createdAt")
	private Date createdAt = null;
	@Enumerated(EnumType.ORDINAL)
	// @Column(name = "processState")
	private ProcessingState processState = ProcessingState.INIT;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getPattern() {
		return pattern;
	}

	public void setPattern(String pattern) {
		this.pattern = pattern;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getImageURL() {
		return imageURL;
	}

	public void setImageURL(String imageURL) {
		this.imageURL = imageURL;
	}

	public Date getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}

	public ProcessingState getprocessState() {
		return processState;
	}

	public void setProcessState(ProcessingState proccesState) {
		this.processState = proccesState;
	}
}
