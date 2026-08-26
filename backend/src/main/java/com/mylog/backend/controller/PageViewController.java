package com.mylog.backend.controller;

import com.mylog.backend.common.ApiResponse;
import com.mylog.backend.dto.PageViewRequest;
import com.mylog.backend.service.PageViewService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/pageviews")
@RequiredArgsConstructor
public class PageViewController {

    private final PageViewService pageViewService;

    @PostMapping
    public ApiResponse<Void> track(@RequestBody PageViewRequest request) {
        pageViewService.increment(request.getPath());
        return ApiResponse.ok(null);
    }
}
