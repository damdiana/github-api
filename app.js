import { fetchGithubRepos } from './GithubApi.js';

let form = document.querySelector('form');
let dialog = document.querySelector('.details-dialog');
let dialogContent = dialog.querySelector('.details-dialog__content');
let dinamicContent = document.querySelector('#dinamicContent');
let skeletonScreen = document.querySelector('.skeleton-screen');

form.addEventListener('submit', async function (event) {
    event.preventDefault();
    clearUI();
    skeletonScreen.classList.toggle('hidden');
    try {
        let githubResponse = await fetchGithubRepos(form.username.value);
        if (githubResponse.ok) {
            displayRepos(githubResponse.repos);
        } else {
            displayMessage(githubResponse.message, 'textWarning');
        }
    } catch (err) {
        console.log(err);
        displayMessage("Something went wrong. Refresh and try again!", 'textError');
    }
    skeletonScreen.classList.toggle('hidden');
})

function displayRepos(repos) {
    let ul = document.createElement('ul');
    ul.classList.add('repo-list');

    repos.forEach(repo => {
        let li = document.createElement('li');
        li.classList.add("repo-card");

        li.innerHTML = `
        <a href="${repo.html_url}" class="repo-link"> ${repo.name} </a>
        <div class="repo-details__display mt-2">
            ${repo.language !== null ? (`
            <div class="flex align-center">
                    <span class="lng-badge lng-badge-${repo.language}"> </span>
                    <p class="text-sm m-1"> ${repo.language} </p>
            </div>
            `) : '<div> </div>'}
            <div class="flex align-center">
                <a href="https://github.com/${repo.owner.login}/${repo.name}/stargazers" type="button">
                <i class="fa-regular fa-star"></i>
                    <span class="text-sm m-1"> ${repo.stargazers_count} </span>
                </a>
            </div>
            <div class="flex align-center">
                <a href="https://github.com/${repo.owner.login}/${repo.name}/network/members">
                <i class="fa-solid fa-code-fork"></i>
                <span class="text-sm m-1"> ${repo.forks_count} </span>
                </a>
            </div> 
            <div class="text-center"> 
                <button class="repo-card__details-btn">Details</button>
            </div>
            </div>       
        `;

        let detailsBtn = li.querySelector('.repo-card__details-btn');
        detailsBtn.addEventListener('click', () => {
            displayDialog(repo);
        })

        ul.appendChild(li);
    });

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

function displayDialog(repo) {
    dialogContent.innerHTML = `
        <h2 class="text-center"> ${repo.name} </h2>
        <div class="dialog__repo-card flex flex-wrap justify-around">
            <p class="m-0"> 
            <span class="text-bold"> Owner: </span> ${repo.owner.login} </p>
            ${repo.language !== null ? (`
                <div class="flex align-center">
                   <p class="m-0"> 
                   <span class="text-bold"> Language</span>: ${repo.language} </p>
                </div>
            `) : ''}
        <div class="flex align-center">
                <a href="https://github.com/${repo.owner.login}/${repo.name}/stargazers" type="button">
                <span class="text-bold"> Stars: </span>
                <span> ${repo.stargazers_count} </span>
                </a>
        </div>
        <div class="flex align-center">
                <a href="https://github.com/${repo.owner.login}/${repo.name}/network/members">
                <span class="text-bold"> Forks: </span>
                <span"> ${repo.forks_count} </span>
                </a>
        </div>
    `;
    dialog.showModal();
}