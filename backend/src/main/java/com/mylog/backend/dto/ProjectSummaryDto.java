package com.mylog.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ProjectSummaryDto {
    private String slug;
    private String title;
    private String summary;
    private List<String> techStack;
    private String startDate;
    private String endDate;
    private boolean featured;
}
