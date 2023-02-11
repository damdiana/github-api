async function fetchGithubRepos(username) {
    let resp = await fetch(`https://api.github.com/users/${username}/repos`);
    let jsonResp = await resp.json();
    if (resp.ok) {
        return {
            ok: true,
            repos: jsonResp
                .filter(repo => repo.private === false)
        }
    } else {
        return {
            ok: false,
            message: jsonResp.message
        }
    }
}

async function fetchGithubCommits(owner, repo, perPage, page) {
    let resp = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=${perPage}&page=${page}`);
    let jsonResp = await resp.json();
    if (resp.ok) {
        return {
            ok: true,
            commits: jsonResp
        }
    } else {
        return {
            ok: false,
            message: jsonResp.message
        }
    }
}

async function fetchGithubIssues(owner, repo, perPage, page) {
    let resp = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues?state=all&per_page=${perPage}&page=${page}`);
    let hasNextPage = resp.headers.has('link') && resp.headers.get('link').includes('rel="next"');
    let hasPreviousPage = resp.headers.has('link') && resp.headers.get('link').includes('rel="prev"');

    let jsonResp = await resp.json();
    if (resp.ok) {
        return {
            ok: true,
            issues: jsonResp,
            hasNextPage,
            hasPreviousPage
        }
    } else {
        return {
            ok: false,
            message: jsonResp.message
        }
    }
}

async function fetchGithubRepo(owner, repo) {
    let resp = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
    let jsonResp = await resp.json();
    if (resp.ok) {
        return {
            ok: true,
            repo: jsonResp
        }
    } else {
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
    fetchGithubRepos
}