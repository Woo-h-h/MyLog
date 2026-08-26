package com.mylog.backend.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mylog.backend.common.ApiResponse;
import com.mylog.backend.service.SiteContentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/content")
@RequiredArgsConstructor
public class ContentController {

    private final SiteContentService siteContentService;
    private final ObjectMapper objectMapper;

    @GetMapping("/student-work")
    public ApiResponse<Object> studentWork() {
        JsonNode node = siteContentService.getPublic(SiteContentService.KEY_STUDENT_WORK);
        return ApiResponse.ok(objectMapper.convertValue(node, Object.class));
    }
}
