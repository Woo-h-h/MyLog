package com.mylog.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.mylog.backend.dto.ResumeDto;
import com.mylog.backend.dto.ResumeFileDto;
import com.mylog.backend.model.ResumeFile;
import com.mylog.backend.repository.ResumeFileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ResumeService {

    private final ResumeFileRepository resumeFileRepository;
    private final ObjectMapper objectMapper;
    private final SiteContentService siteContentService;

    @Value("${mylog.resume.storage-dir:./uploads/resume}")
    private String storageDir;

    @Value("${mylog.resume.filename:wanghuan-resume.pdf}")
    private String configuredFilename;

    public ResumeDto getResume() {
        ResumeDto dto = siteContentService.readAs(
                SiteContentService.KEY_RESUME,
                ResumeDto.class,
                "seed/resume.json");
        dto.setPdfAvailable(resolvePdfPath().map(Files::exists).orElse(false));
        return dto;
    }

    public ResumeDto getContentForAdmin() {
        ResumeDto dto = siteContentService.readAs(
                SiteContentService.KEY_RESUME,
                ResumeDto.class,
                "seed/resume.json");
        dto.setPdfAvailable(false);
        return dto;
    }

    public ResumeDto updateContent(ResumeDto body) {
        try {
            JsonNode node = objectMapper.valueToTree(body);
            if (node instanceof ObjectNode objectNode) {
                objectNode.remove("pdfAvailable");
            }
            siteContentService.save(SiteContentService.KEY_RESUME, node);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "invalid resume content");
        }
        return getResume();
    }

    public Resource loadPdf() {
        Path path = resolvePdfPath()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "resume pdf not found"));
        if (!Files.exists(path)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "resume pdf not found");
        }
        return new FileSystemResource(path);
    }

    public String downloadFilename() {
        return resumeFileRepository.findFirstByCurrentVersionTrueOrderByUploadedAtDesc()
                .map(ResumeFile::getOriginalFilename)
                .orElse("\u738b\u7115_\u7b80\u5386.pdf");
    }

    public List<ResumeFileDto> listFiles() {
        return resumeFileRepository.findAll().stream()
                .sorted((a, b) -> b.getUploadedAt().compareTo(a.getUploadedAt()))
                .map(this::toDto)
                .toList();
    }

    public ResumeFileDto upload(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "file required");
        }
        String original = file.getOriginalFilename() == null ? "resume.pdf" : file.getOriginalFilename();
        if (!original.toLowerCase().endsWith(".pdf")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "only pdf allowed");
        }
        try {
            Path dir = Paths.get(storageDir).toAbsolutePath().normalize();
            Files.createDirectories(dir);
            String stored = "resume-" + UUID.randomUUID() + ".pdf";
            Path target = dir.resolve(stored);
            file.transferTo(target);

            resumeFileRepository.findAll().forEach(f -> {
                f.setCurrentVersion(false);
                resumeFileRepository.save(f);
            });

            ResumeFile entity = new ResumeFile();
            entity.setStoragePath(target.toString());
            entity.setOriginalFilename(original);
            entity.setCurrentVersion(true);
            entity.setUploadedAt(Instant.now());
            return toDto(resumeFileRepository.save(entity));
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "upload failed");
        }
    }

    public ResumeFileDto setCurrent(Long id) {
        ResumeFile target = resumeFileRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "file not found"));
        resumeFileRepository.findAll().forEach(f -> {
            f.setCurrentVersion(f.getId().equals(id));
            resumeFileRepository.save(f);
        });
        return toDto(target);
    }

    private ResumeFileDto toDto(ResumeFile f) {
        return ResumeFileDto.builder()
                .id(f.getId())
                .originalFilename(f.getOriginalFilename())
                .currentVersion(f.getCurrentVersion())
                .uploadedAt(f.getUploadedAt())
                .build();
    }

    private java.util.Optional<Path> resolvePdfPath() {
        return resumeFileRepository.findFirstByCurrentVersionTrueOrderByUploadedAtDesc()
                .map(f -> Paths.get(f.getStoragePath()))
                .or(() -> java.util.Optional.of(Paths.get(storageDir, configuredFilename).toAbsolutePath().normalize()));
    }
}
