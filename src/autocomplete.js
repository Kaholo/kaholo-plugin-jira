const parsers = require("./parsers");
const { listProjects, listIssues, listTransitions, listStatus, listProjectVersions, listIssueTypes, listUsers } = require("./helpers");

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
  const items = (result || []).map(item => {
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
   // let queryTime = new Date().toISOString().split("T")[0];
    let date = new Date();
    queryTime= (((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear());
  
    if (query){
      try {
       // queryTime = new Date(query).toISOString().split("T")[0];
        date = new Date(query);
        queryTime= (((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear());
  
      } catch (err) {}
    }
    return [{id: queryTime, value: queryTime}];
  }
}





// auto complete main methods
function listAuto(listFunc){
  return async (query, pluginSettings, triggerParameters) => {
    const settings = mapAutoParams(pluginSettings), params = mapAutoParams(triggerParameters); 
    try {
      let result = await listFunc(params, settings);
      return handleResult(result, query);
    }
    catch (err) {
      throw `Error during '${listFunc}': ${err.message || JSON.stringify(err)}`
    }
  }
}

async function listIssuesAuto(query, pluginSettings, triggerParameters) {
  const settings = mapAutoParams(pluginSettings), params = mapAutoParams(triggerParameters);
  params.maxResults = MAX_RESULTS;
  const getIssueName = issue => `${issue.key} ${issue.fields.summary} ${issue.fields.status.name}`;
  let items;

  query = parsers.string(query);
  if (query) {
    // try to return results by summary or issueKey and project if specified
    params.overrideJql = `summary ~ "${query}"`;
    if (query.match(/^[A-Za-z][A-Za-z0-9\-]*\-[0-9]+$/g)) {
      params.overrideJql += ` OR issueKey = ${query.toUpperCase()}`;
    }
    if (params.project){
      params.overrideJql = `(${params.overrideJql}) AND project = ${params.project}`;
    }
  }
  try {
    items = (await listIssues(params, settings)).issues;
    // best case scenerio, jira accepted query(if provided) and found results
    if (!query || items.length > 0) return handleResult(items, "", getIssueName); 
  }
  catch (err) {}

  // worst case scenerio, loop and search through all issues on our own with query
  const bufSize = 100;
  params.maxResults = bufSize;
  params.overrideJql = undefined;
  params.startAt = 0;
  // return results once found enough results(Decided by MAX_RESULTS) or looped through all issues
  try {
    while (items.length < MAX_RESULTS){
      const result = await listIssues(params, settings);
      items = items.concat(handleResult(result.issues, query, getIssueName));
      if (result.total < params.startAt + bufSize) break;
      params.startAt += bufSize;
    }
  }
  catch (err) {
    throw `Error with 'listIssues': ${err.message || JSON.stringify(err)}`
  }
  return items;
}


module.exports = {
  listProjectsAuto: listAuto(listProjects),
  listStatusAuto: listAuto(listStatus),
  listIssuesAuto,
  listTransitionsAuto: listAuto(listTransitions),
  listVersionsAuto: listAuto(listProjectVersions),
  listIssueTypesAuto: listAuto(listIssueTypes),
  listUsersAuto: listAuto(listUsers),
  getStartDate: getDate("startDate"),
  getEndDate: getDate("endDate")
}