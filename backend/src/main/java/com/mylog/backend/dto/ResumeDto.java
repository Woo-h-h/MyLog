package com.mylog.backend.dto;

import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data
public class ResumeDto {
    private String summary;
    private List<EducationItem> education;
    private List<AwardItem> awards;
    private List<InternshipItem> internships;
    private List<ProjectSummaryItem> projectSummaries;
    private List<String> skills;
    private boolean pdfAvailable;
    private String filename;
    private Instant uploadedAt;

    @Data
    public static class EducationItem {
        private String school;
        private String college;
        private String major;
        private String degree;
        private String period;
        private String gpa;
        private String honors;
    }

    @Data
    public static class InternshipItem {
        private String company;
        private String role;
        private String period;
        private String location;
        private String project;
        private List<String> highlights;
    }

    @Data
    public static class ProjectSummaryItem {
        private String name;
        private String period;
        private String oneLiner;
        private String githubUrl;
    }

    @Data
    public static class AwardItem {
        private String date;
        private String title;
    }
}
