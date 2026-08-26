package com.mylog.backend.dto;

import lombok.Data;

@Data
public class ProjectWriteRequest {
    private String slug;
    private String title;
    private String summary;
    private String content;
    private String techStack;
    private String githubUrl;
    private String demoUrl;
    private String startDate;
    private String endDate;
    private Integer sortOrder;
    private Boolean featured;
    private Boolean published;
}
