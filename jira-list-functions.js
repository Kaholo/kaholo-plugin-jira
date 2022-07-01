const { getJiraClient, formatDate } = require("./helpers");

const DEFAULT_FIELDS = ["created", "description", "summary", "status", "priority"];
const DEFAULT_MAX_RESULTS = 50;
const DEFAULT_START_AT = 0;

function listIssues({
  host,
  email,
  apiToken,
  project,
  status,
  startDate,
  endDate,
  overrideJql: customJqlString,
  maxResults = DEFAULT_MAX_RESULTS,
  startAt = DEFAULT_START_AT,
  fields = DEFAULT_FIELDS,
}) {
  const jiraClient = getJiraClient({ host, email, apiToken });

  const jqlSegments = [];
  if (customJqlString) {
    jqlSegments.push(customJqlString);
  }
  if (!customJqlString && project) {
    jqlSegments.push(`project = ${project}`);
  }
  if (!customJqlString && status) {
    jqlSegments.push(`status = ${status}`);
  }
  if (!customJqlString && startDate) {
    const startDateFormatted = formatDate(startDate);
    jqlSegments.push(`updated >= ${startDateFormatted}`);
  }
  if (!customJqlString && endDate) {
    const endDateFormatted = formatDate(endDate);
    jqlSegments.push(`updated <= ${endDateFormatted}`);
  }

  const searchOptions = { maxResults, startAt };
  if (fields !== "*") {
    searchOptions.fields = fields;
  }

  return jiraClient.searchJira(jqlSegments.join(" AND "), searchOptions);
}

function listAssigneeDetails({
  host,
  email,
  apiToken,
  startDate,
  endDate,
  overrideJql: customJqlString,
  users: assignee,
  maxResults = DEFAULT_MAX_RESULTS,
  startAt = DEFAULT_START_AT,
  fields = DEFAULT_FIELDS,
}) {
  const jiraClient = getJiraClient({ host, email, apiToken });

  const jqlSegments = [];
  if (customJqlString) {
    jqlSegments.push(customJqlString);
  }
  if (!customJqlString && assignee) {
    jqlSegments.push(`assignee in ('${assignee}')`);
  }
  if (!customJqlString && startDate) {
    const startDateFormatted = formatDate(startDate);
    jqlSegments.push(`updated >= ${startDateFormatted}`);
  }
  if (!customJqlString && endDate) {
    const endDateFormatted = formatDate(endDate);
    jqlSegments.push(`updated <= ${endDateFormatted}`);
  }

  const searchOptions = { maxResults, startAt };
  if (fields !== "*") {
    searchOptions.fields = fields;
  }

  return jiraClient.searchJira(jqlSegments.join(" AND "), searchOptions);
}

function listTransitions({
  host,
  email,
  apiToken,
  issue,
}) {
  const jiraClient = getJiraClient({ host, email, apiToken });

  return jiraClient.listTransitions(issue);
}

function listProjects({
  host,
  email,
  apiToken,
}) {
  const jiraClient = getJiraClient({ host, email, apiToken });

  return jiraClient.listProjects();
}

function listProjectVersions({
  host,
  email,
  apiToken,
  project,
}) {
  const jiraClient = getJiraClient({ host, email, apiToken });

  return jiraClient.getVersions(project);
}

async function listIssueTypes({
  host,
  email,
  apiToken,
  project,
}) {
  const client = getJiraClient({ host, email, apiToken });

  if (!project) {
    return client.listIssueTypes();
  }

  const { issueTypes } = await client.getProject(project);
  return issueTypes;
}

async function listUsers({
  host,
  email,
  apiToken,
  group,
}) {
  const client = getJiraClient({ host, email, apiToken });

  const usersResult = await client.getUsersInGroup(group);
  return usersResult?.users?.items;
}

function listStatus({
  host,
  email,
  apiToken,
}) {
  const client = getJiraClient({ host, email, apiToken });

  return client.listStatus();
}

module.exports = {
  listIssues,
  listTransitions,
  listProjects,
  listProjectVersions,
  listAssigneeDetails,
  listIssueTypes,
  listUsers,
  listStatus,
};
