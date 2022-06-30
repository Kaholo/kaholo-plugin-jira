const kaholoPluginLibrary = require("@kaholo/plugin-library");
const autocomplete = require("./autocomplete");
const {
  listIssues,
  listTransitions,
  listProjects,
  listProjectVersions,
  listAssigneeDetails,
} = require("./jira-list-functions");
const { getJiraClient } = require("./helpers");

function transitionIssue({
  issue,
  transition,
  host,
  email,
  apiToken,
}) {
  const jiraClient = getJiraClient({ host, email, apiToken });

  return jiraClient.transitionIssue(issue, {
    transition: { id: transition },
  });
}

function createProjectVersion({
  host,
  email,
  apiToken,
  project: projectId,
  versionName,
  description,
  startDate,
  endDate: releaseDate,
  archived,
}) {
  const jiraClient = getJiraClient({ host, email, apiToken });

  return jiraClient.createVersion({
    description,
    name: versionName,
    archived,
    startDate,
    releaseDate,
    projectId,
  });
}

function updateProjectVersion({
  host,
  email,
  apiToken,
  project: projectId,
  version: id,
  description,
  startDate,
  endDate: releaseDate,
  moveUrl,
  released,
  archived,
}) {
  const jiraClient = getJiraClient({ host, email, apiToken });

  return jiraClient.updateVersion({
    archived,
    id,
    description,
    projectId,
    released,
    startDate,
    releaseDate,
    moveUnfixedIssuesTo: moveUrl,
  });
}

function createIssue({
  host,
  email,
  apiToken,
  project,
  issueType,
  summary,
  description,
}) {
  const jiraClient = getJiraClient({ host, email, apiToken });

  return jiraClient.addNewIssue({
    fields: {
      summary,
      description,
      project: { id: project },
      issuetype: { id: issueType },
    },
  });
}

function addIssueComment({
  host,
  email,
  apiToken,
  issue,
  comment,
}) {
  const jiraClient = getJiraClient({ host, email, apiToken });

  return jiraClient.addComment(issue, comment);
}

module.exports = kaholoPluginLibrary.bootstrap({
  transitionIssue,
  createProjectVersion,
  updateProjectVersion,
  createIssue,
  addIssueComment,
  listIssues,
  listTransitions,
  listProjects,
  listProjectVersions,
  listAssigneeDetails,
}, {
  ...autocomplete,
});
