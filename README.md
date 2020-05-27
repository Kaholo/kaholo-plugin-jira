# kaholo-plugin-jira
Kaholo Plugin for Jira. This plugin can search for issues using simple JQL language and return all the related issues.

**Settings**

1. Host - the URL for your atlassian (ie. <company>.atlassian.net
2. Email - the user's email for login and retrieve the parameters.
3. Token - you need to create a token for the user (it is not Username Password connection). To learn how to create token read [here](https://confluence.atlassian.com/cloud/api-tokens-938839638.html)

## Method: searchJira

**Description**

Search Jira for all issues according the desiered JQL.

**Parameters**

1. Host - the URL for your atlassian (ie. <company>.atlassian.net
2. Email - the user's email for login and retrieve the parameters.
3. Token - you need to create a token for the user (it is not Username Password connection). To learn how to create token read [here](https://confluence.atlassian.com/cloud/api-tokens-938839638.html)
4. JQL - a string of the query.

