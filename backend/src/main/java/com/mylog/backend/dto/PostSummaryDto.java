package com.mylog.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data
@Builder
public class PostSummaryDto {
    private String slug;
    private String title;
    private String summary;
    private String type;
    private Instant publishedAt;
    private List<String> tags;
}
