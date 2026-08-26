package com.mylog.backend.repository;

import com.mylog.backend.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findByPublishedTrueOrderBySortOrderAsc();

    List<Project> findByPublishedTrueAndFeaturedTrueOrderBySortOrderAsc();

    List<Project> findAllByOrderBySortOrderAsc();

    Optional<Project> findBySlugAndPublishedTrue(String slug);

    Optional<Project> findBySlug(String slug);
}
