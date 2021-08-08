const jira = require("jira-client");
const parsers = require("./parsers");

function getClient(params, settings){
    const hostName = params.host || settings.host;
    const username = params.email || settings.email;
    const password = params.apiToken || settings.apiToken;
    if (!hostName || !username || !password) {
        throw "One of the required parameters was not provided";
    }
    return new jira({
        protocol: 'https',
        host: `${hostName}.atlassian.net`,
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
    const projectKey = parsers.autocomplete(params.project);
    if (!projectKey) throw "Must provide a project!";
    return client.getVersions(projectKey);
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
    getClient,
    stripAction
}
  