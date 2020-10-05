const fetch = require('node-fetch');

function updateIssueStatus(action, settings) {
    /**
     * Change the status of an issue.
     */
    let jHost = action.params.HOST || settings.HOST;
    const jIssueKey = action.params.ISSUE_KEY;
    const jStatusID = action.params.STATUS_ID;
    const method = "POST"
    jHost = `${jHost}/rest/api/3/issue/${jIssueKey}/transitions?expand=transitions.fields`;
    let bodyData = `{
      "transition": {
        "id":"${jStatusID}"            
      }
    }`
    return genericRestAPI(action,settings,method, jHost, bodyData)
}

async function updateVersion (action, settings) {
  /**
   * Set status of version to released inside a given project.
   */
  const host= action.params.HOST || settings.HOST;
  const projectId = action.params.PROJECT_ID;
  const versionId = await getVersionId(action, settings, action.params.VERSION, projectId,host);
  const jHost = `${host}/rest/api/3/version/${versionId}`
  const intProjectId = parseInt(projectId);
  const method = "PUT"
  let bodyData = `{
    "description": "closed by Kaholo automation",
    "projectId":${intProjectId},
    "released": true
  }`
  return await genericRestAPI(action,settings,method,jHost,bodyData)
}

async function searchJira(action, settings) {
  /**
   * Search Jira with a given JQL
   */
  const method = 'POST';
  const host= action.params.HOST || settings.HOST;
  const jHost = `${host}/rest/api/3/search`;
  const jql = action.params.JQL;
  let bodyData = `{
    "jql":"${jql}"            
  }`
  return await genericRestAPI(action,settings, method, jHost, bodyData)
}

//////////// HELPERS ////////////

async function genericRestAPI(action, settings, method, host, bodyData) {
/**
 * Send Default API Request
 */
    const jEmail = action.params.EMAIL || settings.EMAIL;
    const jApiToken = action.params.TOKEN || settings.TOKEN;

    const response = await fetch(host,  {
      method: `${method}`,
      headers: {
      'Authorization': `Basic ${Buffer.from(
        `${jEmail}:${jApiToken}`
       ).toString('base64')}`,
         'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      body: bodyData
    })
    return response.text();
}

async function getVersionId(action, settings, versionName, projectId, host) {
  /**
   * Input: 
   * 1) Version name
   * 2) Project ID
   * 3) URL
   * 
   * return:
   *   version ID
   */
  const method = "GET";
  host = `${host}/rest/api/3/project/${projectId}/versions`;
  let versions = await genericRestAPI(action,settings,method,host)
  let versionArr = JSON.parse(versions)
  for (i = 0; i < versionArr.length ; i++){ 
    if (versionArr[i].name == versionName) {
      return versionArr[i].id ;
    }
  }
  throw "version not found"
}

module.exports = {
  searchJira: searchJira,
  UPDATE_ISSUE_STATUS: updateIssueStatus,
  UPDATE_VERSION: updateVersion
}
