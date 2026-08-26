package com.mylog.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class PageDto<T> {
    private List<T> items;
    private int page;
    private int size;
    private long total;
    private int totalPages;
}
