package com.mercure.utils;

import com.mercure.dto.GroupDTO;

import java.util.Comparator;

public class ComparatorListGroupDTO implements Comparator<GroupDTO> {

    @Override
    public int compare(GroupDTO o1, GroupDTO o2) {
        if (o1.getLastMessageDate() == null) {
            return (o2.getLastMessageDate() == null) ? 0 : -1;
        }
        if (o2.getLastMessageDate() == null) {
            return 1;
        }
        return o2.getLastMessageDate().compareTo(o1.getLastMessageDate());
    }
}
