package com.mylog.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ProfileDto {

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
