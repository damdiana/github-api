(()=>{"use strict";function e(e){return new Intl.DateTimeFormat("en-GB",{year:"numeric",month:"numeric",day:"numeric",hour:"2-digit",minute:"2-digit"}).format(e)}let n=document.querySelector("form");if(null===n){let e="There's no form in the page!";throw alert(e),new Error(e)}let t=document.querySelector(".details-dialog");if(null===t){let e="There's no dialog in the page!";throw alert(e),new Error(e)}let a=t.querySelector(".details-dialog__content__dynamic"),s=document.querySelector("#dinamicContent"),l=document.querySelector(".skeleton-screen");function r(e,n){let t=document.createElement("p");t.innerText=e,t.classList.add(n),null!==s&&s.appendChild(t)}async function i(n,t,a,s,l){let r=n.querySelector(".issue-container");if(null===r)throw new Error("Tried rendering issues but found no parent where to insert them.");r.innerHTML="Loading...";let o=await async function(e,n,t,a){let s=await fetch(`https://api.github.com/repos/${e}/${n}/issues?state=all&per_page=${t}&page=${a}`),l=s.headers.get("link"),r=null!==l&&l.includes('rel="next"'),i=null!==l&&l.includes('rel="prev"');return s.ok?{ok:!0,issues:await s.json(),hasNextPage:r,hasPreviousPage:i}:{ok:!1,message:(await s.json()).message}}(t,a,s,l);!0===o.ok?(function(n,t){if(t.innerHTML="",0!==n.length){let a=document.createElement("ul");[...n].sort(((e,n)=>{let t=new Date(e.created_at).getTime();return new Date(n.created_at).getTime()-t})),n.forEach((n=>{let t=document.createElement("li");t.classList.add("list-none","mt-4"),t.innerHTML=`\n        <div class="dialog-background"> \n        <a href='${n.html_url}' target='_blank' class="title-hover">\n            <span class="text-bold">\n            👉🏻 Title:\n            </span>\n            <span class="issue-title"></span>\n        </a>\n        <p> <span class="text-bold"> 🚀 Type: </span> ${n.hasOwnProperty("pull_request")?"Pull Request":"Issue"} </p>  \n        <p> <span class="text-bold"> 📅 Created at:</span> ${e(new Date(n.created_at))} </p>\n        <p> <span class="text-bold"> 🛠️ State:</span> ${n.state} </p> \n        ${null!==n.assignee?`\n        <p> <span class="text-bold"> 👨🏻‍💻 Assignee:</span> ${n.assignee.login} </p>`:""}\n        <p> <span class="text-bold"> 🕥 Last updated:</span> ${e(new Date(n.updated_at))} </p>\n        <p> <span class="text-bold"> ✅ Closed at:</span> ${e(new Date(n.closed_at))} </p> \n        </div> \n        `;let s=t.querySelector(".issue-title");null!==s&&(s.innerText=n.title),a.appendChild(t)})),t.appendChild(a)}else t.innerHTML='\n        <div class="dialog-background mt-4"> \n        <p class="text-center"> There are no issues for this repo 🤷🏻‍♂️ </p>\n        </div>\n        '}(o.issues,r),function(e,r,o,c,d,u){let p=document.createElement("footer");p.classList.add("text-center"),p.innerHTML=`\n        ${!0===e?"<button class='btn btn-navy' id='prev-issue-button'> <i class='fa-solid fa-angles-left'></i> Prev </button>":""}\n       <span class="page-number"> ${d} </span>\n        ${!0===r?"<button class='btn btn-navy' id='next-issue-button'> Next <i class='fa-solid fa-angles-right'></i> </button>":""}\n        `;let g=p.querySelector("#prev-issue-button"),m=p.querySelector("#next-issue-button");null!==g&&g.addEventListener("click",(()=>i(n,t,a,s,l-1))),null!==m&&m.addEventListener("click",(()=>i(n,t,a,s,l+1))),u.appendChild(p)}(o.hasPreviousPage,o.hasNextPage,0,0,l,r)):r.innerHTML=`<p>${o.message} </p>`}t.addEventListener("click",(e=>{e.target===t&&e.target.close()})),n.addEventListener("submit",(async function(e){e.preventDefault(),null!==s&&(s.innerHTML=""),null!==l&&l.classList.toggle("hidden");try{let n=await async function(e){let n=await fetch(`https://api.github.com/users/${e}/repos`);return n.ok?{ok:!0,repos:(await n.json()).filter((e=>!1===e.private))}:{ok:!1,message:(await n.json()).message}}(e.currentTarget.username.value);n.ok?function(e){let n=document.createElement("ul");n.classList.add("repo-list"),e.forEach((e=>{let s=document.createElement("li");s.classList.add("repo-card"),s.innerHTML=`\n        <a href="${e.html_url}" class="repo-link"> ${e.name} </a>\n        <div class="repo-details__display mt-2">\n            ${null!==e.language?`\n            <div class="flex align-center">\n                    <span class="lng-badge lng-badge-${e.language}"> </span>\n                    <p class="text-sm m-1"> ${e.language} </p>\n            </div>\n            `:"<div> </div>"}\n            <div class="flex align-center">\n                <a href="https://github.com/${e.owner.login}/${e.name}/stargazers" type="button">\n                <i class="fa-regular fa-star"></i>\n                    <span class="text-sm m-1"> ${e.stargazers_count} </span>\n                </a>\n            </div>\n            <div class="flex align-center">\n                <a href="https://github.com/${e.owner.login}/${e.name}/network/members">\n                <i class="fa-solid fa-code-fork"></i>\n                <span class="text-sm m-1"> ${e.forks_count} </span>\n                </a>\n            </div> \n            <div class="text-center"> \n                <button class="repo-card__details-btn btn btn-navy">Details</button>\n            </div>\n            </div>       \n        `;let l=s.querySelector(".repo-card__details-btn");null!==l&&l.addEventListener("click",(()=>{!async function(e){null!==a&&(a.innerHTML=`\n        <h2 class="text-center"> ${e.name} </h2>\n        <div class="dialog__repo-card flex flex-wrap justify-around">\n            <p class="m-0"> \n            <span class="text-bold"> Owner: </span> ${e.owner.login} </p>\n            ${null!==e.language?`\n                <div class="flex align-center">\n                   <p class="m-0"> \n                   <span class="text-bold"> Language</span>: ${e.language} </p>\n                </div>\n            `:""}\n        <div class="flex align-center">\n                <a href="https://github.com/${e.owner.login}/${e.name}/stargazers" type="button">\n                <span class="text-bold"> Stars: </span>\n                <span> ${e.stargazers_count} </span>\n                </a>\n        </div>\n        <div class="flex align-center">\n                <a href="https://github.com/${e.owner.login}/${e.name}/network/members">\n                <span class="text-bold"> Forks: </span>\n                <span"> ${e.forks_count} </span>\n                </a>\n        </div>\n        </div>\n        <div class="issue-container">\n        </div>\n        `),null!==t&&(t.showModal(),i(t,e.owner.login,e.name,5,1))}(e)})),n.appendChild(s)})),null!==s&&s.appendChild(n)}(n.repos):r(n.message,"textWarning")}catch(e){console.log(e),r("Something went wrong. Refresh and try again!","textError")}null!==l&&l.classList.toggle("hidden")}))})();