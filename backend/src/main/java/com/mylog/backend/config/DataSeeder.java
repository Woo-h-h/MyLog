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

    @Value("${mylog.resume.filename:wanghuan-resume.pdf}")
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
        if (profileRepository.count() == 0) {
            Profile profile = new Profile();
            profile.setDisplayName("\u738b\u7115");
            profile.setTagline(
                    "Java \u540e\u7aef\u5f00\u53d1\uff5cRAG / Agent \u5de5\u7a0b\u5316\uff5c\u6e56\u5357\u5927\u5b66");
            profile.setSubtitle(
                    "\u4e13\u6ce8\u540e\u7aef\u4e0e\u667a\u80fd\u4f53\u5de5\u7a0b\u5316\uff0c\u80fd\u628a RAG / Agent \u4ece\u65b9\u6848\u843d\u5230\u53ef\u4ea4\u4ed8\u7cfb\u7edf\u3002");
            profile.setBio(
                    "\u6e56\u5357\u5927\u5b66\u901a\u4fe1\u5de5\u7a0b\u672c\u79d1\u5728\u8bfb\u3002\u5b9e\u4e60\u4e0e\u9879\u76ee\u805a\u7126 Java \u540e\u7aef\u3001RAG \u68c0\u7d22\u589e\u5f3a\u4e0e Agent \u5de5\u7a0b\u5316\u843d\u5730\u3002");
            profile.setPhone("17362955307");
            profile.setEmail("17362955307@163.com");
            profile.setGithubUrl(null);
            profile.setSkillsJson(
                    "[\"Java\",\"Spring Boot\",\"MySQL\",\"Redis\",\"JVM\",\"JUC\",\"RAG\",\"Agent\",\"MCP\","
                            + "\"\u8ba1\u7b97\u673a\u7f51\u7edc\",\"\u6570\u636e\u7ed3\u6784\u4e0e\u7b97\u6cd5\"]");
            profile.setHighlightsJson(defaultHighlightsJson());
            profileRepository.save(profile);
            log.info("Seeded default profile");
            return;
        }

        Profile existing = profileRepository.findAll().get(0);
        if (existing.getHighlightsJson() == null || existing.getHighlightsJson().isBlank()) {
            existing.setHighlightsJson(defaultHighlightsJson());
            profileRepository.save(existing);
            log.info("Updated profile highlights");
        }
    }

    private String defaultHighlightsJson() {
        return "[\"\u9662\u8c03\u7814\u90e8\u90e8\u957f / \u793e\u56e2\u603b\u8d1f\u8d23\u4eba\uff0c\u6210\u529f\u4e3e\u529e 200+\u4eba\u6d3b\u52a8\","
                + "\"\u6267\u884c\u529b\u5f3a\uff0c\u5584\u4e8e\u6c9f\u901a\u534f\u8c03\uff0c\u80fd\u9ad8\u6548\u63a8\u8fdb\u9879\u76ee\u843d\u5730\","
                + "\"\u5bf9\u6280\u672f\u9886\u57df\u5145\u6ee1\u70ed\u60c5\uff0c\u671f\u5f85\u5728\u76ee\u6807\u5c97\u4f4d\u4e2d\u6df1\u5ea6\u5b9e\u8df5\"]";
    }

    private void seedProjects() throws Exception {
        if (projectRepository.count() > 0) {
            return;
        }
        try (InputStream in = new ClassPathResource("seed/projects.json").getInputStream()) {
            List<JsonNode> nodes = objectMapper.readValue(in, new TypeReference<>() {});
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
        file.setOriginalFilename("\u738b\u7115_\u7b80\u5386.pdf");
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
