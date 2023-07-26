const _ = require("lodash");
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

    if (!query) {
      return mappedAutocompleteItems;
    }

    const lowerCaseQuery = query.toLowerCase();
    return mappedAutocompleteItems.filter(({ value, id }) => (
      value.toLowerCase().includes(lowerCaseQuery)
      || id.toLowerCase().includes(lowerCaseQuery)
    ));
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
  listUsersAuto: mapListFunctionToAutocomplete(listUsers, {
    mapper: ({ displayName, accountId }) => ({ value: displayName, id: accountId }),
  }),
  listGroups: mapListFunctionToAutocomplete(listGroups, {
    itemsPath: "groups",
    mapper: ({ name }) => ({ value: name, id: name }),
  }),
};
