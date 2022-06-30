const JiraClient = require("jira-client");

function getJiraClient({
  host,
  email,
  apiToken,
}) {
  const protocol = host.startsWith("http://") ? "http" : "https";

  let correctedHost = host.replace(/^https?:\/\/|\/$/, "");
  if (!correctedHost.includes(".")) {
    correctedHost = `${correctedHost}.atlassian.net`;
  }

  return new JiraClient({
    username: email,
    password: apiToken,
    protocol,
    host: correctedHost,
    apiVersion: "2",
    strictSSL: true,
  });
}

module.exports = {
  getJiraClient,
};
