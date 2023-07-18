# Kaholo Jira Plugin
This plugin extends Kaholo's capabilities to include interacting with Jira. Jira is a proprietary issue tracking product developed by Atlassian that allows bug tracking and agile project management. This plugin has various methods to create, modify, and list Jira Projects and Issues.

## Plugin Installation
For download, installation, upgrade, downgrade and troubleshooting of plugins in general, see [INSTALL.md](./INSTALL.md).

## Plugin Accounts
Kaholo plugin accounts are groupings of parameters commonly used for authentication purposes. When the plugin is first installed a plugin account must be created before the plugin can be used. This is can be done when a Jira action is added to a Kaholo pipeline, using the "Add New Plugin Account" feature in the drop-down of parameter "Account", which appears immediately after a plugin method is selected. Accounts can also be managed by using Settings | Plugins and then clicking on the name of the plugin "Jira" in the list of plugins. The name will appear in blue and is a hypelink to the Jira plugin's settings and Accounts. The Jira plugin has no Settings so the Settings tab is left inactive - only the Accounts tab is active.

A Kaholo Account for Jira consists of three parameters that are made available to all methods using the account.
* Jira Server URL - the URL at which Jira is accessible using the web console,
* Email - the email address that identifies a valid Jira user at that URL, and
* API Token - a Jira-provided token that enables a user to access Jira programmatically using the Jira API.

To view or manage Jira API tokens, use the [Atlassian Account API Token Management page](https://id.atlassian.com/manage-profile/security/api-tokens). A new API token can be copied only when it is first created. The token must be stored in the Kaholo Vault. The vault item can be created at Settings | Vault, or by using the "Add New Vault Item" feature in the "API Token" drop-down while creating the plugin account. The Kaholo Vault protects the token as a secret so it does not appear in the UI, logs, or error messages.

While creating the account, you may wish to select "Set as default account". This will cause the account to be automatically selected anytime a new Jira action is created, as a convenience. If there are multiple accounts configured, which account to use can also be configured individually at the Action level using the "Account" drop-down menu.

## Method: List Issues
This method lists Jira Issues - for example tasks or bugs. No parameters are required, but some are provided to easily filter the list of issues based on project, status, or creation date. For complex filtering a JQL query may be provided. Which fields to return is also customizable as well as how many results to return for a single query.

### Parameter: Project
The Jira project name. Select a project using the autocomplete drop-down to retrieve issues for a single project. Leave empty to query all projects. To query more than one project but not all, write the query in JQL and use parameter "Override JQL".

### Parameter: Status
The Jira issue status - for example "In Progress" or "Done (Global)". Status are stored in Jira as integer values so a standard Jira status that is globally available and a custom status for a specific project may have identical names. To distinguish among them "(Global)" is added to global statuses.

### Parameter: Created Since Date
An arbitrary date of format YYYY-MM-DD. If configured only issues created on or after the specified date will be retrieved.

### Parameter: Created By Date
An arbitrary date of format YYYY-MM-DD. If configured only issues created on or before the specified date will be retrieved.

### Parameter: Override JQL
For complex queries, one may ignore the other parameter and provide the query in [Jira Query Language](https://support.atlassian.com/jira-service-management-cloud/docs/use-advanced-search-with-jira-query-language-jql/) format.

### Parameter: Fields
A list of fields to return, one field per line or if using the code layer as an array of strings. If not specified, the plugin will return the following fields by default:

    ["created", "description", "summary", "status", "priority"]

### Parameter: Max Results
By default up to the first 50 results will be returned. Adjust this number if necessary to get up to 1000.

### Parameter: Results Offset
In the case where >1000 issues may be retrieved, it may be necessary to use this offset to get issues beyond the first 1000. For example if there are 2750 issues and Max Results = 1000, then this offset will need to be 1000 to get page 2, and 2000 to get the remaining 750 issues.

## Method: Create Issue
This method creates a new Issue, for example a bug or task, in a Jira project.

### Parameter: Project
The Jira project name. Select a project using the autocomplete drop-down.

### Parameter: Issue Type
The type of Jira issue to create. For example, bug, task, epic, or story.

### Parameter: Summary
The Jira summary for the new issue. This appears as a Title or Headline for the issue.

### Parameter: Description
The Jira description, typically a longer more detailed description of the issue.

## Method: List Transitions
This method provides a full list of the configured transitions for a specific issue. The list is determined by the project configuration. This method is often used after method "Create Issue" and before method "Transition Issue Status".

### Parameter: Issue
Provide an issue id in order to retrieve the list of transitions that may be applied to that issue.

## Method: Transition Issue Status
This method changes the status of an issue, for example from "Backlog" to "In Progress".

### Parameter: Project
The project of the issue to to be transitioned.

### Parameter: Issue
The issue to be transitioned.

### Parameter: Transition
The name of the transition to apply. The autocomplete provides a list of possible transitions based on the issue selected.

## Method: Add Comment To Issue
This method adds a comment to an issue.

### Parameter: Issue
Select the issue to which a comment should be added.

### Parameter: Comment
The comment to add.

## Method: List Projects
This method lists all Jira projects visible to the user/owner of the API token. No additional parameters are required.

## Method: List Project Versions
This method lists all versions of a project, if any exist.

### Parameter: Project
Select a project using the autocomplete drop-down. The versions of this project will be listed by the method.

## Method: Create Project Version
This method creates a new version of a project - for example "Version 2.0".

### Parameter: Project
Select the project in which a new version will be created, using the autocomplete drop-down.

### Parameter: Version Name
A name for the new version, for example "Version 2.0".

### Parameter: Description
A description of the new version.

### Parameter: Start Date
A start date for the version, typically the date anticipated that work will begin on the new version.

### Parameter: Release Date
A release date for the version, typically the date of anticipated release of the finished version.

### Parameter: Archived
Enable this to create a new version that is already archived, hiding it from reports and other types of visibility in the project.

## Method: Update Project Version
This method updates an existing project version, to modify one or more of its various attributes. To NOT update any attribute, leave it empty/unconfigured.

### Parameter: Project
The project of the version to be updated. Select a project using the autocomplete drop-down menu.

### Parameter: Version
The specific version to be update, select from the autocomplete list of versions in the project. If none are listed it is possible none exist.

### Parameter: Description
A new description for the version, if the description is to be updated.

### Parameter: Start Date
A new start date for the version, if the start date is to be updated.

### Parameter: Release Date
A new release date for the version, if the release date is to be updated.

### Parameter: Move Unfixed Issues URL
The "self" URL of another version, for example that provided by method "List Project Versions" for the purpose of automatic movement of unresolved issues from this version upon release. This is used in conjunction with the next parameter, "Released".

### Parameter: Released
Enable to transition the status of the version to "Released".

### Parameter: Archived
Enable to archive the version, removing it from reports and other visibility in the project.

## Method: Get Assignee Details
This method retrieves a list of issues assigned to a specific assignee.

### Parameter: Group Name
Select using the autocomplete the Jira user group to which the assignee belongs.

### Parameter: User
Select using the autocomplete the assignee's username.

### Parameter: Created Since Date
An arbitrary date of format YYYY-MM-DD. If configured only issues created on or after the specified date will be retrieved.

### Parameter: Created By Date
An arbitrary date of format YYYY-MM-DD. If configured only issues created on or before the specified date will be retrieved.

### Parameter: Fields
A list of fields to return, one field per line or if using the code layer as an array of strings. If not specified, the plugin will return the following fields by default:

    ["created", "description", "summary", "status", "priority"]

### Parameter: Max Results
By default up to the first 50 results will be returned. Adjust this number if necessary to get up to 1000.

### Parameter: Results Offset
In the case where >1000 issues may be retrieved, it may be necessary to use this offset to get issues beyond the first 1000. For example if there are 2750 issues and Max Results = 1000, then this offset will need to be 1000 to get page 2, and 2000 to get the remaining 750 issues.
