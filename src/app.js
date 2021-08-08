const helpers = require("./helpers");
const {getClient, stripAction} = helpers; 
const parsers = require("./parsers");

async function transitionIssue(action, settings) {
  const client = getClient(action.params, settings);
  const issueId = parsers.autocomplete(action.params.issue);
  const transitionId = parsers.autocomplete(action.params.transition);
  if (!issueId || !transitionId) {
    throw "Didn't provide one of the required fields.";
  }
  await client.transitionIssue(issueId, {transition: {"id": transitionId}});
  return "Success";
}

async function createProjectVersion(action, settings) {
  const client = getClient(action.params, settings);
  const projectId = parsers.autocomplete(action.params.project);
  const startDate = parsers.autocomplete(action.params.startDate);
  const releaseDate = parsers.autocomplete(action.params.endDate);
  const {versionName: name, description, moveUrl, released, archived} = action.params;
  return client.createVersion({
    description, name, 
    released, archived,
    startDate, releaseDate,
    projectId,
    moveUnfixedIssuesTo: moveUrl
  });
}

async function updateProjectVersion(action, settings) {
  const client = getClient(action.params, settings);
  const projectId = parsers.autocomplete(action.params.project);
  const versionId = parsers.autocomplete(action.params.version);
  const startDate = parsers.autocomplete(action.params.startDate);
  const releaseDate = parsers.autocomplete(action.params.endDate);
  const {description, moveUrl, released, archived} = action.params;
  return client.updateVersion({
    id: versionId,
    description, projectId,
    released, archived,
    startDate, releaseDate,
    moveUnfixedIssuesTo: moveUrl
  });
}

module.exports = {
  transitionIssue,
  createProjectVersion,
  updateProjectVersion,
  listIssues: stripAction(helpers.listIssues),
  listTransitions: stripAction(helpers.listTransitions),
  listProjects: stripAction(helpers.listProjects),
  listProjectVersions: stripAction(helpers.listProjectVersions),
  ...require("./autocomplete")
}
