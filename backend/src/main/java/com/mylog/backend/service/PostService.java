package com.mylog.backend.service;

import com.mylog.backend.dto.AdminPostDto;
import com.mylog.backend.dto.PageDto;
import com.mylog.backend.dto.PostDetailDto;
import com.mylog.backend.dto.PostSummaryDto;
import com.mylog.backend.dto.PostWriteRequest;
import com.mylog.backend.dto.TagDto;
import com.mylog.backend.model.Post;
import com.mylog.backend.model.Post.PostStatus;
import com.mylog.backend.model.Post.PostType;
import com.mylog.backend.model.Tag;
import com.mylog.backend.repository.PostRepository;
import com.mylog.backend.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final TagRepository tagRepository;

    public PageDto<PostSummaryDto> list(String type, String tagSlug, int page, int size) {
        PostType postType = parseType(type);
        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), 50);
        PageRequest pageable = PageRequest.of(safePage, safeSize);

        Page<Post> result;
        if (tagSlug != null && !tagSlug.isBlank()) {
            result = postRepository.findPublishedByTypeAndTag(postType, PostStatus.published, tagSlug, pageable);
        } else {
            result = postRepository.findByTypeAndStatusOrderByPublishedAtDesc(postType, PostStatus.published, pageable);
        }

        return PageDto.<PostSummaryDto>builder()
                .items(result.getContent().stream().map(this::toSummary).toList())
                .page(result.getNumber())
                .size(result.getSize())
                .total(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .build();
    }

    public PostDetailDto getBySlug(String slug) {
        Post post = postRepository.findBySlugAndStatus(slug, PostStatus.published)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "post not found"));
        return toDetail(post);
    }

    public List<TagDto> listTags() {
        return tagRepository.findAll().stream()
                .sorted(Comparator.comparing(Tag::getName))
                .map(t -> TagDto.builder().name(t.getName()).slug(t.getSlug()).build())
                .toList();
    }

    public List<AdminPostDto> adminList() {
        return postRepository.findAllByOrderByPublishedAtDesc().stream().map(this::toAdmin).toList();
    }

    public AdminPostDto adminGet(Long id) {
        return toAdmin(require(id));
    }

    public AdminPostDto create(PostWriteRequest req) {
        if (req.getSlug() == null || req.getTitle() == null || req.getContent() == null || req.getType() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "slug, title, content, type required");
        }
        if (postRepository.findBySlug(req.getSlug()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "slug exists");
        }
        Post post = new Post();
        apply(post, req, true);
        return toAdmin(postRepository.save(post));
    }

    public AdminPostDto update(Long id, PostWriteRequest req) {
        Post post = require(id);
        if (req.getSlug() != null && !req.getSlug().equals(post.getSlug())
                && postRepository.findBySlug(req.getSlug()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "slug exists");
        }
        apply(post, req, false);
        return toAdmin(postRepository.save(post));
    }

    public void delete(Long id) {
        postRepository.delete(require(id));
    }

    private Post require(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "post not found"));
    }

    private void apply(Post post, PostWriteRequest req, boolean creating) {
        if (req.getSlug() != null) post.setSlug(req.getSlug().trim());
        if (req.getTitle() != null) post.setTitle(req.getTitle());
        if (req.getSummary() != null) post.setSummary(req.getSummary());
        if (req.getContent() != null) post.setContent(req.getContent());
        if (req.getType() != null) post.setType(parseType(req.getType()));
        if (req.getStatus() != null) {
            post.setStatus(PostStatus.valueOf(req.getStatus().trim().toLowerCase(Locale.ROOT)));
        } else if (creating) {
            post.setStatus(PostStatus.published);
        }
        if (req.getPublishedAt() != null && !req.getPublishedAt().isBlank()) {
            post.setPublishedAt(Instant.parse(req.getPublishedAt()));
        } else if (creating && post.getPublishedAt() == null) {
            post.setPublishedAt(Instant.now());
        }
        if (req.getTags() != null) {
            Set<Tag> tags = new HashSet<>();
            for (String name : req.getTags()) {
                if (name == null || name.isBlank()) continue;
                tags.add(findOrCreateTag(name.trim()));
            }
            post.setTags(tags);
        } else if (creating) {
            post.setTags(new HashSet<>());
        }
    }

    private Tag findOrCreateTag(String name) {
        String slug = slugify(name);
        return tagRepository.findBySlug(slug).orElseGet(() -> {
            Tag tag = new Tag();
            tag.setName(name);
            tag.setSlug(slug);
            return tagRepository.save(tag);
        });
    }

    private static String slugify(String name) {
        String s = name.trim().toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9\\u4e00-\\u9fa5]+", "-")
                .replaceAll("^-|-$", "");
        if (s.isBlank()) {
            return "tag-" + Integer.toHexString(name.hashCode());
        }
        if (s.matches("[\\u4e00-\\u9fa5-]+")) {
            return "t-" + Integer.toHexString(name.hashCode());
        }
        return s;
    }

    private PostType parseType(String type) {
        if (type == null || type.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "type is required: blog|note");
        }
        try {
            return PostType.valueOf(type.trim().toLowerCase(Locale.ROOT));
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "type must be blog or note");
        }
    }

    private PostSummaryDto toSummary(Post post) {
        return PostSummaryDto.builder()
                .slug(post.getSlug())
                .title(post.getTitle())
                .summary(post.getSummary())
                .type(post.getType().name())
                .publishedAt(post.getPublishedAt())
                .tags(post.getTags().stream().map(Tag::getName).sorted().toList())
                .build();
    }

    private PostDetailDto toDetail(Post post) {
        return PostDetailDto.builder()
                .slug(post.getSlug())
                .title(post.getTitle())
                .summary(post.getSummary())
                .content(post.getContent())
                .type(post.getType().name())
                .publishedAt(post.getPublishedAt())
                .tags(post.getTags().stream().map(Tag::getName).sorted().toList())
                .build();
    }

    private AdminPostDto toAdmin(Post post) {
        return AdminPostDto.builder()
                .id(post.getId())
                .slug(post.getSlug())
                .title(post.getTitle())
                .summary(post.getSummary())
                .content(post.getContent())
                .type(post.getType().name())
                .status(post.getStatus().name())
                .publishedAt(post.getPublishedAt())
                .tags(post.getTags().stream().map(Tag::getName).sorted().toList())
                .build();
    }
}
