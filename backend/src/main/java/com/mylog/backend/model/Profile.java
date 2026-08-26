package com.mylog.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "profile")
@Getter
@Setter
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 64)
    private String displayName;

    @Column(nullable = false, length = 200)
    private String tagline;

    @Column(length = 300)
    private String subtitle;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(length = 32)
    private String phone;

    @Column(length = 128)
    private String email;

    @Column(length = 256)
    private String githubUrl;

    /** JSON array of skill strings, e.g. ["Java","Redis"] */
    @Lob
    @Column(columnDefinition = "TEXT")
    private String skillsJson;

    /** JSON array of highlight strings for About page */
    @Lob
    @Column(columnDefinition = "TEXT")
    private String highlightsJson;
}
