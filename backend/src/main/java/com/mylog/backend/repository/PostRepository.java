package com.mylog.backend.repository;

import com.mylog.backend.model.Post;
import com.mylog.backend.model.Post.PostStatus;
import com.mylog.backend.model.Post.PostType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long> {

    Optional<Post> findBySlugAndStatus(String slug, PostStatus status);

    Optional<Post> findBySlug(String slug);

    Page<Post> findByTypeAndStatusOrderByPublishedAtDesc(PostType type, PostStatus status, Pageable pageable);

    List<Post> findAllByOrderByPublishedAtDesc();

    @Query("""
            select p from Post p join p.tags t
            where p.type = :type and p.status = :status and t.slug = :tagSlug
            order by p.publishedAt desc
            """)
    Page<Post> findPublishedByTypeAndTag(
            @Param("type") PostType type,
            @Param("status") PostStatus status,
            @Param("tagSlug") String tagSlug,
            Pageable pageable);
}
