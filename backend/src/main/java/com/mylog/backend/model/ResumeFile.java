package com.mylog.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "resume_file")
@Getter
@Setter
public class ResumeFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 512)
    private String storagePath;

    @Column(nullable = false, length = 256)
    private String originalFilename;

    @Column(nullable = false)
    private Boolean currentVersion = true;

    @Column(nullable = false)
    private Instant uploadedAt = Instant.now();
}
