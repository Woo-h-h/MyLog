package com.mylog.backend.service;

import com.mylog.backend.dto.PageViewDto;
import com.mylog.backend.model.PageView;
import com.mylog.backend.repository.PageViewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PageViewService {

    private final PageViewRepository pageViewRepository;

    @Transactional
    public void increment(String rawPath) {
        String path = normalize(rawPath);
        PageView view = pageViewRepository.findByPath(path).orElseGet(() -> {
            PageView created = new PageView();
            created.setPath(path);
            created.setViewCount(0L);
            return created;
        });
        view.setViewCount(view.getViewCount() + 1);
        pageViewRepository.save(view);
    }

    public List<PageViewDto> listTop() {
        return pageViewRepository.findAll().stream()
                .sorted(Comparator.comparing(PageView::getViewCount).reversed())
                .limit(50)
                .map(v -> PageViewDto.builder().path(v.getPath()).viewCount(v.getViewCount()).build())
                .toList();
    }

    private static String normalize(String rawPath) {
        if (rawPath == null || rawPath.isBlank()) {
            return "/";
        }
        String path = rawPath.trim();
        if (path.length() > 500) {
            path = path.substring(0, 500);
        }
        if (!path.startsWith("/")) {
            path = "/" + path;
        }
        return path;
    }
}
