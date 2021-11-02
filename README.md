# kaholo-plugin-jira
Kaholo plugin for integration with Jira API.

## Settings
1. Jira Server URL (String) **Optional** - The URL for your default Jira server. Supports either http or https. **In case the URL is in format of https://\<Host-Name\>.atlassian.net, it's enough to enter the host name.**
2. Email (String) **Optional** - The email of the default user to use for authentication.
3. API Token (Vault) **Optional** - The API token of the default user to use for authentication.

* **Please Notice** You have to provide all the above credntials either from the settings or for each method from it's parameters.

## Method: List Issues
List all issues that match the specified filters.

### Parameters
1. Jira Server URL (String) **Optional** - The URL for your Jira server. Supports either http or https. 
2. Email (String) **Optional** - The email of the user to use for authentication.
3. API Token (Vault) **Optional** - The API token of the user to use for authentication.
4. Project (Autocomplete) **Optional** - If specified, list issues only inside the specified project.
5. Status (Autocomplete) **Optional** - If specified, list issues only with the specified status.
6. Created After Date (Autocomplete) **Optional** - If specified, only list issues created after the specified date.
7. Created Before Date (Autocomplete) **Optional** - If specified, only list issues created before the specified date.
8. Override JQL (String) **Optional** - If specified, search issues according to the specified JQL(Jira Query Language) **instead of the values provided in parameters 4-7.**
9. Fields (Text) **Optional** - If specified return only the specified fields. Can enter multiple values by seperating each with a new line, or as an array from code. Can enter **\*** to get all fields. Default fields returned are: created, description, summary, status, priority.
10. Max Results (String) **Optional** - Maximum number of results to return. Defualt value is 50. Maximum value is 100. If provided value bigger than 100, will still return only 100 results.
11. Results Offset (String) **Optional** -  If specified, return results from the specified offset index. Relevant mainly for paging. Default value is

## Method: Transition Issue Status
Transition the specified issue with the specified transition. Usually transitions match status names, and are made to change issue status.

### Parameters
1. Jira Server URL (String) **Optional** - The URL for your Jira server. Supports either http or https. 
2. Email (String) **Optional** - The email of the user to use for authentication.
3. API Token (Vault) **Optional** - The API token of the user to use for authentication.
4. Project (Autocomplete) **Optional** - If specified, see only issues from the specified project when selecting an issue from autocomplete in the next parameter.
5. Issue (Autocomplete) **Required** - The issue to make the transition on.
6. Transition (Autocomplete) **Required** - The transition to do on the issue. Usually matches status names.

## Method: Create Project Version
Create a new project version.

### Parameters
1. Jira Server URL (String) **Optional** - The URL for your Jira server. Supports either http or https. 
2. Email (String) **Optional** - The email of the user to use for authentication.
3. API Token (Vault) **Optional** - The API token of the user to use for authentication.
4. Project (Autocomplete) **Required** - The project to create the version of.
5. Version Name (String) **Required** - The name of the new version.
6. Description (Text) **Optional** - The description of the new version.
7. Start Date (Autocomplete) **Optional** - The start date of the new version.
8. Release Date (Autocomplete) **Optional** - The release date of the version.
9. Archived (Boolean) **Optional** - Indicates that the version is archived. 

## Method: Update Project Version
Update Project Version

### Parameters
1. Jira Server URL (String) **Optional** - The URL for your Jira server. Supports either http or https. 
2. Email (String) **Optional** - The email of the user to use for authentication.
3. API Token (Vault) **Optional** - The API token of the user to use for authentication.
4. Project (Autocomplete) **Required** - The project to update it's version.
5. Version (Autocomplete) **Required** - The version to update.
6. Description (Text) **Optional** - If specified update the description of the version with the specified value.
7. Start Date (Autocomplete) **Optional** - The start date of the new version. If specified update the start date of the version with the specified value.
8. Release Date (Autocomplete) **Optional** - The release date of the version. If specified update the release date of the version with the specified value.
9. Move Unfixed Issues URL (String) **Optional** - The URL of the self link to the version to which all unfixed issues are moved when a version is released. 
10. Released (Boolean) **Optional** - If specified, release the specified version.
11. Archived (Boolean) **Optional** - If specified, archive the specified version.

## Method: Create Issue
Create a new issue inside the specified project.

### Parameters
1. Jira Server URL (String) **Optional** - The URL for your Jira server. Supports either http or https. 
2. Email (String) **Optional** - The email of the user to use for authentication.
3. API Token (Vault) **Optional** - The API token of the user to use for authentication.
4. Project (Autocomplete) **Required** - The project to create the issue in.
5. Issue Type (Autocomplete) **Required** - The type of issue to create.
6. Summary (Text) **Required** - The title/summary of the new issue.
7. Description (Text) **Optional** - The description of the new issue.

## Method: Add Comment To Issue
Add a new comment to an issue.

### Parameters
1. Jira Server URL (String) **Optional** - The URL for your Jira server. Supports either http or https. 
2. Email (String) **Optional** - The email of the user to use for authentication.
3. API Token (Vault) **Optional** - The API token of the user to use for authentication.
4. Project (Autocomplete) **Optional** - The project of the issue.
5. Issue (Autocomplete) **Required** - The issue to add the comment to.
6. Comment (Text) **Required** - The comment to add to the issue.

## Method: List Transitions
List all transitions for the specified issue.

### Parameters
1. Jira Server URL (String) **Optional** - The URL for your Jira server. Supports either http or https. 
2. Email (String) **Optional** - The email of the user to use for authentication.
3. API Token (Vault) **Optional** - The API token of the user to use for authentication.
4. Project (Autocomplete) **Required** - The project of the issue.
5. Issue (Autocomplete) **Required** - The issue to list it's transitions.

## Method: List Projects
List all projects in your account.

### Parameters
1. Jira Server URL (String) **Optional** - The URL for your Jira server. Supports either http or https. 
2. Email (String) **Optional** - The email of the user to use for authentication.
3. API Token (Vault) **Optional** - The API token of the user to use for authentication.

## Method: List Project Versions
List all verions of the specified project.

### Parameters
1. Jira Server URL (String) **Optional** - The URL for your Jira server. Supports either http or https. 
2. Email (String) **Optional** - The email of the user to use for authentication.
3. API Token (Vault) **Optional** - The API token of the user to use for authentication.
4. Project (Autocomplete) **Required** - The project to list it's versions.
