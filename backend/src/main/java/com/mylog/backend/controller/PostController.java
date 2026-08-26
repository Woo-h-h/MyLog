package com.mylog.backend.controller;

import com.mylog.backend.common.ApiResponse;
import com.mylog.backend.dto.PageDto;
import com.mylog.backend.dto.PostDetailDto;
import com.mylog.backend.dto.PostSummaryDto;
import com.mylog.backend.dto.TagDto;
import com.mylog.backend.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @GetMapping("/posts")
    public ApiResponse<PageDto<PostSummaryDto>> list(
            @RequestParam String type,
            @RequestParam(required = false) String tag,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.ok(postService.list(type, tag, page, size));
    }

    @GetMapping("/posts/{slug}")
    public ApiResponse<PostDetailDto> detail(@PathVariable String slug) {
        return ApiResponse.ok(postService.getBySlug(slug));
    }

    @GetMapping("/tags")
    public ApiResponse<List<TagDto>> tags() {
        return ApiResponse.ok(postService.listTags());
    }
}
