let form = document.querySelector('form');
let dinamicContent = document.querySelector('#dinamicContent');

form.addEventListener('submit', async function (event) {
    event.preventDefault();
    clearUI();
    try {
        let githubResponse = await fetchGithubRepos(form.username.value);
        if (githubResponse.ok) {
            displayRepos(githubResponse.repos);
        } else {
            displayMessage(githubResponse.message, 'textWarning');
        }
    } catch (err) {
        displayMessage("Something went wrong. Refresh and try again!", 'textError');
    }
})

async function fetchGithubRepos(username) {
    let resp = await fetch(`https://api.github.com/users/${username}/repos`);
    let jsonResp = await resp.json();
    if (resp.ok) {
        return {
            ok: true,
            repos: jsonResp
                .filter(repo => repo.private === false)
                .map(repo => repo.name)
        }
    } else {
        return {
            ok: false,
            message: jsonResp.message
        }
    }
}

function displayRepos(repoNames) {
    let ul = document.createElement('ul');
    repoNames.forEach(repoName => {
        let li = document.createElement('li');
        li.innerHTML = repoName;
        ul.appendChild(li);
    })
    dinamicContent.appendChild(ul);

}

function displayMessage(message, textType) {
    let paragraph = document.createElement('p');
    paragraph.innerText = message;
    paragraph.classList.add(textType);
    dinamicContent.appendChild(paragraph);
}

function clearUI() {
    dinamicContent.innerHTML = '';
}