package com.mylog.backend.dto;

import lombok.Data;

import java.util.List;

@Data
public class PostWriteRequest {
    private String slug;
    private String title;
    private String summary;
    private String content;
    private String type;
    private String status;
    private String publishedAt;
    private List<String> tags;
}
