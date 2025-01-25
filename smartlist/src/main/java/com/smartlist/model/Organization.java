package com.smartlist.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "\"organization\"")
@Getter
@Setter
@NoArgsConstructor
public class Organization extends BaseEntity {

    @Column(length=255)
    String name;

    @Column(length=1000)
    String url;

    @Column(length=255)
    String email;

    @Column(length=255, name = "\"contact_number\"")
    String contactNumber;

    @Column(length=5000)
    String about;

    @OneToOne
    @JoinColumn(name = "\"logo_id\"")
    AssetFile logo;

    @OneToMany
    List<User> users;

    @OneToMany(mappedBy = Assessment.FIELD_ORGANIZATION)
    List<Assessment> assessments;



}
