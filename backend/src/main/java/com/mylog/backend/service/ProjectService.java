package com.mylog.backend.service;

import com.mylog.backend.dto.AdminProjectDto;
import com.mylog.backend.dto.ProjectDetailDto;
import com.mylog.backend.dto.ProjectSummaryDto;
import com.mylog.backend.dto.ProjectWriteRequest;
import com.mylog.backend.model.Project;
import com.mylog.backend.repository.ProjectRepository;
import com.mylog.backend.util.TextLists;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;

    public List<ProjectSummaryDto> list(Boolean featuredOnly) {
        List<Project> projects = Boolean.TRUE.equals(featuredOnly)
                ? projectRepository.findByPublishedTrueAndFeaturedTrueOrderBySortOrderAsc()
                : projectRepository.findByPublishedTrueOrderBySortOrderAsc();
        return projects.stream().map(this::toSummary).toList();
    }

    public ProjectDetailDto getBySlug(String slug) {
        Project project = projectRepository.findBySlugAndPublishedTrue(slug)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "project not found"));
        return toDetail(project);
    }

    public List<AdminProjectDto> adminList() {
        return projectRepository.findAllByOrderBySortOrderAsc().stream().map(this::toAdmin).toList();
    }

    public AdminProjectDto adminGet(Long id) {
        return toAdmin(require(id));
    }

    public AdminProjectDto create(ProjectWriteRequest req) {
        validateWrite(req, true);
        if (projectRepository.findBySlug(req.getSlug()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "slug exists");
        }
        Project p = new Project();
        apply(p, req);
        return toAdmin(projectRepository.save(p));
    }

    public AdminProjectDto update(Long id, ProjectWriteRequest req) {
        Project p = require(id);
        if (req.getSlug() != null && !req.getSlug().equals(p.getSlug())
                && projectRepository.findBySlug(req.getSlug()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "slug exists");
        }
        apply(p, req);
        return toAdmin(projectRepository.save(p));
    }

    public void delete(Long id) {
        projectRepository.delete(require(id));
    }

    private Project require(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "project not found"));
    }

    private void validateWrite(ProjectWriteRequest req, boolean creating) {
        if (creating && (req.getSlug() == null || req.getTitle() == null || req.getSummary() == null)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "slug, title, summary required");
        }
    }

    private void apply(Project p, ProjectWriteRequest req) {
        if (req.getSlug() != null) p.setSlug(req.getSlug().trim());
        if (req.getTitle() != null) p.setTitle(req.getTitle());
        if (req.getSummary() != null) p.setSummary(req.getSummary());
        if (req.getContent() != null) p.setContent(req.getContent());
        if (req.getTechStack() != null) p.setTechStack(req.getTechStack());
        if (req.getGithubUrl() != null) p.setGithubUrl(blankToNull(req.getGithubUrl()));
        if (req.getDemoUrl() != null) p.setDemoUrl(blankToNull(req.getDemoUrl()));
        if (req.getStartDate() != null) p.setStartDate(blankToNull(req.getStartDate()));
        if (req.getEndDate() != null) p.setEndDate(blankToNull(req.getEndDate()));
        if (req.getSortOrder() != null) p.setSortOrder(req.getSortOrder());
        if (req.getFeatured() != null) p.setFeatured(req.getFeatured());
        if (req.getPublished() != null) p.setPublished(req.getPublished());
    }

    private static String blankToNull(String s) {
        return s == null || s.isBlank() ? null : s;
    }

    private ProjectSummaryDto toSummary(Project p) {
        return ProjectSummaryDto.builder()
                .slug(p.getSlug())
                .title(p.getTitle())
                .summary(p.getSummary())
                .techStack(TextLists.splitComma(p.getTechStack()))
                .startDate(p.getStartDate())
                .endDate(p.getEndDate())
                .featured(Boolean.TRUE.equals(p.getFeatured()))
                .githubUrl(p.getGithubUrl())
                .build();
    }

    private ProjectDetailDto toDetail(Project p) {
        return ProjectDetailDto.builder()
                .slug(p.getSlug())
                .title(p.getTitle())
                .summary(p.getSummary())
                .content(p.getContent())
                .techStack(TextLists.splitComma(p.getTechStack()))
                .githubUrl(p.getGithubUrl())
                .demoUrl(p.getDemoUrl())
                .startDate(p.getStartDate())
                .endDate(p.getEndDate())
                .featured(Boolean.TRUE.equals(p.getFeatured()))
                .build();
    }

    private AdminProjectDto toAdmin(Project p) {
        return AdminProjectDto.builder()
                .id(p.getId())
                .slug(p.getSlug())
                .title(p.getTitle())
                .summary(p.getSummary())
                .content(p.getContent())
                .techStack(p.getTechStack())
                .githubUrl(p.getGithubUrl())
                .demoUrl(p.getDemoUrl())
                .startDate(p.getStartDate())
                .endDate(p.getEndDate())
                .sortOrder(p.getSortOrder())
                .featured(p.getFeatured())
                .published(p.getPublished())
                .build();
    }
}
