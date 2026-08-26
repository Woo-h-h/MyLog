package com.mylog.backend.controller;

import com.mylog.backend.common.ApiResponse;
import com.mylog.backend.dto.ProfileDto;
import com.mylog.backend.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping
    public ApiResponse<ProfileDto> getProfile() {
        return ApiResponse.ok(profileService.getPublicProfile());
    }
}
