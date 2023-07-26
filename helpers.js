const JiraClient = require("jira-client");

function getJiraClient({
  host,
  email,
  apiToken,
}) {
  const { host: correctedHost, protocol } = resolveHost(host);

  return new JiraClient({
    username: email,
    password: apiToken,
    protocol,
    host: correctedHost,
    apiVersion: "2",
    strictSSL: true,
  });
}

function resolveHost(host) {
  const protocol = host.startsWith("http://") ? "http" : "https";

  let correctedHost = host.replace(/^https?:\/\/|\/$/, "");
  if (!correctedHost.includes(".")) {
    correctedHost = `${correctedHost}.atlassian.net`;
  }
  if (correctedHost.slice(-1) === "/") {
    correctedHost = correctedHost.slice(0, -1);
  }

  return { host: correctedHost, protocol };
}

module.exports = {
  getJiraClient,
  resolveHost,
};
