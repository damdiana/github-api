type GithubRepo = {
    private: boolean;
    html_url: string;
    name: string;
    language: string;
    owner: {
        login: string;
    }
    stargazers_count: number;
    forks_count: number;
}

type GithubIssue = {
    html_url: string;
    pull_request?: {
        url: string;
        html_url: string;
        diff_url: string;
        patch_url: string;
        merged_at: string;
    }
    created_at: string;
    assignee: {
        login: string;
    }
    updated_at: string;
    closed_at: string;
    title: string;
    state: string;
}

type GithubCommits = {
    commit: {
        message: string;
        author: {
            name: string;
            date: string;
        };
    }
    html_url: string;
}

async function fetchGithubRepos(username: string): Promise<{
    ok: true;
    repos: GithubRepo[]
} | {
    ok: false;
    message: string;
}> {
    let resp = await fetch(`https://api.github.com/users/${username}/repos`);
    if (resp.ok) {
        let repos: GithubRepo[] = await resp.json();
        return {
            ok: true,
            repos: repos
                .filter(repo => repo.private === false)
        }
    } else {
        let jsonResp = await resp.json();
        return {
            ok: false,
            message: jsonResp.message
        }
    }
}

async function fetchGithubCommits(owner: string, repo: string, perPage: number, page: number): Promise<{
    ok: true;
    commits: GithubCommits[];
    hasNextPage: boolean;
    hasPreviousPage: boolean;
} | {
    ok: false;
    message: string;
}> {
    let resp = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=${perPage}&page=${page}`);
    let linkHeader = resp.headers.get('link');
    let hasNextPage = linkHeader !== null && linkHeader.includes('rel="next"');
    let hasPreviousPage = linkHeader !== null && linkHeader.includes('rel="prev"');

    if (resp.ok) {
        let commits: GithubCommits[] = await resp.json();
        return {
            ok: true,
            commits,
            hasNextPage,
            hasPreviousPage
        }
    } else {
        let jsonResp = await resp.json();
        return {
            ok: false,
            message: jsonResp.message
        }
    }
}

async function fetchGithubIssues(owner: string, repo: string, perPage: number, page: number): Promise<{
    ok: true;
    issues: GithubIssue[];
    hasNextPage: boolean;
    hasPreviousPage: boolean;
} | {
    ok: false;
    message: string;
}> {
    let resp = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues?state=all&per_page=${perPage}&page=${page}`);
    let linkHeader = resp.headers.get('link');
    let hasNextPage = linkHeader !== null && linkHeader.includes('rel="next"');
    let hasPreviousPage = linkHeader !== null && linkHeader.includes('rel="prev"');

    if (resp.ok) {
        let issues: GithubIssue[] = await resp.json();
        return {
            ok: true,
            issues,
            hasNextPage,
            hasPreviousPage
        }
    } else {
        let jsonResp = await resp.json();
        return {
            ok: false,
            message: jsonResp.message
        }
    }
}

async function fetchGithubRepo(owner: string, repo: string) {
    let resp = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
    if (resp.ok) {
        let repo: GithubRepo = await resp.json();
        return {
            ok: true,
            repo
        }
    } else {
        let jsonResp = await resp.json();
        return {
            ok: false,
            message: jsonResp.message
        }
    }
}

export {
    fetchGithubCommits,
    fetchGithubIssues,
    fetchGithubRepo,
    fetchGithubRepos,
    GithubRepo,
    GithubIssue,
    GithubCommits
}