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
  let items = [];
  params.maxResults = MAX_RESULTS;
  // paging
  while (items.length < MAX_RESULTS){
    let result = await listIssues(params, settings);
    const newItems = handleResult(result.issues, query, issue=> `${issue.key} ${issue.fields.summary || ""} ${issue.fields.status.name || ""}`);
    items = items.concat(newItems);
    if (result.startAt + MAX_RESULTS >= result.total) break;
    params.startAt += MAX_RESULTS;
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