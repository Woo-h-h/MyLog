package com.mylog.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ProjectDetailDto {
    private String slug;
    private String title;
    private String summary;
    private String content;
    private List<String> techStack;
    private String githubUrl;
    private String demoUrl;
    private String startDate;
    private String endDate;
    private boolean featured;
}
