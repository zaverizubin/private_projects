package com.smartlist.utils;

import java.util.*;

public class AppUtils {

    public static boolean arrayHasDuplicates(final List<Integer> answerIds) {
        Set<Integer> set = new HashSet<>();
        for (Integer i : answerIds) {
            if (set.contains(i)) {
                return true;
            } else {
                set.add(i);
            }
        }
        return false;
    }

    public static int generateOTP() {
        return (int) Math.floor(100000 + Math.random() * 900000);
    }
}
