package com.mylog.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TagDto {
    private String name;
    private String slug;
}
