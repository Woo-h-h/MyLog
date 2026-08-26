package com.mylog.backend.controller;

import com.mylog.backend.common.ApiResponse;
import com.mylog.backend.dto.ResumeDto;
import com.mylog.backend.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/resume")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;

    @GetMapping
    public ApiResponse<ResumeDto> getResume() {
        return ApiResponse.ok(resumeService.getResume());
    }

    @GetMapping("/view")
    public ResponseEntity<Resource> view() {
        Resource pdf = resumeService.loadPdf();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @GetMapping("/download")
    public ResponseEntity<Resource> download() {
        Resource pdf = resumeService.loadPdf();
        String filename = resumeService.downloadFilename();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename*=UTF-8''" + encode(filename))
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    private static String encode(String filename) {
        return java.net.URLEncoder.encode(filename, java.nio.charset.StandardCharsets.UTF_8)
                .replace("+", "%20");
    }
}
