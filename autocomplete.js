const _ = require("lodash");
const { formatDate } = require("./helpers");
const {
  listProjects,
  listStatus,
  listIssues,
  listIssueTypes,
  listTransitions,
  listProjectVersions,
  listUsers,
  listGroups,
} = require("./jira-list-functions");

const DEFAULT_ITEM_MAPPER = ({ name, id }) => ({ value: name, id });

const mapListFunctionToAutocomplete = (listFunction, {
  mapper = DEFAULT_ITEM_MAPPER,
  itemsPath,
} = {}) => (
  async (query, params) => {
    const listResult = await listFunction({ query, ...params });
    const items = itemsPath ? _.get(listResult, itemsPath) : listResult;

    const mappedAutocompleteItems = items.map(mapper);

    return mappedAutocompleteItems.filter(({ value }) => value.toLowerCase().includes(query));
  }
);

async function searchIssues(query, params) {
  let jql = "";

  if (query) {
    const sanitizedQuery = JSON.stringify(query.toLowerCase());
    jql = `summary ~ ${sanitizedQuery}`;
  }
  if (query.match(/^[A-Za-z][A-Za-z0-9-]*-[0-9]+$/g)) {
    jql = `${jql} OR issueKey = ${query.toUpperCase()}`;
  }
  if (params.project) {
    jql = `${jql ? `(${jql}) AND ` : ""}project = ${params.project}`;
  }

  const searchResults = await listIssues({ ...params, overrideJql: jql });
  return searchResults.issues.map(({ key, id }) => ({ value: key, id }));
}

function getDateAutocomplete(query) {
  const queryTime = formatDate(query || Date.now());
  return [{ id: queryTime, value: queryTime }];
}

module.exports = {
  listProjectsAuto: mapListFunctionToAutocomplete(listProjects),
  listStatusAuto: mapListFunctionToAutocomplete(listStatus, {
    mapper: ({ name, id, isGlobal }) => ({
      id,
      value: isGlobal ? `${name} (Global)` : name,
    }),
  }),
  listIssuesAuto: searchIssues,
  listIssueTypesAuto: mapListFunctionToAutocomplete(listIssueTypes),
  listTransitionsAuto: mapListFunctionToAutocomplete(listTransitions, { itemsPath: "transitions" }),
  listVersionsAuto: mapListFunctionToAutocomplete(listProjectVersions),
  listUsersAuto: mapListFunctionToAutocomplete(listUsers),
  listGroups: mapListFunctionToAutocomplete(listGroups, {
    itemsPath: "groups",
    mapper: ({ name }) => ({ value: name, id: name }),
  }),
  getDate: getDateAutocomplete,
};
