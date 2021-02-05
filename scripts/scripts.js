import api from './api.js';

let repositories;
let contributors;
let issues;
let issue = $('#issues tbody');
let repoSelect = $('#repo');
let estadoSelect = $('#estado');

const max = 20;

$(document).ready(async function () {
    repositories = await api('/repositories');
    criaListaRepositorios(repositories)
});

repoSelect.change(function () {
    criarListaContributors(repoSelect.val());
    criarListaIssues(repoSelect.val());
});



estadoSelect.change(function () {
    if (estadoSelect.val() !== 'default') {
        if (estadoSelect.val() === 'open') {
            $('.open').show()
            $('.closed').hide();
        } else {
            $('.open').hide()
            $('.closed').show();
        }
    } else {
        $('.open').show()
        $('.closed').show();
    }
});

issue.on('click', 'tr', function () {
    let urlIssue = $(this).attr('url')
    urlIssue = urlIssue.replace('https://api.github.com', '');
    console.log(urlIssue);
    criarModalComentario(urlIssue);
});

function criaListaRepositorios(dados) {
    dados.map(item => {
        let option = `<option value=${item.full_name}>${item.full_name}</option>`
        repoSelect.append(option);
    })
}

async function criarListaContributors(name) {
    let contributors100 = $('#contributors-100 tbody');
    let contributors200 = $('#contributors-200 tbody');
    let contributors500 = $('#contributors-500 tbody');
    contributors100.empty();
    contributors200.empty();
    contributors500.empty();
    if (name !== 'default') {
        var counter = 0;
        contributors = await api(`/repos/${name}/contributors`);
        for (let i = 0; counter < max && i < contributors.length; i++) {
            if (contributors[i].contributions > 100 && contributors[i].contributions <= 200) {
                counter++;
                let contributor = `<tr><td><img class="rounded-circle" height="35" src=${contributors[i].avatar_url} /></td><td>${contributors[i].login}</td><td><a href=${contributors[i].html_url}>${contributors[i].html_url}</a><td>${contributors[i].contributions}</td></td></tr>`
                contributors100.append(contributor);
            }
            if (contributors[i].contributions > 200 && contributors[i].contributions <= 500) {
                counter++;
                let contributor = `<tr><td><img class="rounded-circle" height="35" src=${contributors[i].avatar_url} /></td><td>${contributors[i].login}</td><td><a href=${contributors[i].html_url}>${contributors[i].html_url}</a><td>${contributors[i].contributions}</td></td></tr>`
                contributors200.append(contributor);
            }
            if (contributors[i].contributions > 500) {
                counter++;
                let contributor = `<tr><td><img class="rounded-circle" height="35" src=${contributors[i].avatar_url} /></td><td>${contributors[i].login}</td><td><a href=${contributors[i].html_url}>${contributors[i].html_url}</a><td>${contributors[i].contributions}</td></td></tr>`
                contributors500.append(contributor);
            }
        }
    }
}

async function criarListaIssues(name) {
    let issueElement = $('#issues tbody');
    issueElement.empty();
    if (name !== 'default') {
        issues = await api(`/repos/${name}/issues`);
        issues.map((issue, index) => {

            let issueHTML = `<tr class="${issue.state}" url=${issue.url} data-toggle="modal" data-target="#comments-modal"><td><img class="rounded-circle" height="35" src=${issue.user.avatar_url} /></td><td>${issue.user.login}</td><td>${issue.title}</td><td>${issue.state}</td><tr/>`
            issueElement.append(issueHTML);
            console.log(issue)
            console.log(index)
        })

    }
    console.log(issues);
};

async function criarModalComentario(endpoint) {
    let titulo = $('.modal-title');
    let body = $('.body');
    let comments = $('.comments');
    titulo.empty();
    comments.empty();
    body.empty();

    const issuesData = await api(endpoint);
    titulo.html(issuesData.title);
    if (issuesData.body != null) {
        body.html(`[${new Date(issuesData.created_at).toLocaleString()}]: <span style="font-weight: bold">${issuesData.user.login}</span> disse: </br></br>${issuesData.body}`);
    } else {
        body.html('Sem descrição');
    }

    if (issuesData.comments == 0) {
        comments.html('Nenhum comentário');
    } else {
        const issuesComments = await api(`${endpoint}/comments`);
        issuesComments.map(comment => {
            comments.append(`[${new Date(comment.created_at).toLocaleString()}]: <span style="font-weight: bold">${comment.user.login}</span> comentou: </br></br>${comment.body}</br></br></br>`)
        })
        console.log(issuesComments);
    }

}


