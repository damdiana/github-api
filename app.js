import { fetchGithubRepos } from './GithubApi.js';

let form = document.querySelector('form');
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
        <div class="flex justify-around mt-1">
            ${repo.language !== null ? (`
                <div class="flex align-center">
                    <span class="lng-badge lng-badge-${repo.language}"> </span>
                    <p class="repo-details-style m-1"> ${repo.language} </p>
                </div>
            `) : ''}
            <div class="flex align-center">
                <a href="https://github.com/${repo.owner.login}/${repo.name}/stargazers" type="button">
                    <svg
                        xmlns=" http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                        <path
                            d="M287.9 0C297.1 0 305.5 5.25 309.5 13.52L378.1 154.8L531.4 177.5C540.4 178.8 547.8 185.1 550.7 193.7C553.5 202.4 551.2 211.9 544.8 218.2L433.6 328.4L459.9 483.9C461.4 492.9 457.7 502.1 450.2 507.4C442.8 512.7 432.1 513.4 424.9 509.1L287.9 435.9L150.1 509.1C142.9 513.4 133.1 512.7 125.6 507.4C118.2 502.1 114.5 492.9 115.1 483.9L142.2 328.4L31.11 218.2C24.65 211.9 22.36 202.4 25.2 193.7C28.03 185.1 35.5 178.8 44.49 177.5L197.7 154.8L266.3 13.52C270.4 5.249 278.7 0 287.9 0L287.9 0zM287.9 78.95L235.4 187.2C231.9 194.3 225.1 199.3 217.3 200.5L98.98 217.9L184.9 303C190.4 308.5 192.9 316.4 191.6 324.1L171.4 443.7L276.6 387.5C283.7 383.7 292.2 383.7 299.2 387.5L404.4 443.7L384.2 324.1C382.9 316.4 385.5 308.5 391 303L476.9 217.9L358.6 200.5C350.7 199.3 343.9 194.3 340.5 187.2L287.9 78.95z" />
                    </svg>
                    <span class="repo-details-style m-1"> ${repo.stargazers_count} </span>
                </a>
            </div>
            <div class="flex align-center">
                <a href="https://github.com/${repo.owner.login}/${repo.name}/network/members">
                <svg
                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                        <path
                            d="M80 104c13.3 0 24-10.7 24-24s-10.7-24-24-24S56 66.7 56 80s10.7 24 24 24zm80-24c0 32.8-19.7 61-48 73.3V192c0 17.7 14.3 32 32 32H304c17.7 0 32-14.3 32-32V153.3C307.7 141 288 112.8 288 80c0-44.2 35.8-80 80-80s80 35.8 80 80c0 32.8-19.7 61-48 73.3V192c0 53-43 96-96 96H256v70.7c28.3 12.3 48 40.5 48 73.3c0 44.2-35.8 80-80 80s-80-35.8-80-80c0-32.8 19.7-61 48-73.3V288H144c-53 0-96-43-96-96V153.3C19.7 141 0 112.8 0 80C0 35.8 35.8 0 80 0s80 35.8 80 80zm208 24c13.3 0 24-10.7 24-24s-10.7-24-24-24s-24 10.7-24 24s10.7 24 24 24zM248 432c0-13.3-10.7-24-24-24s-24 10.7-24 24s10.7 24 24 24s24-10.7 24-24z" />
                    </svg>
                    <span class="repo-details-style m-1"> ${repo.forks_count} </span>
                </a>
            </div>
        </div>
        `;
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