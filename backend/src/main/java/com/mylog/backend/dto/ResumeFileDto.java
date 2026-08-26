package com.mylog.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class ResumeFileDto {
    private Long id;
    private String originalFilename;
    private Boolean currentVersion;
    private Instant uploadedAt;
}
