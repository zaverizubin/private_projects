package com.smartlist.model;

import com.smartlist.enums.Role;
import com.smartlist.module.candidate.dto.request.CreateCandidateReqDTO;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "\"candidate\"")
@Getter
@Setter
public class Candidate extends BaseEntity implements UserDetails {

    @Column(length=255)
    String name;

    @Column(length=255)
    String email;

    @Column(name = "\"contact_number\"")
    String contactNumber;

    boolean verified=false;

    @Column(name = "\"verification_code\"")
    Integer verificationCode;

    @OneToOne
    @JoinColumn(name = "\"photo_id\"")
    AssetFile photo;

    @OneToMany(mappedBy = CandidateAssessment.FIELD_CANDIDATE)
    List<CandidateAssessment> candidateAssessments;

    public Candidate(){

    }

    public Candidate(final CreateCandidateReqDTO createCandidateReqDto){
        setName(createCandidateReqDto.getName());
        setEmail(createCandidateReqDto.getEmail());
        setContactNumber(createCandidateReqDto.getContactNumber());
    }

    public static UserDetails getCandidateDetail(final Candidate candidate){
        return org.springframework.security.core.userdetails.User.withUsername(candidate.getEmail())
                .authorities(Role.CANDIDATE.name())
                .password("")
                .build();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(Role.CANDIDATE.name()));
    }

    @Override
    public String getPassword() {
        return "";
    }

    @Override
    public String getUsername() {
        return this.name;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
