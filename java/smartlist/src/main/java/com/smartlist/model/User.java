package com.smartlist.model;

import com.smartlist.enums.Role;
import com.smartlist.module.user.dto.request.UpdateUserReqDTO;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "\"users\"")
@Getter
@Setter
@NoArgsConstructor
public class User extends BaseEntity implements UserDetails {

    @Column(length=255)
    String name;

    @Column(length=255, unique=true)
    String email;

    @Column(length=255)
    String password;

    boolean active=false;

    @Column(length=255)
    @Enumerated(EnumType.STRING)
    Role role;

    @Column(length=255)
    String department;

    @Column(length=255)
    String designation;

    @OneToOne
    @JoinColumn(name = "\"photo_id\"")
    AssetFile photo;

    @ManyToOne
    @JoinColumn(name = "\"organization_id\"")
    Organization organization;


    public User(final UpdateUserReqDTO updateUserReqDTO){
        setName(updateUserReqDTO.getName());
        setDepartment(updateUserReqDTO.getDepartment());
        setDesignation(updateUserReqDTO.getDesignation());
        setRole(Role.valueOf(updateUserReqDTO.getRole()));
    }

   /* public static UserDetails getUserDetail(final User user){
        return org.springframework.security.core.userdetails.User.withUsername(user.getEmail())
                .password(user.getPassword())
                .authorities(user.getRole().name())
                .build();
    }*/

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(this.role.name()));
    }

    @Override
    public String getUsername() {
        return this.email;
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
