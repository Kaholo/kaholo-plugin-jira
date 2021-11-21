const jira = require("jira-client");
const parsers = require("./parsers");

function getClient(params, settings){
    let host = parsers.string(params.host || settings.host);
    const username = parsers.string(params.email || settings.email);
    const password = parsers.string(params.apiToken || settings.apiToken);
    if (!host || !username || !password) {
        throw "One of the required parameters was not provided";
    }

    let protocol = "https";
    if (host.startsWith("http://")){
        protocol = "http";
        host = host.slice(7);
    }
    else if (host.startsWith("https://")){
        host = host.slice(8);
    }
    else if (!host.includes(".")){
        host = `${host}.atlassian.net`
    }
    if (host.endsWith("/")) {
        host = host.slice(0, -1);
    }

    return new jira({
        protocol, host,
        username, password,
        apiVersion: '2',
        strictSSL: true
    });
}

async function listProjects(params, settings){
    const client = getClient(params, settings);
    return client.listProjects();
}

async function listIssues(params, settings){
    const client = getClient(params, settings);
    const startAt = parsers.number(params.startAt) || 0;
    const maxResults = parsers.number(params.maxResults) || 50;
    const fields =  params.fields == "*" ? undefined :
                    parsers.array(params.fields || ["created", "description", "summary", "status", "priority"]);
    let jql = "";
    if (params.overrideJql){
        jql = parsers.string(params.overrideJql);
    }
    else {
        const projectKey = parsers.autocomplete(params.project);
        const statusId = parsers.autocomplete(params.status);
        if (projectKey) jql = `project = ${projectKey}`;
        if (statusId) jql += `${jql ? " AND ": ""}status = ${statusId}`;
    }
    return client.searchJira(jql, {
        maxResults,
        fields,
        startAt
    });
}

async function listTransitions(params, settings){
    const client = getClient(params, settings);
    const issueId = parsers.autocomplete(params.issue);
    if (!issueId) throw "Must provide issue ID to get transitions"
    return (await client.listTransitions(issueId)).transitions;
}

async function listStatus(params, settings){
    const client = getClient(params, settings);
    return client.listStatus();
}

async function listProjectVersions(params, settings){
    const client = getClient(params, settings);
    const project = parsers.autocomplete(params.project);
    if (!project) throw "Must provide a project!";
    return client.getVersions(project);
}

async function listIssueTypes(params, settings){
    const client = getClient(params, settings);
    let project = parsers.autocomplete(params.project);
    if (!project) return client.listIssueTypes();
    project = await client.getProject(project);
    return project.issueTypes;
}

function stripAction(func){
    return (action, settings) => func(action.params, settings);
}

module.exports = {
    listProjects,
    listIssues,
    listTransitions,
    listStatus,
    listProjectVersions,
    listIssueTypes,
    getClient,
    stripAction
}
  
