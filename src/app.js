//var JiraClient = require("jira-connector");
const fetch = require('node-fetch');
var JiraClient = require('jira-client');

function connectJira(action,settings) {
  // Initialize
  const jHost = action.params.HOST || settings.HOST;
  const jEmail = action.params.EMAIL || settings.EMAIL;
  const jApiToken = action.params.TOKEN || settings.TOKEN;

  var jira = new JiraClient({
    host: jHost,
    basic_auth: {
      email: jEmail,
      api_token: jApiToken
    },
    strictSSL: true // One of optional parameters
  });
  return jira
}

function updateIssueStatus(action, settings) {
    let jHost = action.params.HOST || settings.HOST;
    const jIssueKey = action.params.ISSUE_KEY;
    const jStatusID = action.params.STATUS_ID;
    jHost = `${jHost}/rest/api/3/issue/${jIssueKey}/transitions?expand=transitions.fields`;
    let bodyData = `{
      "transition": {
        "id":"${jStatusID}"            
      }
    }`
    return genericRestAPI(action,settings,jHost, bodyData)
}

function searchJira(action, settings) {
  return new Promise((resolve, reject) => {
    const myJql = {
      jql: action.JQL
    }

    jira = connectJira(action,settings)
    jira.search.search(myJql, (err, issues) => {
      if (err)
        return reject(err); 
        console.log(issues)
      return resolve(issues)
    }
    );
  })
}

//////////// HELPERS ////////////

function genericRestAPI(action, settings, host, bodyData) {
    const jEmail = action.params.EMAIL || settings.EMAIL;
    const jApiToken = action.params.TOKEN || settings.TOKEN;

    return fetch(host,  {
      method: 'POST',
      headers: {
      'Authorization': `Basic ${Buffer.from(
        `${jEmail}:${jApiToken}`
       ).toString('base64')}`,
         'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      body: bodyData
    })
}

module.exports = {
  searchJira: searchJira,
  UPDATE_ISSUE_STATUS: updateIssueStatus
}
