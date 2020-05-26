var JiraClient = require("jira-connector");

function connectJira(action, settings) {
  // Initialize
  var jira = new JiraClient({
    host: action.params.HOST || settings.HOST,
    basic_auth: {
      email: action.params.EMAIL || settings.EMAIL,
      api_token: action.params.TOKEN || settings.TOKEN
    },
    strictSSL: true // One of optional parameters
  });
  return jira
}


function searchJira(action, settings) {
  return new Promise((resolve, reject) => {
    const myJql = {
      jql: action.params.JQL
    }

    jira = connectJira(action, settings)
    jira.search.search(myJql, (err, issues) => {
      if (err)
        return reject(err); 
      return resolve(issues)
    }
    );
  })
}

module.exports = {
  searchJira: searchJira
}
