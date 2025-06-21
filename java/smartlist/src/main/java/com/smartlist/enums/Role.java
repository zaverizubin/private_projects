package com.smartlist.enums;

import java.util.List;

public enum Role {
    ADMIN,
    MEMBER,
    CANDIDATE,
    SUPERADMIN;

    Role(){

    }

    public static List<Role> getUserRoles(){
        return List.of(ADMIN, MEMBER);
    }
}
