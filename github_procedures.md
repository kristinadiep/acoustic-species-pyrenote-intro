## Github Procedures
Before committing any changes to the repo
- Create a branch off of main
- When the changes are finished being made to the branch, create a PR request to merge your work branch into main, *not production*
- Never merge to production directly
- Request reviewers before merging into staging unless given permission by leads
- Address reviewer concerns then merge into staging once everything is cleared

**Reminder: the only branch that is allowed to be merged into main is the staging branch.**  
This ensures that the code can be tested before going onto the production branch

When merging from main to production
- Make a PR request
- Have 2 reviewers *fully* test out the website
- Resolve any errors by creating a new branch off of main. 
- Once reviewers approve, review changes with leads before going ahead
- Note: only approved members can push to production

Main is also a protected branch
- Contains most recent builds of Pyrenote
- PRs to main require 1 reviewer
- Creating working branches off of main, not production

If there is a unrelated bug to your work, create an issue post on the github to be resolved at a later date

**Security Notes**
- Don't post passwords, usernames, or url on the repo as this is a security risk.
- Don't push the file `/audino/.env` to the repo. 
If this happens, no worries. Let the leads know so we can change the password.