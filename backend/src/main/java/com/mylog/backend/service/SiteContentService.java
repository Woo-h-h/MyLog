package com.mylog.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mylog.backend.model.SiteContent;
import com.mylog.backend.repository.SiteContentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.io.InputStream;
import java.time.Instant;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class SiteContentService {

    public static final String KEY_STUDENT_WORK = "student_work";
    public static final String KEY_RESUME = "resume";

    private static final Set<String> ALLOWED_KEYS = Set.of(KEY_STUDENT_WORK, KEY_RESUME);

    private final SiteContentRepository siteContentRepository;
    private final ObjectMapper objectMapper;

    public JsonNode getPublic(String key) {
        validateKey(key);
        return readNode(key);
    }

    public JsonNode getAdmin(String key) {
        validateKey(key);
        return readNode(key);
    }

    public JsonNode save(String key, JsonNode body) {
        validateKey(key);
        if (body == null || body.isNull()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "content required");
        }
        try {
            String json = objectMapper.writeValueAsString(body);
            SiteContent entity = siteContentRepository.findByContentKey(key).orElseGet(SiteContent::new);
            entity.setContentKey(key);
            entity.setJsonContent(json);
            entity.setUpdatedAt(Instant.now());
            siteContentRepository.save(entity);
            return objectMapper.readTree(json);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "invalid json content");
        }
    }

    public <T> T readAs(String key, Class<T> type, String seedClasspath) {
        validateKey(key);
        try {
            JsonNode node = readNode(key);
            return objectMapper.treeToValue(node, type);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "failed to read content: " + key);
        }
    }

    private JsonNode readNode(String key) {
        return siteContentRepository.findByContentKey(key)
                .map(entity -> {
                    try {
                        return objectMapper.readTree(entity.getJsonContent());
                    } catch (Exception e) {
                        throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "corrupt content: " + key);
                    }
                })
                .orElseGet(() -> loadSeed(key));
    }

    private JsonNode loadSeed(String key) {
        String seedPath = switch (key) {
            case KEY_STUDENT_WORK -> "seed/student-work.json";
            case KEY_RESUME -> "seed/resume.json";
            default -> throw new ResponseStatusException(HttpStatus.NOT_FOUND, "unknown content key");
        };
        try (InputStream in = new ClassPathResource(seedPath).getInputStream()) {
            JsonNode node = objectMapper.readTree(in);
            persistSeed(key, node);
            return node;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "failed to load seed: " + key);
        }
    }

    private void persistSeed(String key, JsonNode node) {
        try {
            SiteContent entity = new SiteContent();
            entity.setContentKey(key);
            entity.setJsonContent(objectMapper.writeValueAsString(node));
            entity.setUpdatedAt(Instant.now());
            siteContentRepository.save(entity);
        } catch (Exception ignored) {
            /* seed persistence is best-effort */
        }
    }

    private void validateKey(String key) {
        if (!ALLOWED_KEYS.contains(key)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "content key not found");
        }
    }
}
