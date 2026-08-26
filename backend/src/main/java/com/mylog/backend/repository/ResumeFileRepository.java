package com.mylog.backend.repository;

import com.mylog.backend.model.ResumeFile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ResumeFileRepository extends JpaRepository<ResumeFile, Long> {

    Optional<ResumeFile> findFirstByCurrentVersionTrueOrderByUploadedAtDesc();
}
