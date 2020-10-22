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

## Method: Update Issue Status
This method will update the status of the issue

**Parameters**

The following parameters could be provided in the plugin setting.
1. Host - from https://your_atlasian_URL
2. Email - user's email
3. Token (from vault)
  
4. Issue ID
5. Status ID - get the settings ID from: Project Settings -> Workflows -> press on actions.

## Method: Update Version
This method will change the version to released.
1. Host - from https://your_atlasian_URL
2. Email - user's email
3. Token (from vault)
4. Version ID - the version name
5. Project ID Take it from the project URL. get only the project ID from the project setting and copy the URL (your_company.atlassian.net/secure/project/EditProject!default.jspa?pid=**your_ID**)
