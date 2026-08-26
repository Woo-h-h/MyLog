package com.mylog.backend.dto;

import lombok.Data;

import java.util.List;

@Data
public class ProfileUpdateRequest {
    private String displayName;
    private String tagline;
    private String subtitle;
    private String bio;
    private String phone;
    private String email;
    private String githubUrl;
    private List<String> skills;
    private List<String> highlights;
}
