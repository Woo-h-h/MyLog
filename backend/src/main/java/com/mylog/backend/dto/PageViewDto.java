package com.mylog.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PageViewDto {
    private String path;
    private long viewCount;
}
