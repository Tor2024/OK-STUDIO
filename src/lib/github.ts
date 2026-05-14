/**
 * GitHub API client for reading/writing data JSON files.
 * Token and repo config are stored in localStorage (admin only).
 */

export interface GithubConfig {
  token: string;
  owner: string;
  repo: string;
  branch: string;
}

export function getGithubConfig(): GithubConfig | null {
  try {
    const raw = localStorage.getItem('github_config');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveGithubConfig(cfg: GithubConfig) {
  localStorage.setItem('github_config', JSON.stringify(cfg));
}

export function clearGithubConfig() {
  localStorage.removeItem('github_config');
}

async function apiRequest(cfg: GithubConfig, path: string, options?: RequestInit) {
  const url = `https://api.github.com/repos/${cfg.owner}/${cfg.repo}/${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? `GitHub API error ${res.status}`);
  }
  return res.json();
}

/** Read a file and return its content + sha */
export async function readFile(cfg: GithubConfig, filePath: string): Promise<{ content: string; sha: string }> {
  const data = await apiRequest(cfg, `contents/${filePath}?ref=${cfg.branch}`);
  const content = atob(data.content.replace(/\n/g, ''));
  return { content, sha: data.sha };
}

/** Write (create or update) a file */
export async function writeFile(cfg: GithubConfig, filePath: string, content: string, message: string, sha?: string) {
  const body: Record<string, string> = {
    message,
    content: btoa(unescape(encodeURIComponent(content))),
    branch: cfg.branch,
  };
  if (sha) body.sha = sha;
  return apiRequest(cfg, `contents/${filePath}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

/** Read a JSON data file from the repo */
export async function readDataFile<T>(cfg: GithubConfig, name: string): Promise<{ data: T; sha: string }> {
  // For projects and insights, read from index.json
  const path = (name === 'projects' || name === 'insights') 
    ? `public/data/${name}/index.json`
    : `public/data/${name}.json`;
  const { content, sha } = await readFile(cfg, path);
  return { data: JSON.parse(content) as T, sha };
}

/** Write a JSON data file to the repo (triggers redeploy) */
export async function writeDataFile<T>(cfg: GithubConfig, name: string, data: T, sha: string, action: string) {
  const content = JSON.stringify(data, null, 2);
  const path = (name === 'projects' || name === 'insights')
    ? `public/data/${name}/index.json`
    : `public/data/${name}.json`;
  return writeFile(cfg, path, content, `admin: ${action} [${name}]`, sha);
}

/** Read a single item (project or insight) with full content */
export async function readItem<T>(cfg: GithubConfig, collection: string, id: string): Promise<{ data: T; sha: string }> {
  const { content, sha } = await readFile(cfg, `public/data/${collection}/${id}.json`);
  return { data: JSON.parse(content) as T, sha };
}

/** Write a single item (project or insight) */
export async function writeItem<T>(cfg: GithubConfig, collection: string, id: string, data: T, sha: string | undefined, action: string) {
  const content = JSON.stringify(data, null, 2);
  return writeFile(cfg, `public/data/${collection}/${id}.json`, content, `admin: ${action} [${collection}/${id}]`, sha);
}

/** Delete a file from the repo */
export async function deleteFile(cfg: GithubConfig, filePath: string, sha: string, message: string) {
  return apiRequest(cfg, `contents/${filePath}`, {
    method: 'DELETE',
    body: JSON.stringify({
      message,
      sha,
      branch: cfg.branch,
    }),
  });
}

/** Verify token works by fetching repo info */
export async function verifyToken(cfg: GithubConfig): Promise<boolean> {
  try {
    await apiRequest(cfg, '');
    return true;
  } catch {
    return false;
  }
}
