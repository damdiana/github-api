import { fetchGithubIssues, fetchGithubRepos } from './GithubApi.js';
import { formatDateTime } from './utils.js';

let form = document.querySelector('form');
let dialog = document.querySelector('.details-dialog');
let dialogContent = dialog.querySelector('.details-dialog__content__dynamic');
let dinamicContent = document.querySelector('#dinamicContent');
let skeletonScreen = document.querySelector('.skeleton-screen');

dialog.addEventListener('click', (event) => {
    // The native <dialog> element is filling up the whole page. 
    // So we can add an EventListener on the dialog, this will contain the entire page. 
    // But how do we figure out if we clicked inside the dialog content or on the "backdrop". 
    // To do this, we wrapped all the dialog elements inside a <div>. This way, when we click inside the dialog content, 
    // the event.target will reference this <div>. But if we click outside, it will reference the dialog itself. 
    // Thus, the if statement below is what we need to detect when to close the dialog.
    if (event.target === dialog) {
        dialog.close();
    };
})

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
                <button class="repo-card__details-btn btn btn-navy">Details</button>
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

function displayIssues(issues, htmlElement) {
    htmlElement.innerHTML = "";
    let ul = document.createElement('ul');
    let descendingIssuesByCreatedDate = [...issues].sort((a, b) => {
        let timestampA = new Date(a.created_at).getTime();
        let timestampB = new Date(b.created_at).getTime();
        return timestampB - timestampA;
    })

    issues.forEach(issue => {
        let li = document.createElement('li');
        li.classList.add("list-none", "mt-4");

        li.innerHTML = `
        <div class="dialog-background"> 
        <a href='${issue.html_url}' target='_blank' class="title-hover">
            <span class="text-bold">
            👉🏻 Title:
            </span>
            <span class="issue-title"></span>
        </a>
        <p> <span class="text-bold"> 🚀 Type: </span> ${issue.hasOwnProperty('pull_request') ? 'Pull Request' : "Issue"} </p>  
        <p> <span class="text-bold"> 📅 Created at:</span> ${formatDateTime(new Date(issue.created_at))} </p>
        <p> <span class="text-bold"> 🛠️ State:</span> ${issue.state} </p> 
        ${issue.assignee !== null ? (`
        <p> <span class="text-bold"> 👨🏻‍💻 Assignee:</span> ${issue.assignee.login} </p>`) : ""}
        <p> <span class="text-bold"> 🕥 Last updated:</span> ${formatDateTime(new Date(issue.updated_at))} </p>
        <p> <span class="text-bold"> ✅ Closed at:</span> ${formatDateTime(new Date(issue.closed_at))} </p> 
        </div> 
        `;

        let titleElement = li.querySelector('.issue-title');
        // We are using 'innerText' for this because we have titles that
        // contain <aside>/<main> and using 'innerHTML' will actually create an element
        // in the page, element that it's not suppose to be there
        titleElement.innerText = issue.title;

        ul.appendChild(li);
    })
    htmlElement.appendChild(ul);
}

function displayPaginationControls(hasPreviousPage, hasNextPage, onPrevious, onNext, pageNumber, htmlElement) {
    let footer = document.createElement('footer');
    footer.classList.add('text-center');

    footer.innerHTML = `
        ${hasPreviousPage === true ? "<button class='btn btn-navy' id='prev-issue-button'> <i class='fa-solid fa-angles-left'></i> Prev </button>" : ""}
       <span class="page-number"> ${pageNumber} </span>
        ${hasNextPage === true ? "<button class='btn btn-navy' id='next-issue-button'> Next <i class='fa-solid fa-angles-right'></i> </button>" : ""}
        `;
    let prevButton = footer.querySelector('#prev-issue-button');
    let nextButton = footer.querySelector('#next-issue-button');

    if (prevButton !== null) {
        prevButton.addEventListener('click', onPrevious);
    }

    if (nextButton !== null) {
        nextButton.addEventListener('click', onNext);
    }

    htmlElement.appendChild(footer);
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

async function displayDialog(repo) {
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
        </div>
        <div class="issue-container">
        </div>
        `;
    dialog.showModal();

    fetchAndRenderIssues(repo.owner.login, repo.name, 5, 1);
}

function displayLoading(htmlElement) {
    htmlElement.innerHTML = 'Loading...';
}


async function fetchAndRenderIssues(repoOwner, repoName, perPage, page) {
    displayLoading(dialog.querySelector(".issue-container"));
    let response = await fetchGithubIssues(repoOwner, repoName, perPage, page)
    displayIssues(
        response.issues,
        dialog.querySelector(".issue-container"),

    );
    displayPaginationControls(
        response.hasPreviousPage,
        response.hasNextPage,
        () => fetchAndRenderIssues(repoOwner, repoName, perPage, page - 1),
        () => fetchAndRenderIssues(repoOwner, repoName, perPage, page + 1),
        page,
        dialog.querySelector(".issue-container"),
    )
}