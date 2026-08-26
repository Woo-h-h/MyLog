package com.mylog.backend.repository;

import com.mylog.backend.model.PageView;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PageViewRepository extends JpaRepository<PageView, Long> {

    Optional<PageView> findByPath(String path);
}
