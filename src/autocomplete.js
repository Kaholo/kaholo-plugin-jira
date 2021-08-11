const parsers = require("./parsers");
const { listProjects, listIssues, listTransitions, listStatus, listProjectVersions } = require("./helpers");

// auto complete helper methods

const MAX_RESULTS = 10;

function mapAutoParams(autoParams){
  const params = {};
  autoParams.forEach(param => {
    params[param.name] = parsers.autocomplete(param.value);
  });
  return params;
}

/***
 * @returns {[{id, value}]} filtered result items
 ***/
function handleResult(result, query, getName){
  const items = result.map(item => {
    if (item.id && typeof(item.id) === "number") item.id = item.id.toString();
    const val = getName ? getName(item) :
                item.name ? item.name :
                item.displayName ? item.displayName : item.id;
    return {
      id:     item.id || val, 
      value:  val
    };
  });
  return filterItems(items, query);
}

function filterItems(items, query){
  if (query){
    const qWords = query.split(/[. ]/g).map(word => word.toLowerCase()); // split by '.' or ' ' and make lower case
    items = items.filter(item => qWords.every(word => item.value.toLowerCase().includes(word)));
    items = items.sort((word1, word2) => word1.value.toLowerCase().indexOf(qWords[0]) - word2.value.toLowerCase().indexOf(qWords[0]));
  }
  return items.splice(0, MAX_RESULTS);
}

function getDate(paramName){
  return async (query, pluginSettings, pluginActionParams) => {
    const params = mapAutoParams(pluginActionParams);
    query = query || params[paramName];
    let queryTime = new Date().toISOString().split("T")[0];
    if (query){
      try {
        queryTime = new Date(query).toISOString().split("T")[0];
      } catch (err) {}
    }
    return [{id: queryTime, value: queryTime}];
  }
}

// auto complete main methods
function listAuto(listFunc){
  return async (query, pluginSettings, triggerParameters) => {
    const settings = mapAutoParams(pluginSettings), params = mapAutoParams(triggerParameters); 
    let result = await listFunc(params, settings);
    return handleResult(result, query);
  }
}

async function listIssuesAuto(query, pluginSettings, triggerParameters) {
  const settings = mapAutoParams(pluginSettings), params = mapAutoParams(triggerParameters);
  params.maxResults = MAX_RESULTS;
  const getIssueName = issue => `${issue.key} ${issue.fields.summary} ${issue.fields.status.name}`;
  let items;

  query = query.trim();
  if (!query) {
    items = (await listIssues(params, settings)).issues;
    return handleResult(items, "", getIssueName); 
  }
  if (query.match(/^[A-Za-z][A-Za-z0-9\-]*\-[0-9]+$/g)) {
    try {
      params.overrideJql = `issueKey = ${query.toUpperCase()}`;
      items = (await listIssues(params, settings)).issues;
      if (items.length > 0) return handleResult(items, "", getIssueName); 
    }
    catch (err){}
  }
  params.overrideJql = `summary ~ "${query}"${params.project ? ` AND project = ${params.project}` : ""}`;  
  items = (await listIssues(params, settings)).issues;
  // use paging to search
  if (items.length > 0) return handleResult(items, "", getIssueName); 

  // worst case scenerio, loop and search through all issues
  const bufSize = 100;
  params.maxResults = bufSize;
  params.overrideJql = undefined;
  params.startAt = 0;
  while (items.length < MAX_RESULTS){
    const result = await listIssues(params, settings);
    items = items.concat(handleResult(result.issues, query, getIssueName));
    if (result.total < params.startAt + bufSize) break;
    params.startAt += bufSize;
  }
  return items;
}

module.exports = {
  listProjectsAuto: listAuto(listProjects),
  listStatusAuto: listAuto(listStatus),
  listIssuesAuto,
  listTransitionsAuto: listAuto(listTransitions),
  listVersionsAuto: listAuto(listProjectVersions),
  getStartDate: getDate("startDate"),
  getEndDate: getDate("endDate")
}