package com.smartlist.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Table(name = "\"candidate_attempt_log\"")
@Getter
@Setter
public class CandidateAttemptLog extends BaseEntity {

    @Column(name = "\"attempted_on\"")
    LocalDateTime attemptedOn;

    @ManyToOne
    @JoinColumn(name = "\"candidate_id\"")
    Candidate candidate;

    @ManyToOne
    @JoinColumn(name = "\"assessment_id\"")
    Assessment assessment;
}
