package com.smartlist.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "\"assessment_block\"")
@Getter
@Setter
public class AssessmentBlock extends BaseEntity{

    public static final String FIELD_ASSESSMENT = "assessment";

    @Column(length=255)
    String title;

    @Column(length=5000)
    String instruction;

    Integer duration;

    @Column(name = "\"sort_order\"")
    Integer sortOrder = 0;

    @Column(name = "\"closing_comments\"", length=5000)
    String closingComments;

    @ManyToOne
    @JoinColumn(name = "\"assessment_id\"")
    Assessment assessment;

    @OneToMany(mappedBy = Question.FIELD_ASSESSMENT_BLOCK)
    List<Question> questions;





}
