package com.mylog.backend.config;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mylog.backend.model.Post;
import com.mylog.backend.model.Post.PostStatus;
import com.mylog.backend.model.Post.PostType;
import com.mylog.backend.model.Profile;
import com.mylog.backend.model.Project;
import com.mylog.backend.model.ResumeFile;
import com.mylog.backend.model.Tag;
import com.mylog.backend.repository.PostRepository;
import com.mylog.backend.repository.ProfileRepository;
import com.mylog.backend.repository.ProjectRepository;
import com.mylog.backend.repository.ResumeFileRepository;
import com.mylog.backend.repository.TagRepository;
import com.mylog.backend.model.UserAccount;
import com.mylog.backend.repository.UserAccountRepository;
import com.mylog.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final ProfileRepository profileRepository;
    private final ProjectRepository projectRepository;
    private final ResumeFileRepository resumeFileRepository;
    private final PostRepository postRepository;
    private final TagRepository tagRepository;
    private final UserAccountRepository userAccountRepository;
    private final AuthService authService;
    private final ObjectMapper objectMapper;

    @Value("${mylog.resume.storage-dir:./uploads/resume}")
    private String storageDir;

    @Value("${mylog.resume.filename:resume.pdf}")
    private String resumeFilename;

    @Value("${mylog.admin.username:admin}")
    private String adminUsername;

    @Value("${mylog.admin.password:admin123}")
    private String adminPassword;

    @Override
    public void run(String... args) throws Exception {
        seedAdmin();
        seedProfile();
        seedProjects();
        seedResumeFile();
        seedPosts();
    }

    private void seedAdmin() {
        if (userAccountRepository.count() > 0) {
            return;
        }
        UserAccount user = new UserAccount();
        user.setUsername(adminUsername);
        user.setPasswordHash(authService.hash(adminPassword));
        user.setCreatedAt(Instant.now());
        userAccountRepository.save(user);
        log.info("Seeded admin user: {}", adminUsername);
    }

    private void seedProfile() {
        if (profileRepository.count() > 0) {
            return;
        }
        Profile profile = new Profile();
        profile.setDisplayName("Site Owner");
        profile.setTagline("Personal portfolio");
        profile.setSubtitle("Edit profile and content in the admin panel.");
        profile.setBio("");
        profile.setPhone(null);
        profile.setEmail(null);
        profile.setGithubUrl(null);
        profile.setSkillsJson("[]");
        profile.setHighlightsJson("[]");
        profileRepository.save(profile);
        log.info("Seeded empty profile — configure via /admin/profile");
    }

    private void seedProjects() throws Exception {
        try (InputStream in = new ClassPathResource("seed/projects.json").getInputStream()) {
            List<JsonNode> nodes = objectMapper.readValue(in, new TypeReference<>() {});
            if (projectRepository.count() == 0) {
                for (JsonNode n : nodes) {
                    Project p = new Project();
                    p.setSlug(n.path("slug").asText());
                    p.setTitle(n.path("title").asText());
                    p.setSummary(n.path("summary").asText());
                    p.setContent(n.path("content").asText());
                    p.setTechStack(n.path("techStack").asText(null));
                    p.setGithubUrl(textOrNull(n, "githubUrl"));
                    p.setDemoUrl(textOrNull(n, "demoUrl"));
                    p.setStartDate(textOrNull(n, "startDate"));
                    p.setEndDate(textOrNull(n, "endDate"));
                    p.setSortOrder(n.path("sortOrder").asInt(0));
                    p.setFeatured(n.path("featured").asBoolean(false));
                    p.setPublished(n.path("published").asBoolean(true));
                    projectRepository.save(p);
                }
                log.info("Seeded {} projects", nodes.size());
                return;
            }
            int updated = 0;
            for (JsonNode n : nodes) {
                String githubUrl = textOrNull(n, "githubUrl");
                if (githubUrl == null) {
                    continue;
                }
                var existing = projectRepository.findBySlug(n.path("slug").asText());
                if (existing.isEmpty()) {
                    continue;
                }
                Project p = existing.get();
                if (githubUrl.equals(p.getGithubUrl())) {
                    continue;
                }
                p.setGithubUrl(githubUrl);
                projectRepository.save(p);
                updated++;
            }
            if (updated > 0) {
                log.info("Synced githubUrl for {} projects", updated);
            }
        }
    }

    private void seedResumeFile() {
        if (resumeFileRepository.count() > 0) {
            return;
        }
        Path path = Paths.get(storageDir, resumeFilename).toAbsolutePath().normalize();
        if (!Files.exists(path)) {
            log.warn("Resume PDF not found at {}, download will be unavailable until file is placed", path);
            return;
        }
        ResumeFile file = new ResumeFile();
        file.setStoragePath(path.toString());
        file.setOriginalFilename("resume.pdf");
        file.setCurrentVersion(true);
        file.setUploadedAt(Instant.now());
        resumeFileRepository.save(file);
        log.info("Registered resume PDF at {}", path);
    }

    private void seedPosts() throws Exception {
        if (postRepository.count() > 0) {
            return;
        }
        try (InputStream in = new ClassPathResource("seed/posts.json").getInputStream()) {
            List<JsonNode> nodes = objectMapper.readValue(in, new TypeReference<>() {});
            for (JsonNode n : nodes) {
                Post post = new Post();
                post.setSlug(n.path("slug").asText());
                post.setTitle(n.path("title").asText());
                post.setSummary(n.path("summary").asText(null));
                post.setContent(n.path("content").asText());
                post.setType(PostType.valueOf(n.path("type").asText()));
                post.setStatus(PostStatus.published);
                post.setPublishedAt(Instant.parse(n.path("publishedAt").asText()));

                Set<Tag> tags = new HashSet<>();
                for (JsonNode tagNode : n.path("tags")) {
                    tags.add(findOrCreateTag(tagNode.asText()));
                }
                post.setTags(tags);
                postRepository.save(post);
            }
            log.info("Seeded {} posts", nodes.size());
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
        // keep CJK as-is in slug for simplicity; also provide ascii fallback for pure CJK
        if (s.matches("[\\u4e00-\\u9fa5-]+")) {
            return "t-" + Integer.toHexString(name.hashCode());
        }
        return s;
    }

    private static String textOrNull(JsonNode n, String field) {
        JsonNode v = n.get(field);
        if (v == null || v.isNull()) {
            return null;
        }
        String text = v.asText();
        return text.isBlank() ? null : text;
    }
}
