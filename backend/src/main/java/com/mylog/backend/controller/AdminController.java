package com.mylog.backend.controller;

import com.mylog.backend.common.ApiResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mylog.backend.dto.AdminPostDto;
import com.mylog.backend.dto.AdminProjectDto;
import com.mylog.backend.dto.PageViewDto;
import com.mylog.backend.dto.PostWriteRequest;
import com.mylog.backend.dto.ProfileDto;
import com.mylog.backend.dto.ProfileUpdateRequest;
import com.mylog.backend.dto.ProjectWriteRequest;
import com.mylog.backend.dto.ResumeFileDto;
import com.mylog.backend.service.PageViewService;
import com.mylog.backend.service.PostService;
import com.mylog.backend.service.ProfileService;
import com.mylog.backend.service.ProjectService;
import com.mylog.backend.service.ResumeService;
import com.mylog.backend.service.SiteContentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final ProfileService profileService;
    private final ProjectService projectService;
    private final PostService postService;
    private final ResumeService resumeService;
    private final PageViewService pageViewService;
    private final SiteContentService siteContentService;
    private final ObjectMapper objectMapper;

    @GetMapping("/profile")
    public ApiResponse<ProfileDto> getProfile() {
        return ApiResponse.ok(profileService.getAdminProfile());
    }

    @PutMapping("/profile")
    public ApiResponse<ProfileDto> updateProfile(@RequestBody ProfileUpdateRequest request) {
        return ApiResponse.ok(profileService.update(request));
    }

    @GetMapping("/projects")
    public ApiResponse<List<AdminProjectDto>> listProjects() {
        return ApiResponse.ok(projectService.adminList());
    }

    @GetMapping("/projects/{id}")
    public ApiResponse<AdminProjectDto> getProject(@PathVariable Long id) {
        return ApiResponse.ok(projectService.adminGet(id));
    }

    @PostMapping("/projects")
    public ApiResponse<AdminProjectDto> createProject(@RequestBody ProjectWriteRequest request) {
        return ApiResponse.ok(projectService.create(request));
    }

    @PutMapping("/projects/{id}")
    public ApiResponse<AdminProjectDto> updateProject(@PathVariable Long id, @RequestBody ProjectWriteRequest request) {
        return ApiResponse.ok(projectService.update(id, request));
    }

    @DeleteMapping("/projects/{id}")
    public ApiResponse<Void> deleteProject(@PathVariable Long id) {
        projectService.delete(id);
        return ApiResponse.ok(null);
    }

    @GetMapping("/posts")
    public ApiResponse<List<AdminPostDto>> listPosts() {
        return ApiResponse.ok(postService.adminList());
    }

    @GetMapping("/posts/{id}")
    public ApiResponse<AdminPostDto> getPost(@PathVariable Long id) {
        return ApiResponse.ok(postService.adminGet(id));
    }

    @PostMapping("/posts")
    public ApiResponse<AdminPostDto> createPost(@RequestBody PostWriteRequest request) {
        return ApiResponse.ok(postService.create(request));
    }

    @PutMapping("/posts/{id}")
    public ApiResponse<AdminPostDto> updatePost(@PathVariable Long id, @RequestBody PostWriteRequest request) {
        return ApiResponse.ok(postService.update(id, request));
    }

    @DeleteMapping("/posts/{id}")
    public ApiResponse<Void> deletePost(@PathVariable Long id) {
        postService.delete(id);
        return ApiResponse.ok(null);
    }

    @GetMapping("/resume/files")
    public ApiResponse<List<ResumeFileDto>> listResumeFiles() {
        return ApiResponse.ok(resumeService.listFiles());
    }

    @PostMapping("/resume/upload")
    public ApiResponse<ResumeFileDto> uploadResume(@RequestParam("file") MultipartFile file) {
        return ApiResponse.ok(resumeService.upload(file));
    }

    @PutMapping("/resume/files/{id}/current")
    public ApiResponse<ResumeFileDto> setCurrentResume(@PathVariable Long id) {
        return ApiResponse.ok(resumeService.setCurrent(id));
    }

    @GetMapping("/pageviews")
    public ApiResponse<List<PageViewDto>> pageViews() {
        return ApiResponse.ok(pageViewService.listTop());
    }

    @GetMapping("/content/student-work")
    public ApiResponse<Object> getStudentWorkContent() {
        JsonNode node = siteContentService.getAdmin(SiteContentService.KEY_STUDENT_WORK);
        return ApiResponse.ok(objectMapper.convertValue(node, Object.class));
    }

    @PutMapping("/content/student-work")
    public ApiResponse<Object> updateStudentWorkContent(@RequestBody JsonNode body) {
        JsonNode saved = siteContentService.save(SiteContentService.KEY_STUDENT_WORK, body);
        return ApiResponse.ok(objectMapper.convertValue(saved, Object.class));
    }
}
