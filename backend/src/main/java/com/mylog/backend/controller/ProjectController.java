package com.mylog.backend.controller;

import com.mylog.backend.common.ApiResponse;
import com.mylog.backend.dto.ProjectDetailDto;
import com.mylog.backend.dto.ProjectSummaryDto;
import com.mylog.backend.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    public ApiResponse<List<ProjectSummaryDto>> list(
            @RequestParam(required = false) Boolean featured) {
        return ApiResponse.ok(projectService.list(featured));
    }

    @GetMapping("/{slug}")
    public ApiResponse<ProjectDetailDto> detail(@PathVariable String slug) {
        return ApiResponse.ok(projectService.getBySlug(slug));
    }
}
