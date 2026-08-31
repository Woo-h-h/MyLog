package com.mylog.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mylog.backend.dto.ProfileDto;
import com.mylog.backend.dto.ProfileUpdateRequest;
import com.mylog.backend.model.Profile;
import com.mylog.backend.repository.ProfileRepository;
import com.mylog.backend.util.TextLists;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final ObjectMapper objectMapper;

    public ProfileDto getPublicProfile() {
        ProfileDto dto = toDto(requireProfile());
        dto.setPhone(null);
        return dto;
    }

    public ProfileDto getAdminProfile() {
        return toDto(requireProfile());
    }

    public ProfileDto update(ProfileUpdateRequest req) {
        Profile profile = requireProfile();
        if (req.getDisplayName() != null) profile.setDisplayName(req.getDisplayName());
        if (req.getTagline() != null) profile.setTagline(req.getTagline());
        if (req.getSubtitle() != null) profile.setSubtitle(req.getSubtitle());
        if (req.getBio() != null) profile.setBio(req.getBio());
        if (req.getPhone() != null) profile.setPhone(req.getPhone());
        if (req.getEmail() != null) profile.setEmail(req.getEmail());
        if (req.getGithubUrl() != null) profile.setGithubUrl(req.getGithubUrl());
        if (req.getSkills() != null) profile.setSkillsJson(toJsonArray(req.getSkills()));
        if (req.getHighlights() != null) profile.setHighlightsJson(toJsonArray(req.getHighlights()));
        return toDto(profileRepository.save(profile));
    }

    private Profile requireProfile() {
        return profileRepository.findAll().stream()
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "profile not found"));
    }

    private ProfileDto toDto(Profile profile) {
        return ProfileDto.builder()
                .displayName(profile.getDisplayName())
                .tagline(profile.getTagline())
                .subtitle(profile.getSubtitle())
                .bio(profile.getBio())
                .phone(profile.getPhone())
                .email(profile.getEmail())
                .githubUrl(profile.getGithubUrl())
                .skills(TextLists.parseJsonStringArray(profile.getSkillsJson()))
                .highlights(TextLists.parseJsonStringArray(profile.getHighlightsJson()))
                .build();
    }

    private String toJsonArray(List<String> items) {
        try {
            return objectMapper.writeValueAsString(items);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "invalid list payload");
        }
    }
}
