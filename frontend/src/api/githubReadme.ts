export type GithubRepoRef = {
  owner: string
  repo: string
  rawBaseUrl: string
  readmeUrl: string
}

/** Parse https://github.com/owner/repo[/...] into raw README URLs. */
export function parseGithubRepo(githubUrl: string): GithubRepoRef | null {
  try {
    const url = new URL(githubUrl.trim())
    if (!/(^|\.)github\.com$/i.test(url.hostname)) return null
    const parts = url.pathname
      .replace(/\.git$/i, '')
      .split('/')
      .filter(Boolean)
    if (parts.length < 2) return null
    const owner = parts[0]
    const repo = parts[1]
    const rawBaseUrl = `https://raw.githubusercontent.com/${owner}/${repo}/HEAD/`
    return {
      owner,
      repo,
      rawBaseUrl,
      readmeUrl: `${rawBaseUrl}README.md`,
    }
  } catch {
    return null
  }
}

export async function fetchGithubReadme(githubUrl: string): Promise<{ markdown: string; rawBaseUrl: string }> {
  const ref = parseGithubRepo(githubUrl)
  if (!ref) {
    throw new Error('invalid github url')
  }
  const res = await fetch(ref.readmeUrl)
  if (!res.ok) {
    throw new Error(`readme fetch failed: ${res.status}`)
  }
  const markdown = await res.text()
  if (!markdown.trim()) {
    throw new Error('readme empty')
  }
  return { markdown, rawBaseUrl: ref.rawBaseUrl }
}
