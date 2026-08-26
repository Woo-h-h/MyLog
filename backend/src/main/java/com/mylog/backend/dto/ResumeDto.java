package com.mylog.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class ResumeDto {
    private boolean pdfAvailable;
    private String filename;
    private Instant uploadedAt;
}
