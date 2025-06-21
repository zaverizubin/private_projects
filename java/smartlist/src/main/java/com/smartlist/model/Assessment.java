package com.smartlist.model;

import com.smartlist.enums.AssessmentStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "\"assessment\"")
@Getter
@Setter
public class Assessment extends BaseEntity{

    public static final String FIELD_ORGANIZATION = "organization";

    @Column(length=255)
    String name;

    @Column(length=255)
    String position;

    @Column(length=255)
    String department;

    @Column(length=5000)
    String introduction;

    @Enumerated(EnumType.STRING)
    AssessmentStatus status = AssessmentStatus.DRAFT;

    @Column(name = "\"activated_on\"")
    LocalDate activatedOn;

    @Column(name = "\"deactivated_on\"")
    LocalDate deactivatedOn;

    @ManyToOne
    @JoinColumn(name = "\"organization_id\"")
    Organization organization;

    @OneToOne
    @JoinColumn(name = "\"header_image_id\"")
    AssetFile headerImage;

    @Column(length=255, name = "\"video_link_url\"")
    String videoLinkURL;

    String token;

    @OneToMany(mappedBy = AssessmentBlock.FIELD_ASSESSMENT)
    @OrderBy("sortOrder ASC")
    List<AssessmentBlock> assessmentBlocks;

    public Assessment(){

    }


}
