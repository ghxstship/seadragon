-- Enrich integration schemas for comprehensive project lifecycle management
-- Add new integration provider categories and specific integration tables

-- Insert new integration providers for comprehensive project lifecycle management and business operations (Top 10+ per category where applicable)
INSERT INTO integration_providers (name, provider_type, description, website_url, api_docs_url, supported_features, configuration_schema) VALUES
-- Project Management (Top 10)
('Jira', 'project_management', 'Advanced project management and issue tracking', 'https://www.atlassian.com/software/jira', 'https://developer.atlassian.com/cloud/jira/platform/rest/v3/', '["issues", "projects", "sprints", "boards", "reports", "workflows", "automation"]', '{"type": "object", "properties": {"api_token": {"type": "string"}, "domain": {"type": "string"}, "username": {"type": "string"}}}'),
('Trello', 'project_management', 'Kanban-style project management', 'https://trello.com', 'https://developer.atlassian.com/cloud/trello/rest/', '["boards", "cards", "lists", "checklists", "automation"]', '{"type": "object", "properties": {"api_key": {"type": "string"}, "token": {"type": "string"}}}'),
('Asana', 'project_management', 'Work management platform', 'https://asana.com', 'https://developers.asana.com/docs', '["tasks", "projects", "teams", "workspaces", "timelines", "forms"]', '{"type": "object", "properties": {"access_token": {"type": "string"}}}'),
('Monday.com', 'project_management', 'Work OS for teams', 'https://monday.com', 'https://developer.monday.com/api-reference/docs', '["boards", "groups", "items", "automations", "dashboards"]', '{"type": "object", "properties": {"api_token": {"type": "string"}}}'),
('Basecamp', 'project_management', 'Project management and team communication', 'https://basecamp.com', 'https://github.com/basecamp/api', '["projects", "todos", "messages", "files", "schedules"]', '{"type": "object", "properties": {"access_token": {"type": "string"}}}'),
('ClickUp', 'project_management', 'All-in-one project management platform', 'https://clickup.com', 'https://clickup.com/api', '["tasks", "lists", "spaces", "views", "automation"]', '{"type": "object", "properties": {"access_token": {"type": "string"}}}'),
('Linear', 'project_management', 'Issue tracking for software teams', 'https://linear.app', 'https://developers.linear.app/docs/graphql', '["issues", "projects", "cycles", "teams", "workflows"]', '{"type": "object", "properties": {"api_key": {"type": "string"}}}'),
('Notion', 'project_management', 'All-in-one workspace for notes and projects', 'https://notion.so', 'https://developers.notion.com/', '["pages", "databases", "blocks", "users", "comments"]', '{"type": "object", "properties": {"integration_token": {"type": "string"}}}'),
('Microsoft Project', 'project_management', 'Project management software', 'https://www.microsoft.com/en-us/microsoft-365/project', 'https://docs.microsoft.com/en-us/project/', '["projects", "tasks", "resources", "reports", "gantt"]', '{"type": "object", "properties": {"client_id": {"type": "string"}, "client_secret": {"type": "string"}, "tenant_id": {"type": "string"}}}'),
('Teamwork', 'project_management', 'Project management and team collaboration', 'https://www.teamwork.com', 'https://developer.teamwork.com/', '["projects", "tasks", "time", "files", "milestones"]', '{"type": "object", "properties": {"api_key": {"type": "string"}}}'),

-- Version Control (Top 10)
('GitHub', 'version_control', 'Code hosting and collaboration platform', 'https://github.com', 'https://docs.github.com/en/rest', '["repositories", "pull_requests", "issues", "webhooks", "actions", "packages"]', '{"type": "object", "properties": {"access_token": {"type": "string"}, "webhook_secret": {"type": "string"}}}'),
('GitLab', 'version_control', 'DevOps platform for software development', 'https://gitlab.com', 'https://docs.gitlab.com/ee/api/', '["projects", "merge_requests", "issues", "pipelines", "webhooks", "packages"]', '{"type": "object", "properties": {"access_token": {"type": "string"}, "webhook_secret": {"type": "string"}}}'),
('Bitbucket', 'version_control', 'Git code management for teams', 'https://bitbucket.org', 'https://developer.atlassian.com/bitbucket/api/2/reference/', '["repositories", "pull_requests", "issues", "pipelines", "webhooks"]', '{"type": "object", "properties": {"username": {"type": "string"}, "app_password": {"type": "string"}}}'),
('Azure DevOps', 'version_control', 'DevOps services for teams', 'https://azure.microsoft.com/en-us/services/devops/', 'https://docs.microsoft.com/en-us/rest/api/azure/devops/', '["repositories", "pipelines", "boards", "test", "artifacts"]', '{"type": "object", "properties": {"personal_access_token": {"type": "string"}, "organization": {"type": "string"}}}'),
('AWS CodeCommit', 'version_control', 'Managed source control service', 'https://aws.amazon.com/codecommit/', 'https://docs.aws.amazon.com/codecommit/latest/APIReference/', '["repositories", "branches", "pull_requests", "webhooks"]', '{"type": "object", "properties": {"access_key_id": {"type": "string"}, "secret_access_key": {"type": "string"}, "region": {"type": "string"}}}'),
('Perforce Helix Core', 'version_control', 'Version control system', 'https://www.perforce.com/products/helix-core', 'https://www.perforce.com/manuals/cmdref/', '["repositories", "streams", "shelving", "jobs", "webhooks"]', '{"type": "object", "properties": {"server": {"type": "string"}, "user": {"type": "string"}, "password": {"type": "string"}}}'),
('Subversion (SVN)', 'version_control', 'Centralized version control system', 'https://subversion.apache.org', 'https://svnbook.red-bean.com/', '["repositories", "branches", "tags", "hooks", "webhooks"]', '{"type": "object", "properties": {"url": {"type": "string"}, "username": {"type": "string"}, "password": {"type": "string"}}}'),
('Mercurial', 'version_control', 'Distributed version control system', 'https://www.mercurial-scm.org', 'https://www.mercurial-scm.org/wiki/MercurialApi', '["repositories", "branches", "bookmarks", "hooks", "webhooks"]', '{"type": "object", "properties": {"url": {"type": "string"}, "username": {"type": "string"}, "password": {"type": "string"}}}'),
('Plastic SCM', 'version_control', 'Distributed version control system', 'https://www.plasticscm.com', 'https://www.plasticscm.com/documentation/rest-api', '["repositories", "branches", "merges", "attributes", "webhooks"]', '{"type": "object", "properties": {"server": {"type": "string"}, "user": {"type": "string"}, "token": {"type": "string"}}}'),
('RhodeCode', 'version_control', 'Source code management platform', 'https://rhodecode.com', 'https://docs.rhodecode.com/', '["repositories", "pull_requests", "issues", "webhooks", "permissions"]', '{"type": "object", "properties": {"url": {"type": "string"}, "api_key": {"type": "string"}}}'),

-- CI/CD (Top 10)
('GitHub Actions', 'ci_cd', 'CI/CD platform integrated with GitHub', 'https://github.com/features/actions', 'https://docs.github.com/en/actions', '["workflows", "runs", "artifacts", "environments", "secrets"]', '{"type": "object", "properties": {"access_token": {"type": "string"}}}'),
('Jenkins', 'ci_cd', 'Open source automation server', 'https://www.jenkins.io', 'https://www.jenkins.io/doc/book/using/rest-api/', '["jobs", "builds", "pipelines", "artifacts", "plugins"]', '{"type": "object", "properties": {"url": {"type": "string"}, "username": {"type": "string"}, "api_token": {"type": "string"}}}'),
('CircleCI', 'ci_cd', 'Continuous integration and delivery platform', 'https://circleci.com', 'https://circleci.com/docs/api/v2/', '["pipelines", "workflows", "jobs", "artifacts", "contexts"]', '{"type": "object", "properties": {"api_token": {"type": "string"}}}'),
('Travis CI', 'ci_cd', 'Continuous integration service', 'https://travis-ci.com', 'https://docs.travis-ci.com/api/', '["builds", "jobs", "repositories", "webhooks", "environments"]', '{"type": "object", "properties": {"api_token": {"type": "string"}}}'),
('GitLab CI', 'ci_cd', 'Integrated CI/CD with GitLab', 'https://docs.gitlab.com/ee/ci/', 'https://docs.gitlab.com/ee/api/', '["pipelines", "jobs", "environments", "artifacts", "deployments"]', '{"type": "object", "properties": {"access_token": {"type": "string"}}}'),
('Azure Pipelines', 'ci_cd', 'CI/CD pipelines in Azure DevOps', 'https://azure.microsoft.com/en-us/services/devops/pipelines/', 'https://docs.microsoft.com/en-us/rest/api/azure/devops/', '["pipelines", "runs", "artifacts", "environments", "approvals"]', '{"type": "object", "properties": {"personal_access_token": {"type": "string"}, "organization": {"type": "string"}}}'),
('AWS CodePipeline', 'ci_cd', 'Continuous delivery service', 'https://aws.amazon.com/codepipeline/', 'https://docs.aws.amazon.com/codepipeline/latest/APIReference/', '["pipelines", "stages", "actions", "artifacts", "webhooks"]', '{"type": "object", "properties": {"access_key_id": {"type": "string"}, "secret_access_key": {"type": "string"}, "region": {"type": "string"}}}'),
('Bitbucket Pipelines', 'ci_cd', 'CI/CD for Bitbucket', 'https://bitbucket.org/product/features/pipelines', 'https://developer.atlassian.com/bitbucket/api/2/reference/', '["pipelines", "deployments", "environments", "artifacts", "webhooks"]', '{"type": "object", "properties": {"username": {"type": "string"}, "app_password": {"type": "string"}}}'),
('Drone', 'ci_cd', 'Container-native CI/CD platform', 'https://drone.io', 'https://docs.drone.io/api/', '["pipelines", "repositories", "builds", "secrets", "webhooks"]', '{"type": "object", "properties": {"server": {"type": "string"}, "token": {"type": "string"}}}'),
('Buildkite', 'ci_cd', 'CI/CD platform for teams', 'https://buildkite.com', 'https://buildkite.com/docs/apis/rest-api', '["pipelines", "builds", "agents", "artifacts", "webhooks"]', '{"type": "object", "properties": {"api_token": {"type": "string"}}}'),

-- Documentation (Top 10)
('Confluence', 'documentation', 'Team collaboration and documentation platform', 'https://www.atlassian.com/software/confluence', 'https://developer.atlassian.com/cloud/confluence/rest/v2/', '["pages", "spaces", "blogs", "comments", "templates"]', '{"type": "object", "properties": {"api_token": {"type": "string"}, "domain": {"type": "string"}, "username": {"type": "string"}}}'),
('Notion', 'documentation', 'All-in-one workspace for notes, docs, and projects', 'https://www.notion.so', 'https://developers.notion.com/', '["pages", "databases", "blocks", "users", "comments"]', '{"type": "object", "properties": {"integration_token": {"type": "string"}}}'),
('GitBook', 'documentation', 'Documentation platform for teams', 'https://www.gitbook.com', 'https://developer.gitbook.com/', '["spaces", "pages", "content", "assets", "webhooks"]', '{"type": "object", "properties": {"api_token": {"type": "string"}}}'),
('ReadMe', 'documentation', 'API documentation platform', 'https://readme.com', 'https://docs.readme.com/reference', '["docs", "guides", "api_reference", "changelogs", "discussions"]', '{"type": "object", "properties": {"api_key": {"type": "string"}, "project_id": {"type": "string"}}}'),
('GitHub Wiki', 'documentation', 'Wiki pages in GitHub repositories', 'https://docs.github.com/en/communities/documenting-your-project-with-wikis', 'https://docs.github.com/en/rest', '["pages", "content", "history", "webhooks"]', '{"type": "object", "properties": {"access_token": {"type": "string"}}}'),
('Slab', 'documentation', 'Knowledge base and documentation platform', 'https://slab.com', 'https://slab.com/api/docs/', '["posts", "topics", "comments", "users", "search"]', '{"type": "object", "properties": {"api_key": {"type": "string"}}}'),
('Nuclino', 'documentation', 'Real-time collaborative knowledge base', 'https://www.nuclino.com', 'https://docs.nuclino.com/api/', '["items", "teams", "workspaces", "comments", "webhooks"]', '{"type": "object", "properties": {"api_key": {"type": "string"}}}'),
('Dropbox Paper', 'documentation', 'Collaborative document editing', 'https://www.dropbox.com/paper', 'https://www.dropbox.com/developers/documentation', '["docs", "folders", "comments", "users", "sharing"]', '{"type": "object", "properties": {"access_token": {"type": "string"}, "refresh_token": {"type": "string"}}}'),
('Google Docs', 'documentation', 'Online word processor', 'https://docs.google.com', 'https://developers.google.com/docs/api', '["documents", "comments", "suggestions", "revisions", "sharing"]', '{"type": "object", "properties": {"client_id": {"type": "string"}, "client_secret": {"type": "string"}, "refresh_token": {"type": "string"}}}'),
('OneNote', 'documentation', 'Digital note-taking app', 'https://www.onenote.com', 'https://docs.microsoft.com/en-us/graph/api/resources/onenote', '["notebooks", "sections", "pages", "content", "sharing"]', '{"type": "object", "properties": {"client_id": {"type": "string"}, "client_secret": {"type": "string"}, "refresh_token": {"type": "string"}}}'),

-- Time Tracking (Top 10)
('Harvest', 'time_tracking', 'Time tracking and invoicing software', 'https://www.getharvest.com', 'https://help.getharvest.com/api-v2/', '["time_entries", "projects", "tasks", "clients", "invoices"]', '{"type": "object", "properties": {"account_id": {"type": "string"}, "access_token": {"type": "string"}}}'),
('Toggl', 'time_tracking', 'Time tracking tool for teams', 'https://toggl.com', 'https://developers.track.toggl.com/docs/', '["time_entries", "projects", "clients", "workspaces", "reports"]', '{"type": "object", "properties": {"api_token": {"type": "string"}}}'),
('Clockify', 'time_tracking', 'Time tracking software', 'https://clockify.me', 'https://clockify.github.io/clockify_api_docs/', '["time_entries", "projects", "tasks", "users", "reports"]', '{"type": "object", "properties": {"api_key": {"type": "string"}}}'),
('Time Doctor', 'time_tracking', 'Time tracking and productivity monitoring', 'https://www.timedoctor.com', 'https://www.timedoctor.com/public-api/', '["time_entries", "projects", "users", "screenshots", "reports"]', '{"type": "object", "properties": {"api_token": {"type": "string"}}}'),
('RescueTime', 'time_tracking', 'Personal analytics service', 'https://www.rescuetime.com', 'https://www.rescuetime.com/anapi/setup/documentation', '["analytics", "highlights", "alerts", "focus_sessions"]', '{"type": "object", "properties": {"api_key": {"type": "string"}}}'),
('Timely', 'time_tracking', 'Time tracking and project management', 'https://timelyapp.com', 'https://dev.timelyapp.com/', '["time_entries", "projects", "users", "clients", "reports"]', '{"type": "object", "properties": {"account_id": {"type": "string"}, "token": {"type": "string"}}}'),
('Everhour', 'time_tracking', 'Time tracking for teams', 'https://everhour.com', 'https://everhour.docs.apiary.io/', '["time_entries", "projects", "tasks", "users", "reports"]', '{"type": "object", "properties": {"api_key": {"type": "string"}}}'),
('FreshBooks', 'time_tracking', 'Cloud accounting and time tracking', 'https://www.freshbooks.com', 'https://www.freshbooks.com/api/start', '["time_entries", "projects", "clients", "invoices", "expenses"]', '{"type": "object", "properties": {"access_token": {"type": "string"}}}'),
('Hubstaff', 'time_tracking', 'Time tracking and project management', 'https://hubstaff.com', 'https://developer.hubstaff.com/', '["activities", "projects", "tasks", "users", "screenshots"]', '{"type": "object", "properties": {"app_token": {"type": "string"}, "auth_token": {"type": "string"}}}'),
('QuickBooks Time', 'time_tracking', 'Time tracking integrated with QuickBooks', 'https://quickbooks.intuit.com/time-tracking/', 'https://developer.intuit.com/app/developer/qbo/docs/api/accounting/time-activities', '["time_entries", "employees", "jobs", "payroll", "reports"]', '{"type": "object", "properties": {"client_id": {"type": "string"}, "client_secret": {"type": "string"}, "refresh_token": {"type": "string"}}}'),

-- File Storage (Top 10)
('Google Drive', 'file_storage', 'Cloud storage and file sharing', 'https://drive.google.com', 'https://developers.google.com/drive/api/v3/quickstart', '["files", "folders", "sharing", "permissions", "revisions"]', '{"type": "object", "properties": {"client_id": {"type": "string"}, "client_secret": {"type": "string"}, "refresh_token": {"type": "string"}}}'),
('Dropbox', 'file_storage', 'File hosting service', 'https://www.dropbox.com', 'https://www.dropbox.com/developers/documentation', '["files", "folders", "sharing", "comments", "revisions"]', '{"type": "object", "properties": {"access_token": {"type": "string"}, "refresh_token": {"type": "string"}}}'),
('OneDrive', 'file_storage', 'Cloud storage from Microsoft', 'https://onedrive.live.com', 'https://docs.microsoft.com/en-us/graph/api/resources/onedrive', '["files", "folders", "sharing", "permissions", "thumbnails"]', '{"type": "object", "properties": {"client_id": {"type": "string"}, "client_secret": {"type": "string"}, "refresh_token": {"type": "string"}}}'),
('Box', 'file_storage', 'Cloud content management', 'https://www.box.com', 'https://developer.box.com/', '["files", "folders", "sharing", "metadata", "webhooks"]', '{"type": "object", "properties": {"client_id": {"type": "string"}, "client_secret": {"type": "string"}, "refresh_token": {"type": "string"}}}'),
('SharePoint', 'file_storage', 'Document management and storage', 'https://www.microsoft.com/en-us/microsoft-365/sharepoint', 'https://docs.microsoft.com/en-us/graph/api/resources/sharepoint', '["sites", "lists", "files", "folders", "permissions"]', '{"type": "object", "properties": {"client_id": {"type": "string"}, "client_secret": {"type": "string"}, "tenant_id": {"type": "string"}}}'),
('iCloud', 'file_storage', 'Apple cloud storage', 'https://www.icloud.com', 'https://developer.apple.com/documentation/cloudkit', '["records", "zones", "subscriptions", "sharing", "assets"]', '{"type": "object", "properties": {"container_id": {"type": "string"}, "api_token": {"type": "string"}}}'),
('Mega', 'file_storage', 'End-to-end encrypted cloud storage', 'https://mega.nz', 'https://mega.nz/developers', '["files", "folders", "sharing", "links", "contacts"]', '{"type": "object", "properties": {"email": {"type": "string"}, "password": {"type": "string"}}}'),
('pCloud', 'file_storage', 'Secure cloud storage', 'https://www.pcloud.com', 'https://docs.pcloud.com/', '["files", "folders", "sharing", "links", "crypto"]', '{"type": "object", "properties": {"access_token": {"type": "string"}}}'),
('Sync.com', 'file_storage', 'Zero-knowledge cloud storage', 'https://www.sync.com', 'https://www.sync.com/help/developers', '["files", "folders", "sharing", "sync", "backup"]', '{"type": "object", "properties": {"api_key": {"type": "string"}}}'),
('Amazon Drive', 'file_storage', 'Cloud storage from Amazon', 'https://www.amazon.com/drive', 'https://developer.amazon.com/docs/amazon-drive/ad-restful-api.html', '["nodes", "content", "metadata", "sharing", "webhooks"]', '{"type": "object", "properties": {"client_id": {"type": "string"}, "client_secret": {"type": "string"}, "refresh_token": {"type": "string"}}}'),

-- HR (Top 10)
('BambooHR', 'hr', 'Human resources software', 'https://www.bamboohr.com', 'https://documentation.bamboohr.com/docs', '["employees", "time_off", "training", "applicant_tracking", "reports"]', '{"type": "object", "properties": {"api_key": {"type": "string"}, "subdomain": {"type": "string"}}}'),
('Workday', 'hr', 'Cloud-based enterprise management software', 'https://www.workday.com', 'https://community.workday.com/sites/default/files/file-hosting/restapi/index.html', '["workers", "organizations", "payroll", "benefits", "learning"]', '{"type": "object", "properties": {"client_id": {"type": "string"}, "client_secret": {"type": "string"}, "refresh_token": {"type": "string"}}}'),
('ADP', 'hr', 'Human capital management solutions', 'https://www.adp.com', 'https://developers.adp.com/', '["employees", "payroll", "benefits", "time", "talent"]', '{"type": "object", "properties": {"client_id": {"type": "string"}, "client_secret": {"type": "string"}, "refresh_token": {"type": "string"}}}'),
('Greenhouse', 'hr', 'Recruiting software', 'https://www.greenhouse.io', 'https://developers.greenhouse.io/', '["candidates", "jobs", "applications", "offers", "scorecards"]', '{"type": "object", "properties": {"api_key": {"type": "string"}}}'),
('Lever', 'hr', 'Talent acquisition software', 'https://www.lever.co', 'https://hire.lever.co/developer/documentation', '["postings", "candidates", "applications", "interviews", "offers"]', '{"type": "object", "properties": {"api_key": {"type": "string"}}}'),
('Indeed', 'hr', 'Job search and hiring platform', 'https://www.indeed.com', 'https://developer.indeed.com/', '["jobs", "companies", "resumes", "applications", "analytics"]', '{"type": "object", "properties": {"publisher_id": {"type": "string"}, "api_key": {"type": "string"}}}'),
('LinkedIn', 'hr', 'Professional networking and recruiting', 'https://www.linkedin.com', 'https://docs.microsoft.com/en-us/linkedin/', '["companies", "jobs", "people", "organizations", "ads"]', '{"type": "object", "properties": {"client_id": {"type": "string"}, "client_secret": {"type": "string"}, "refresh_token": {"type": "string"}}}'),
('Gusto', 'hr', 'HR and payroll platform', 'https://gusto.com', 'https://docs.gusto.com/', '["employees", "payroll", "benefits", "time_off", "taxes"]', '{"type": "object", "properties": {"client_id": {"type": "string"}, "client_secret": {"type": "string"}, "refresh_token": {"type": "string"}}}'),
('Zenefits', 'hr', 'HR software for small businesses', 'https://www.zenefits.com', 'https://developers.zenefits.com/', '["people", "companies", "payrolls", "benefits", "time_off"]', '{"type": "object", "properties": {"access_token": {"type": "string"}}}'),
('UKG', 'hr', 'Human capital management', 'https://www.ukg.com', 'https://developer.ukg.com/', '["employees", "payroll", "benefits", "time", "talent"]', '{"type": "object", "properties": {"client_id": {"type": "string"}, "client_secret": {"type": "string"}, "refresh_token": {"type": "string"}}}'),

-- Payroll (Top 10)
('Gusto', 'payroll', 'HR and payroll platform', 'https://gusto.com', 'https://docs.gusto.com/', '["employees", "payroll", "benefits", "time_off", "taxes", "contractors"]', '{"type": "object", "properties": {"client_id": {"type": "string"}, "client_secret": {"type": "string"}, "refresh_token": {"type": "string"}}}'),
('ADP Payroll', 'payroll', 'Payroll processing services', 'https://www.adp.com/payroll', 'https://developers.adp.com/', '["employees", "payroll", "taxes", "benefits", "reporting"]', '{"type": "object", "properties": {"client_id": {"type": "string"}, "client_secret": {"type": "string"}, "refresh_token": {"type": "string"}}}'),
('Paychex', 'payroll', 'Payroll and HR services', 'https://www.paychex.com', 'https://developer.paychex.com/', '["employees", "payroll", "taxes", "benefits", "reporting"]', '{"type": "object", "properties": {"client_id": {"type": "string"}, "client_secret": {"type": "string"}, "refresh_token": {"type": "string"}}}'),
('Intuit Payroll', 'payroll', 'Payroll services from Intuit', 'https://quickbooks.intuit.com/payroll/', 'https://developer.intuit.com/app/developer/qbo/docs/api/accounting/payroll', '["employees", "payroll", "taxes", "benefits", "reporting"]', '{"type": "object", "properties": {"client_id": {"type": "string"}, "client_secret": {"type": "string"}, "refresh_token": {"type": "string"}}}'),
('Square Payroll', 'payroll', 'Payroll for small businesses', 'https://squareup.com/us/en/payroll', 'https://docs.connect.squareup.com/', '["employees", "payroll", "taxes", "time_tracking", "benefits"]', '{"type": "object", "properties": {"access_token": {"type": "string"}, "refresh_token": {"type": "string"}}}'),
('Rippling', 'payroll', 'HR and payroll platform', 'https://rippling.com', 'https://docs.rippling.com/', '["employees", "payroll", "benefits", "time_off", "compliance"]', '{"type": "object", "properties": {"client_id": {"type": "string"}, "client_secret": {"type": "string"}, "refresh_token": {"type": "string"}}}'),
('Workday Payroll', 'payroll', 'Enterprise payroll solutions', 'https://www.workday.com/en-us/products/workday-payroll.html', 'https://community.workday.com/sites/default/files/file-hosting/restapi/index.html', '["employees", "payroll", "taxes", "benefits", "analytics"]', '{"type": "object", "properties": {"client_id": {"type": "string"}, "client_secret": {"type": "string"}, "refresh_token": {"type": "string"}}}'),
('BambooHR Payroll', 'payroll', 'Payroll integrated with BambooHR', 'https://www.bamboohr.com/payroll', 'https://documentation.bamboohr.com/docs', '["employees", "payroll", "taxes", "benefits", "reporting"]', '{"type": "object", "properties": {"api_key": {"type": "string"}, "subdomain": {"type": "string"}}}'),
('SurePayroll', 'payroll', 'Payroll services', 'https://www.surepayroll.com', 'https://developer.paychex.com/', '["employees", "payroll", "taxes", "benefits", "reporting"]', '{"type": "object", "properties": {"client_id": {"type": "string"}, "client_secret": {"type": "string"}, "refresh_token": {"type": "string"}}}'),
('OnPay', 'payroll', 'Payroll and HR services', 'https://www.onpay.com', 'https://developer.onpay.com/', '["employees", "payroll", "taxes", "benefits", "reporting"]', '{"type": "object", "properties": {"client_id": {"type": "string"}, "client_secret": {"type": "string"}, "refresh_token": {"type": "string"}}}'),

-- POS (Point of Sale) (Top 10)
('Square', 'pos', 'POS and payment processing', 'https://squareup.com', 'https://docs.connect.squareup.com/', '["transactions", "items", "orders", "customers", "inventory"]', '{"type": "object", "properties": {"access_token": {"type": "string"}, "refresh_token": {"type": "string"}}}'),
('Clover', 'pos', 'POS system for restaurants and retail', 'https://www.clover.com', 'https://docs.clover.com/', '["orders", "payments", "inventory", "customers", "employees"]', '{"type": "object", "properties": {"client_id": {"type": "string"}, "client_secret": {"type": "string"}, "api_token": {"type": "string"}}}'),
('Toast', 'pos', 'Restaurant POS system', 'https://toasttab.com', 'https://doc.toasttab.com/', '["orders", "payments", "inventory", "guests", "menus"]', '{"type": "object", "properties": {"client_id": {"type": "string"}, "client_secret": {"type": "string"}, "refresh_token": {"type": "string"}}}'),
('Lightspeed', 'pos', 'Retail and restaurant POS', 'https://www.lightspeedhq.com', 'https://developers.lightspeedhq.com/', '["products", "orders", "customers", "inventory", "sales"]', '{"type": "object", "properties": {"client_id": {"type": "string"}, "client_secret": {"type": "string"}, "refresh_token": {"type": "string"}}}'),
('Vend', 'pos', 'POS and inventory management', 'https://www.vendhq.com', 'https://docs.vendhq.com/', '["products", "sales", "customers", "inventory", "suppliers"]', '{"type": "object", "properties": {"access_token": {"type": "string"}, "refresh_token": {"type": "string"}}}'),
('Shopify POS', 'pos', 'POS system integrated with Shopify', 'https://www.shopify.com/pos', 'https://shopify.dev/docs/api/admin-rest', '["orders", "products", "customers", "inventory", "locations"]', '{"type": "object", "properties": {"api_key": {"type": "string"}, "api_secret": {"type": "string"}, "access_token": {"type": "string"}}}'),
('Loyverse', 'pos', 'POS and inventory management', 'https://loyverse.com', 'https://developer.loyverse.com/', '["items", "categories", "orders", "customers", "inventory"]', '{"type": "object", "properties": {"access_token": {"type": "string"}}}'),
('TouchBistro', 'pos', 'Restaurant POS system', 'https://www.touchbistro.com', 'https://developer.touchbistro.com/', '["orders", "payments", "inventory", "guests", "menus"]', '{"type": "object", "properties": {"client_id": {"type": "string"}, "client_secret": {"type": "string"}, "refresh_token": {"type": "string"}}}'),
('Kounta', 'pos', 'POS and inventory system', 'https://www.kounta.com', 'https://docs.kounta.com/', '["products", "orders", "customers", "inventory", "sites"]', '{"type": "object", "properties": {"client_id": {"type": "string"}, "client_secret": {"type": "string"}, "refresh_token": {"type": "string"}}}'),
('Revel', 'pos', 'POS system for restaurants', 'https://www.revelsystems.com', 'https://docs.revelup.com/', '["orders", "payments", "inventory", "employees", "tables"]', '{"type": "object", "properties": {"client_id": {"type": "string"}, "client_secret": {"type": "string"}, "api_key": {"type": "string"}}}'),

-- Ticketing (Top 10)
('Zendesk', 'ticketing', 'Customer service and support ticketing system', 'https://www.zendesk.com', 'https://developer.zendesk.com/api-reference/', '["tickets", "users", "organizations", "groups", "articles"]', '{"type": "object", "properties": {"subdomain": {"type": "string"}, "email": {"type": "string"}, "api_token": {"type": "string"}}}'),
('ServiceNow', 'ticketing', 'Enterprise service management platform', 'https://www.servicenow.com', 'https://developer.servicenow.com/dev.do', '["incidents", "requests", "changes", "problems", "assets"]', '{"type": "object", "properties": {"instance_url": {"type": "string"}, "username": {"type": "string"}, "password": {"type": "string"}}}'),
('Jira Service Desk', 'ticketing', 'Service desk for IT and business teams', 'https://www.atlassian.com/software/jira/service-desk', 'https://developer.atlassian.com/cloud/jira/service-desk/rest/', '["requests", "customers", "organizations", "queues", "sla"]', '{"type": "object", "properties": {"api_token": {"type": "string"}, "domain": {"type": "string"}, "username": {"type": "string"}}}'),
('Freshworks', 'ticketing', 'Omnichannel customer support', 'https://www.freshworks.com', 'https://developers.freshworks.com/', '["tickets", "contacts", "companies", "agents", "groups"]', '{"type": "object", "properties": {"api_key": {"type": "string"}, "domain": {"type": "string"}}}'),
('Help Scout', 'ticketing', 'Customer support platform', 'https://www.helpscout.com', 'https://developer.helpscout.com/', '["conversations", "customers", "mailboxes", "users", "workflows"]', '{"type": "object", "properties": {"api_key": {"type": "string"}}}'),
('Intercom', 'ticketing', 'Customer communication platform', 'https://www.intercom.com', 'https://developers.intercom.com/', '["conversations", "users", "companies", "articles", "tags"]', '{"type": "object", "properties": {"access_token": {"type": "string"}}}'),
('Groove', 'ticketing', 'Customer support and help desk', 'https://www.groovehq.com', 'https://developers.groovehq.com/', '["tickets", "customers", "agents", "groups", "mailboxes"]', '{"type": "object", "properties": {"api_token": {"type": "string"}}}'),
('Front', 'ticketing', 'Customer communication hub', 'https://frontapp.com', 'https://dev.frontapp.com/', '["conversations", "contacts", "teams", "inboxes", "rules"]', '{"type": "object", "properties": {"api_token": {"type": "string"}}}'),
('Zoho Desk', 'ticketing', 'Help desk software', 'https://www.zoho.com/desk', 'https://www.zoho.com/desk/api/', '["tickets", "contacts", "accounts", "agents", "departments"]', '{"type": "object", "properties": {"authtoken": {"type": "string"}, "portal": {"type": "string"}}}'),
('Salesforce Service Cloud', 'ticketing', 'Customer service platform', 'https://www.salesforce.com/products/service-cloud', 'https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/', '["cases", "accounts", "contacts", "knowledge", "communities"]', '{"type": "object", "properties": {"client_id": {"type": "string"}, "client_secret": {"type": "string"}, "username": {"type": "string"}, "password": {"type": "string"}, "security_token": {"type": "string"}}}'),

-- Inventory (Top 10)
('Fishbowl', 'inventory', 'Inventory management software', 'https://www.fishbowlinventory.com', 'https://www.fishbowlinventory.com/wiki/', '["parts", "orders", "customers", "vendors", "locations"]', '{"type": "object", "properties": {"username": {"type": "string"}, "password": {"type": "string"}, "app_id": {"type": "string"}}}'),
('Cin7', 'inventory', 'Inventory and order management', 'https://www.cin7.com', 'https://developer.cin7.com/', '["products", "orders", "inventory", "customers", "suppliers"]', '{"type": "object", "properties": {"api_key": {"type": "string"}}}'),
('TradeGecko', 'inventory', 'Inventory management platform', 'https://www.tradegecko.com', 'https://developer.tradegecko.com/', '["products", "orders", "inventory", "customers", "suppliers"]', '{"type": "object", "properties": {"access_token": {"type": "string"}}}'),
('QuickBooks Inventory', 'inventory', 'Inventory tracking in QuickBooks', 'https://quickbooks.intuit.com', 'https://developer.intuit.com/app/developer/qbo/docs/api/accounting/items', '["items", "inventory", "purchases", "sales", "transfers"]', '{"type": "object", "properties": {"client_id": {"type": "string"}, "client_secret": {"type": "string"}, "refresh_token": {"type": "string"}}}'),
('Zoho Inventory', 'inventory', 'Inventory management software', 'https://www.zoho.com/inventory', 'https://www.zoho.com/inventory/api/', '["items", "orders", "inventory", "customers", "vendors"]', '{"type": "object", "properties": {"authtoken": {"type": "string"}, "organization_id": {"type": "string"}}}'),
('inFlow', 'inventory', 'Inventory management software', 'https://www.inflowinventory.com', 'https://www.inflowinventory.com/api/', '["items", "orders", "customers", "vendors", "locations"]', '{"type": "object", "properties": {"api_key": {"type": "string"}}}'),
('Sortly', 'inventory', 'Inventory management and tracking', 'https://www.sortly.com', 'https://docs.sortly.com/', '["items", "folders", "orders", "customers", "locations"]', '{"type": "object", "properties": {"api_key": {"type": "string"}}}'),
('Katana', 'inventory', 'Cloud manufacturing ERP', 'https://www.katanamrp.com', 'https://docs.katanamrp.com/', '["products", "orders", "inventory", "suppliers", "manufacturing"]', '{"type": "object", "properties": {"api_token": {"type": "string"}}}'),
('Finale Inventory', 'inventory', 'Inventory management for wine', 'https://www.finaleinventory.com', 'https://docs.finaleinventory.com/', '["products", "orders", "inventory", "customers", "suppliers"]', '{"type": "object", "properties": {"api_key": {"type": "string"}}}'),
('Lightspeed Retail', 'inventory', 'Retail inventory management', 'https://www.lightspeedhq.com/retail', 'https://developers.lightspeedhq.com/', '["products", "orders", "customers", "inventory", "sales"]', '{"type": "object", "properties": {"client_id": {"type": "string"}, "client_secret": {"type": "string"}, "refresh_token": {"type": "string"}}}'),

-- Analytics (Top 10)
('Google Analytics', 'analytics', 'Web analytics service', 'https://analytics.google.com', 'https://developers.google.com/analytics/devguides/reporting', '["pageviews", "events", "conversions", "audiences", "goals"]', '{"type": "object", "properties": {"property_id": {"type": "string"}, "credentials": {"type": "object"}}}'),
('Mixpanel', 'analytics', 'Product analytics platform', 'https://mixpanel.com', 'https://developer.mixpanel.com/reference/overview', '["events", "profiles", "cohorts", "funnels", "revenue"]', '{"type": "object", "properties": {"project_token": {"type": "string"}, "api_secret": {"type": "string"}}}'),
('Amplitude', 'analytics', 'Product analytics platform', 'https://amplitude.com', 'https://developers.amplitude.com/', '["events", "users", "cohorts", "funnels", "revenue"]', '{"type": "object", "properties": {"api_key": {"type": "string"}, "secret_key": {"type": "string"}}}'),
('Hotjar', 'analytics', 'Behavior analytics and user feedback', 'https://www.hotjar.com', 'https://help.hotjar.com/hc/en-us/articles/4405109971095-API-Reference', '["heatmaps", "recordings", "feedback", "surveys", "funnels"]', '{"type": "object", "properties": {"api_token": {"type": "string"}}}'),
('Segment', 'analytics', 'Customer data platform', 'https://segment.com', 'https://segment.com/docs/connections/sources/catalog/libraries/server/http-api/', '["events", "users", "sources", "destinations", "warehouses"]', '{"type": "object", "properties": {"write_key": {"type": "string"}}}'),
('Adobe Analytics', 'analytics', 'Enterprise analytics platform', 'https://www.adobe.com/analytics/adobe-analytics.html', 'https://github.com/AdobeDocs/analytics-2.0-apis', '["events", "dimensions", "metrics", "segments", "reports"]', '{"type": "object", "properties": {"client_id": {"type": "string"}, "client_secret": {"type": "string"}, "company_id": {"type": "string"}}}'),
('Matomo', 'analytics', 'Open source analytics platform', 'https://matomo.org', 'https://developer.matomo.org/api-reference/reporting-api', '["visits", "actions", "goals", "ecommerce", "events"]', '{"type": "object", "properties": {"token_auth": {"type": "string"}, "site_id": {"type": "string"}}}'),
('Piwik PRO', 'analytics', 'Privacy-focused analytics', 'https://piwik.pro', 'https://developers.piwik.pro/en/latest/', '["events", "goals", "ecommerce", "custom_dimensions", "reports"]', '{"type": "object", "properties": {"client_id": {"type": "string"}, "client_secret": {"type": "string"}}}'),
('Kissmetrics', 'analytics', 'Customer analytics platform', 'https://www.kissmetrics.com', 'https://developers.kissmetrics.com/', '["events", "properties", "funnels", "cohorts", "revenue"]', '{"type": "object", "properties": {"api_key": {"type": "string"}, "api_secret": {"type": "string"}}}'),
('FullStory', 'analytics', 'Digital experience analytics', 'https://www.fullstory.com', 'https://developer.fullstory.com/', '["sessions", "events", "users", "funnels", "conversions"]', '{"type": "object", "properties": {"api_key": {"type": "string"}}}'),

-- Design (Top 10)
('Figma', 'design', 'Collaborative interface design tool', 'https://www.figma.com', 'https://www.figma.com/developers/api', '["files", "projects", "teams", "comments", "versions"]', '{"type": "object", "properties": {"access_token": {"type": "string"}}}'),
('Adobe XD', 'design', 'UX/UI design and prototyping tool', 'https://www.adobe.com/products/xd.html', 'https://developer.adobe.com/xd/docs/', '["designs", "prototypes", "components", "artboards", "assets"]', '{"type": "object", "properties": {"client_id": {"type": "string"}, "client_secret": {"type": "string"}}}'),
('Sketch', 'design', 'Digital design toolkit', 'https://www.sketch.com', 'https://developer.sketch.com/', '["documents", "artboards", "symbols", "shared_libraries", "cloud"]', '{"type": "object", "properties": {"access_token": {"type": "string"}}}'),
('InVision', 'design', 'Digital product design platform', 'https://www.invisionapp.com', 'https://projects.invisionapp.com/d/main#/console/advocate', '["prototypes", "screens", "comments", "inspect", "craft"]', '{"type": "object", "properties": {"client_id": {"type": "string"}, "client_secret": {"type": "string"}}}'),
('Framer', 'design', 'Interactive design tool', 'https://www.framer.com', 'https://www.framer.com/docs/', '["components", "prototypes", "code_components", "packages", "store"]', '{"type": "object", "properties": {"access_token": {"type": "string"}}}'),
('Canva', 'design', 'Graphic design platform', 'https://www.canva.com', 'https://www.canva.com/developers/', '["designs", "templates", "brands", "folders", "team"]', '{"type": "object", "properties": {"access_token": {"type": "string"}}}'),
('Miro', 'design', 'Online collaborative whiteboard', 'https://miro.com', 'https://developers.miro.com/', '["boards", "widgets", "users", "teams", "webhooks"]', '{"type": "object", "properties": {"access_token": {"type": "string"}}}'),
('Lucidchart', 'design', 'Diagramming and visualization', 'https://www.lucidchart.com', 'https://developer.lucid.co/', '["documents", "shapes", "layers", "data", "images"]', '{"type": "object", "properties": {"access_token": {"type": "string"}}}'),
('Balsamiq', 'design', 'Wireframing tool', 'https://balsamiq.com', 'https://docs.balsamiq.com/', '["projects", "wireframes", "symbols", "assets", "comments"]', '{"type": "object", "properties": {"api_key": {"type": "string"}}}'),
('Axure', 'design', 'Prototyping and specification tool', 'https://www.axure.com', 'https://docs.axure.com/axure-cloud/reference/', '["projects", "pages", "masters", "widgets", "specifications"]', '{"type": "object", "properties": {"access_token": {"type": "string"}}}'),

-- Testing (Top 10)
('BrowserStack', 'testing', 'Cross-browser testing platform', 'https://www.browserstack.com', 'https://www.browserstack.com/automate/rest-api', '["sessions", "builds", "screenshots", "logs", "accessibility"]', '{"type": "object", "properties": {"username": {"type": "string"}, "access_key": {"type": "string"}}}'),
('Sauce Labs', 'testing', 'Automated testing platform', 'https://saucelabs.com', 'https://docs.saucelabs.com/dev/api/', '["jobs", "builds", "assets", "tunnels", "insights"]', '{"type": "object", "properties": {"username": {"type": "string"}, "access_key": {"type": "string"}}}'),
('TestRail', 'testing', 'Test case management software', 'https://www.testrail.com', 'https://www.testrail.com/api/v2/', '["projects", "suites", "cases", "runs", "results"]', '{"type": "object", "properties": {"url": {"type": "string"}, "username": {"type": "string"}, "api_key": {"type": "string"}}}'),
('Browserling', 'testing', 'Cross-browser testing', 'https://www.browserling.com', 'https://www.browserling.com/api', '["screenshots", "sessions", "browsers", "tests"]', '{"type": "object", "properties": {"api_key": {"type": "string"}}}'),
('LambdaTest', 'testing', 'Digital experience testing platform', 'https://www.lambdatest.com', 'https://www.lambdatest.com/support/api-doc/', '["automate", "screenshots", "accessibility", "geolocation"]', '{"type": "object", "properties": {"username": {"type": "string"}, "access_key": {"type": "string"}}}'),
('CrossBrowserTesting', 'testing', 'Cross-browser testing platform', 'https://crossbrowsertesting.com', 'https://support.crossbrowsertesting.com/hc/en-us/articles/360001193651-API-Documentation', '["tests", "screenshots", "videos", "selenium", "local_testing"]', '{"type": "object", "properties": {"username": {"type": "string"}, "authkey": {"type": "string"}}}'),
('TestingBot', 'testing', 'Cross-browser testing platform', 'https://testingbot.com', 'https://testingbot.com/support/api', '["tests", "screenshots", "videos", "logs", "javascript_errors"]', '{"type": "object", "properties": {"key": {"type": "string"}, "secret": {"type": "string"}}}'),
('Applitools', 'testing', 'Visual testing and monitoring', 'https://applitools.com', 'https://applitools.com/docs/api/', '["tests", "baselines", "steps", "results", "environments"]', '{"type": "object", "properties": {"api_key": {"type": "string"}}}'),
('Percy', 'testing', 'Visual testing platform', 'https://percy.io', 'https://docs.percy.io/docs/api', '["builds", "snapshots", "comparisons", "webhooks"]', '{"type": "object", "properties": {"token": {"type": "string"}}}'),
('Cypress', 'testing', 'End-to-end testing framework', 'https://www.cypress.io', 'https://docs.cypress.io/guides/references/configuration', '["tests", "runs", "screenshots", "videos", "dashboard"]', '{"type": "object", "properties": {"record_key": {"type": "string"}, "project_id": {"type": "string"}}}'),

-- Monitoring (Top 10)
('Datadog', 'monitoring', 'Monitoring and analytics platform', 'https://www.datadoghq.com', 'https://docs.datadoghq.com/api/latest/', '["metrics", "logs", "traces", "alerts", "dashboards"]', '{"type": "object", "properties": {"api_key": {"type": "string"}, "app_key": {"type": "string"}}}'),
('New Relic', 'monitoring', 'Software analytics and monitoring', 'https://newrelic.com', 'https://docs.newrelic.com/docs/apis/rest-api-v2/', '["applications", "servers", "browser", "mobile", "synthetics"]', '{"type": "object", "properties": {"api_key": {"type": "string"}, "account_id": {"type": "string"}}}'),
('Sentry', 'monitoring', 'Error tracking and performance monitoring', 'https://sentry.io', 'https://docs.sentry.io/api/', '["issues", "events", "releases", "projects", "teams"]', '{"type": "object", "properties": {"dsn": {"type": "string"}, "auth_token": {"type": "string"}}}'),
('Grafana', 'monitoring', 'Analytics and monitoring platform', 'https://grafana.com', 'https://grafana.com/docs/grafana/latest/http_api/', '["dashboards", "datasources", "annotations", "alerts", "folders"]', '{"type": "object", "properties": {"api_key": {"type": "string"}}}'),
('Prometheus', 'monitoring', 'Monitoring and alerting toolkit', 'https://prometheus.io', 'https://prometheus.io/docs/prometheus/latest/querying/api/', '["query", "query_range", "series", "labels", "targets"]', '{"type": "object", "properties": {"url": {"type": "string"}, "username": {"type": "string"}, "password": {"type": "string"}}}'),
('ELK Stack', 'monitoring', 'Elasticsearch, Logstash, Kibana', 'https://www.elastic.co/elastic-stack', 'https://www.elastic.co/guide/en/elasticsearch/reference/current/rest-apis.html', '["indices", "documents", "search", "aggregations", "logs"]', '{"type": "object", "properties": {"url": {"type": "string"}, "username": {"type": "string"}, "password": {"type": "string"}}}'),
('Splunk', 'monitoring', 'Data analytics and monitoring', 'https://www.splunk.com', 'https://docs.splunk.com/Documentation/Splunk/latest/RESTREF/RESTprolog', '["searches", "indexes", "inputs", "alerts", "reports"]', '{"type": "object", "properties": {"token": {"type": "string"}, "username": {"type": "string"}, "password": {"type": "string"}}}'),
('AppDynamics', 'monitoring', 'Application performance monitoring', 'https://www.appdynamics.com', 'https://docs.appdynamics.com/', '["applications", "tiers", "nodes", "business_transactions", "events"]', '{"type": "object", "properties": {"controller_url": {"type": "string"}, "account_name": {"type": "string"}, "username": {"type": "string"}, "password": {"type": "string"}}}'),
('Dynatrace', 'monitoring', 'Software intelligence platform', 'https://www.dynatrace.com', 'https://www.dynatrace.com/support/help/dynatrace-api/', '["entities", "metrics", "problems", "events", "logs"]', '{"type": "object", "properties": {"environment_id": {"type": "string"}, "api_token": {"type": "string"}}}'),
('Pingdom', 'monitoring', 'Website monitoring service', 'https://www.pingdom.com', 'https://docs.pingdom.com/api/', '["checks", "contacts", "probes", "reports", "alerts"]', '{"type": "object", "properties": {"username": {"type": "string"}, "password": {"type": "string"}, "app_key": {"type": "string"}}}'),

-- Security (Top 10)
('Okta', 'security', 'Identity and access management', 'https://www.okta.com', 'https://developer.okta.com/docs/reference/', '["users", "groups", "apps", "policies", "logs"]', '{"type": "object", "properties": {"domain": {"type": "string"}, "api_token": {"type": "string"}}}'),
('Auth0', 'security', 'Identity platform for application builders', 'https://auth0.com', 'https://auth0.com/docs/api/management/v2', '["users", "connections", "clients", "rules", "logs"]', '{"type": "object", "properties": {"domain": {"type": "string"}, "client_id": {"type": "string"}, "client_secret": {"type": "string"}}}'),
('OneLogin', 'security', 'Identity and access management', 'https://www.onelogin.com', 'https://developers.onelogin.com/', '["users", "apps", "groups", "roles", "events"]', '{"type": "object", "properties": {"client_id": {"type": "string"}, "client_secret": {"type": "string"}}}'),
('Azure AD', 'security', 'Microsoft identity platform', 'https://azure.microsoft.com/en-us/services/active-directory/', 'https://docs.microsoft.com/en-us/graph/api/overview', '["users", "groups", "applications", "service_principals", "directory_roles"]', '{"type": "object", "properties": {"client_id": {"type": "string"}, "client_secret": {"type": "string"}, "tenant_id": {"type": "string"}}}'),
('AWS IAM', 'security', 'Identity and access management for AWS', 'https://aws.amazon.com/iam/', 'https://docs.aws.amazon.com/IAM/latest/APIReference/', '["users", "groups", "roles", "policies", "access_keys"]', '{"type": "object", "properties": {"access_key_id": {"type": "string"}, "secret_access_key": {"type": "string"}, "region": {"type": "string"}}}'),
('Ping Identity', 'security', 'Identity and access management', 'https://www.pingidentity.com', 'https://docs.pingidentity.com/', '["users", "applications", "groups", "policies", "audit"]', '{"type": "object", "properties": {"client_id": {"type": "string"}, "client_secret": {"type": "string"}}}'),
('Duo Security', 'security', 'Multi-factor authentication', 'https://duo.com', 'https://duo.com/docs/adminapi', '["users", "phones", "tokens", "integrations", "logs"]', '{"type": "object", "properties": {"integration_key": {"type": "string"}, "secret_key": {"type": "string"}, "api_hostname": {"type": "string"}}}'),
('LastPass', 'security', 'Password management', 'https://www.lastpass.com', 'https://support.logmeininc.com/lastpass/help/lastpass-api', '["users", "groups", "folders", "sites", "reports"]', '{"type": "object", "properties": {"cid": {"type": "string"}, "provhash": {"type": "string"}, "apiuser": {"type": "string"}, "apikey": {"type": "string"}}}'),
('Bitwarden', 'security', 'Password management', 'https://bitwarden.com', 'https://bitwarden.com/help/api/', '["items", "folders", "collections", "organizations", "users"]', '{"type": "object", "properties": {"access_token": {"type": "string"}, "refresh_token": {"type": "string"}}}'),
('Keeper', 'security', 'Password management and digital vault', 'https://www.keepersecurity.com', 'https://docs.keeper.io/', '["records", "folders", "shared_folders", "teams", "reports"]', '{"type": "object", "properties": {"username": {"type": "string"}, "password": {"type": "string"}}}'),

-- Learning (Top 10)
('Udemy', 'learning', 'Online learning platform', 'https://www.udemy.com', 'https://www.udemy.com/developers/', '["courses", "enrollments", "progress", "certificates", "reviews"]', '{"type": "object", "properties": {"client_id": {"type": "string"}, "client_secret": {"type": "string"}}}'),
('Coursera', 'learning', 'Online education platform', 'https://www.coursera.org', 'https://building.coursera.org/app-platform/catalog/', '["courses", "specializations", "degrees", "enrollments", "certificates"]', '{"type": "object", "properties": {"client_id": {"type": "string"}, "client_secret": {"type": "string"}}}'),
('LinkedIn Learning', 'learning', 'Professional development platform', 'https://learning.linkedin.com', 'https://docs.microsoft.com/en-us/linkedin/learning/', '["courses", "learning_paths", "videos", "assessments", "certificates"]', '{"type": "object", "properties": {"client_id": {"type": "string"}, "client_secret": {"type": "string"}}}'),
('Pluralsight', 'learning', 'Technology skills platform', 'https://www.pluralsight.com', 'https://docs.microsoft.com/en-us/linkedin/learning/', '["courses", "paths", "channels", "clips", "assessments"]', '{"type": "object", "properties": {"client_id": {"type": "string"}, "client_secret": {"type": "string"}}}'),
('Skillshare', 'learning', 'Online learning community', 'https://www.skillshare.com', 'https://www.skillshare.com/api', '["classes", "teachers", "students", "projects", "reviews"]', '{"type": "object", "properties": {"access_token": {"type": "string"}}}'),
('edX', 'learning', 'Online learning platform', 'https://www.edx.org', 'https://courses.edx.org/api-docs/', '["courses", "enrollments", "certificates", "discussions", "grades"]', '{"type": "object", "properties": {"client_id": {"type": "string"}, "client_secret": {"type": "string"}}}'),
('Khan Academy', 'learning', 'Free online education', 'https://www.khanacademy.org', 'https://github.com/Khan/khan-api', '["topics", "videos", "exercises", "progress", "badges"]', '{"type": "object", "properties": {"consumer_key": {"type": "string"}, "consumer_secret": {"type": "string"}}}'),
('Codecademy', 'learning', 'Interactive coding platform', 'https://www.codecademy.com', 'https://api.codecademy.com/', '["paths", "courses", "projects", "assessments", "progress"]', '{"type": "object", "properties": {"access_token": {"type": "string"}}}'),
('Treehouse', 'learning', 'Online learning platform', 'https://teamtreehouse.com', 'https://developers.teamtreehouse.com/', '["tracks", "courses", "videos", "badges", "points"]', '{"type": "object", "properties": {"api_key": {"type": "string"}}}'),
('freeCodeCamp', 'learning', 'Free coding education', 'https://www.freecodecamp.org', 'https://forum.freecodecamp.org/', '["curriculum", "challenges", "projects", "certifications", "forum"]', '{"type": "object", "properties": {"access_token": {"type": "string"}}}'),

-- Marketing (Top 10)
('Mailchimp', 'marketing', 'Email marketing platform', 'https://mailchimp.com', 'https://mailchimp.com/developer/', '["campaigns", "audiences", "automation", "reports", "templates"]', '{"type": "object", "properties": {"api_key": {"type": "string"}, "server_prefix": {"type": "string"}}}'),
('HubSpot', 'marketing', 'CRM and marketing automation platform', 'https://www.hubspot.com', 'https://developers.hubspot.com/docs/api/overview', '["contacts", "companies", "deals", "marketing", "sales"]', '{"type": "object", "properties": {"access_token": {"type": "string"}, "refresh_token": {"type": "string"}}}'),
('Klaviyo', 'marketing', 'Email marketing and SMS platform', 'https://www.klaviyo.com', 'https://developers.klaviyo.com/en/reference/api_overview', '["lists", "profiles", "campaigns", "flows", "metrics"]', '{"type": "object", "properties": {"api_key": {"type": "string"}}}'),
('SendGrid', 'marketing', 'Email delivery service', 'https://sendgrid.com', 'https://docs.sendgrid.com/api-reference/', '["mail", "marketing", "contacts", "stats", "webhooks"]', '{"type": "object", "properties": {"api_key": {"type": "string"}}}'),
('Constant Contact', 'marketing', 'Email marketing platform', 'https://www.constantcontact.com', 'https://developer.constantcontact.com/api_guide/', '["contacts", "lists", "campaigns", "events", "library"]', '{"type": "object", "properties": {"api_key": {"type": "string"}, "access_token": {"type": "string"}}}'),
('ActiveCampaign', 'marketing', 'Marketing automation platform', 'https://www.activecampaign.com', 'https://developers.activecampaign.com/reference/overview', '["contacts", "lists", "campaigns", "automations", "deals"]', '{"type": "object", "properties": {"api_key": {"type": "string"}, "api_url": {"type": "string"}}}'),
('Drip', 'marketing', 'Email marketing automation', 'https://www.drip.com', 'https://developer.drip.com/', '["subscribers", "campaigns", "workflows", "tags", "events"]', '{"type": "object", "properties": {"api_token": {"type": "string"}}}'),
('ConvertKit', 'marketing', 'Email marketing for creators', 'https://convertkit.com', 'https://developers.convertkit.com/', '["subscribers", "forms", "sequences", "tags", "broadcasts"]', '{"type": "object", "properties": {"api_secret": {"type": "string"}}}'),
('GetResponse', 'marketing', 'Email marketing platform', 'https://www.getresponse.com', 'https://apidocs.getresponse.com/', '["contacts", "campaigns", "messages", "webinars", "landing_pages"]', '{"type": "object", "properties": {"api_key": {"type": "string"}}}'),
('MailerLite', 'marketing', 'Email marketing platform', 'https://www.mailerlite.com', 'https://developers.mailerlite.com/reference/overview', '["subscribers", "groups", "campaigns", "automations", "forms"]', '{"type": "object", "properties": {"api_key": {"type": "string"}}}'),

-- Legal (Top 10)
('DocuSign', 'legal', 'Electronic signature and agreement cloud', 'https://www.docusign.com', 'https://developers.docusign.com/', '["envelopes", "templates", "signers", "documents", "accounts"]', '{"type": "object", "properties": {"integration_key": {"type": "string"}, "secret_key": {"type": "string"}, "account_id": {"type": "string"}}}'),
('HelloSign', 'legal', 'Electronic signature service', 'https://www.hellosign.com', 'https://app.hellosign.com/api/reference', '["signature_requests", "templates", "teams", "account", "reports"]', '{"type": "object", "properties": {"api_key": {"type": "string"}}}'),
('PandaDoc', 'legal', 'Document automation platform', 'https://www.pandadoc.com', 'https://developers.pandadoc.com/', '["documents", "templates", "contacts", "webhooks", "workflows"]', '{"type": "object", "properties": {"access_token": {"type": "string"}}}'),
('Adobe Sign', 'legal', 'Electronic signature service', 'https://acrobat.adobe.com/us/en/sign.html', 'https://secure.na1.adobesign.com/public/docs/restapi/v6', '["agreements", "widgets", "library_documents", "mega_signs", "webhooks"]', '{"type": "object", "properties": {"client_id": {"type": "string"}, "client_secret": {"type": "string"}}}'),
('RightSignature', 'legal', 'Electronic signature platform', 'https://rightsignature.com', 'https://rightsignature.com/apidocs', '["documents", "signers", "templates", "groups", "audit_trails"]', '{"type": "object", "properties": {"api_token": {"type": "string"}}}'),
('SignNow', 'legal', 'Electronic signature and document management', 'https://www.signnow.com', 'https://docs.signnow.com/', '["documents", "signatures", "templates", "folders", "users"]', '{"type": "object", "properties": {"client_id": {"type": "string"}, "client_secret": {"type": "string"}}}'),
('OneSpan', 'legal', 'Digital agreement platform', 'https://www.onespan.com', 'https://www.onespan.com/products/digital-agreements/developer', '["packages", "documents", "signers", "approvals", "reports"]', '{"type": "object", "properties": {"client_id": {"type": "string"}, "client_secret": {"type": "string"}}}'),
('Sertifi', 'legal', 'Electronic signature platform', 'https://www.sertifi.com', 'https://www.sertifi.com/developer', '["envelopes", "documents", "signers", "templates", "webhooks"]', '{"type": "object", "properties": {"api_key": {"type": "string"}}}'),
('Conga', 'legal', 'Contract lifecycle management', 'https://www.conga.com', 'https://documentation.conga.com/', '["agreements", "clauses", "templates", "documents", "workflows"]', '{"type": "object", "properties": {"client_id": {"type": "string"}, "client_secret": {"type": "string"}}}'),
('Ironclad', 'legal', 'Contract management platform', 'https://www.ironcladapp.com', 'https://docs.ironcladapp.com/', '["workflows", "records", "templates", "approvals", "reports"]', '{"type": "object", "properties": {"access_token": {"type": "string"}}}'),

-- Finance (Top 10)
('Stripe', 'finance', 'Payment processing platform', 'https://stripe.com', 'https://stripe.com/docs/api', '["charges", "customers", "subscriptions", "invoices", "transfers"]', '{"type": "object", "properties": {"publishable_key": {"type": "string"}, "secret_key": {"type": "string"}}}'),
('PayPal', 'finance', 'Online payment system', 'https://www.paypal.com', 'https://developer.paypal.com/docs/api/overview/', '["payments", "orders", "subscriptions", "invoices", "payouts"]', '{"type": "object", "properties": {"client_id": {"type": "string"}, "client_secret": {"type": "string"}}}'),
('Square', 'finance', 'Payment and point-of-sale solutions', 'https://squareup.com', 'https://docs.connect.squareup.com/', '["payments", "orders", "customers", "items", "inventory"]', '{"type": "object", "properties": {"access_token": {"type": "string"}, "refresh_token": {"type": "string"}}}'),
('QuickBooks', 'finance', 'Accounting software', 'https://quickbooks.intuit.com', 'https://developer.intuit.com/app/developer/qbo/docs/api/accounting/overview', '["customers", "invoices", "bills", "items", "accounts"]', '{"type": "object", "properties": {"client_id": {"type": "string"}, "client_secret": {"type": "string"}, "refresh_token": {"type": "string"}}}'),
('Xero', 'finance', 'Cloud accounting software', 'https://www.xero.com', 'https://developer.xero.com/documentation/api/accounting/overview', '["invoices", "bank_transactions", "contacts", "items", "accounts"]', '{"type": "object", "properties": {"client_id": {"type": "string"}, "client_secret": {"type": "string"}, "refresh_token": {"type": "string"}}}'),
('FreshBooks', 'finance', 'Accounting software for small businesses', 'https://www.freshbooks.com', 'https://www.freshbooks.com/api/start', '["clients", "invoices", "estimates", "expenses", "time_entries"]', '{"type": "object", "properties": {"access_token": {"type": "string"}}}'),
('Expensify', 'finance', 'Expense management software', 'https://www.expensify.com', 'https://integrations.expensify.com/Integration-Server/doc/', '["expenses", "reports", "policies", "cards", "trips"]', '{"type": "object", "properties": {"partner_user_id": {"type": "string"}, "partner_user_secret": {"type": "string"}}}'),
('Brex', 'finance', 'Corporate card and spend management', 'https://www.brex.com', 'https://developer.brex.com/', '["cards", "transactions", "limits", "users", "departments"]', '{"type": "object", "properties": {"access_token": {"type": "string"}}}'),
('Bill.com', 'finance', 'Accounts payable automation', 'https://www.bill.com', 'https://developer.bill.com/', '["bills", "vendors", "approvals", "payments", "organizations"]', '{"type": "object", "properties": {"dev_key": {"type": "string"}, "session_id": {"type": "string"}}}'),
('Wave', 'finance', 'Free accounting software', 'https://www.waveapps.com', 'https://developer.waveapps.com/', '["customers", "invoices", "products", "accounts", "transfers"]', '{"type": "object", "properties": {"access_token": {"type": "string"}}}');

-- Create specific integration tables for new categories

-- Payroll integration specific tables
CREATE TABLE payroll_integrations (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    integration_id TEXT NOT NULL REFERENCES integrations(id) ON DELETE CASCADE,
    employee_sync_enabled BOOLEAN DEFAULT true,
    payroll_run_sync_enabled BOOLEAN DEFAULT true,
    tax_calculation_sync BOOLEAN DEFAULT true,
    direct_deposit_enabled BOOLEAN DEFAULT true,
    benefits_sync_enabled BOOLEAN DEFAULT true,
    compliance_reporting BOOLEAN DEFAULT true,
    webhook_secret TEXT,
    payroll_schedule TEXT DEFAULT 'monthly',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- POS integration specific tables
CREATE TABLE pos_integrations (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    integration_id TEXT NOT NULL REFERENCES integrations(id) ON DELETE CASCADE,
    transaction_sync_enabled BOOLEAN DEFAULT true,
    inventory_sync_enabled BOOLEAN DEFAULT true,
    customer_sync_enabled BOOLEAN DEFAULT true,
    employee_sync_enabled BOOLEAN DEFAULT false,
    table_management BOOLEAN DEFAULT false,
    online_ordering_sync BOOLEAN DEFAULT true,
    gift_cards_enabled BOOLEAN DEFAULT true,
    loyalty_program_sync BOOLEAN DEFAULT false,
    webhook_secret TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventory integration specific tables
CREATE TABLE inventory_integrations (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    integration_id TEXT NOT NULL REFERENCES integrations(id) ON DELETE CASCADE,
    product_sync_enabled BOOLEAN DEFAULT true,
    stock_level_sync BOOLEAN DEFAULT true,
    supplier_sync_enabled BOOLEAN DEFAULT true,
    warehouse_sync_enabled BOOLEAN DEFAULT true,
    purchase_order_sync BOOLEAN DEFAULT true,
    sales_order_sync BOOLEAN DEFAULT true,
    barcode_sync_enabled BOOLEAN DEFAULT true,
    low_stock_alerts BOOLEAN DEFAULT true,
    auto_reorder_enabled BOOLEAN DEFAULT false,
    webhook_secret TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all new integration tables
ALTER TABLE payroll_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_integrations ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX idx_payroll_integrations_integration_id ON payroll_integrations(integration_id);
CREATE INDEX idx_pos_integrations_integration_id ON pos_integrations(integration_id);
CREATE INDEX idx_inventory_integrations_integration_id ON inventory_integrations(integration_id);

-- Create RLS policies for new integration tables (inherit base integration access)
CREATE POLICY "Users can manage payroll integrations in their organization" ON payroll_integrations
    FOR ALL USING (integration_id IN (
        SELECT id FROM integrations WHERE organization_id IN (
            SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can manage POS integrations in their organization" ON pos_integrations
    FOR ALL USING (integration_id IN (
        SELECT id FROM integrations WHERE organization_id IN (
            SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can manage inventory integrations in their organization" ON inventory_integrations
    FOR ALL USING (integration_id IN (
        SELECT id FROM integrations WHERE organization_id IN (
            SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
        )
    ));

-- Project management integration specific tables
CREATE TABLE project_management_integrations (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    integration_id TEXT NOT NULL REFERENCES integrations(id) ON DELETE CASCADE,
    project_sync_enabled BOOLEAN DEFAULT true,
    task_sync_enabled BOOLEAN DEFAULT true,
    user_sync_enabled BOOLEAN DEFAULT true,
    sprint_sync_enabled BOOLEAN DEFAULT true,
    default_project_template TEXT,
    webhook_secret TEXT,
    custom_fields_mapping JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Version control integration specific tables
CREATE TABLE version_control_integrations (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    integration_id TEXT NOT NULL REFERENCES integrations(id) ON DELETE CASCADE,
    repository_sync_enabled BOOLEAN DEFAULT true,
    pull_request_sync_enabled BOOLEAN DEFAULT true,
    issue_sync_enabled BOOLEAN DEFAULT true,
    commit_sync_enabled BOOLEAN DEFAULT true,
    webhook_secret TEXT,
    default_branch TEXT DEFAULT 'main',
    allowed_repositories JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CI/CD integration specific tables
CREATE TABLE ci_cd_integrations (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    integration_id TEXT NOT NULL REFERENCES integrations(id) ON DELETE CASCADE,
    pipeline_sync_enabled BOOLEAN DEFAULT true,
    build_sync_enabled BOOLEAN DEFAULT true,
    deployment_sync_enabled BOOLEAN DEFAULT true,
    artifact_sync_enabled BOOLEAN DEFAULT true,
    webhook_secret TEXT,
    supported_environments JSONB,
    auto_deployment_enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documentation integration specific tables
CREATE TABLE documentation_integrations (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    integration_id TEXT NOT NULL REFERENCES integrations(id) ON DELETE CASCADE,
    page_sync_enabled BOOLEAN DEFAULT true,
    space_sync_enabled BOOLEAN DEFAULT true,
    comment_sync_enabled BOOLEAN DEFAULT true,
    permission_sync_enabled BOOLEAN DEFAULT false,
    default_space_id TEXT,
    webhook_secret TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Time tracking integration specific tables
CREATE TABLE time_tracking_integrations (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    integration_id TEXT NOT NULL REFERENCES integrations(id) ON DELETE CASCADE,
    time_entry_sync_enabled BOOLEAN DEFAULT true,
    project_sync_enabled BOOLEAN DEFAULT true,
    user_sync_enabled BOOLEAN DEFAULT true,
    auto_time_tracking BOOLEAN DEFAULT false,
    billable_rate_sync BOOLEAN DEFAULT true,
    webhook_secret TEXT,
    default_workspace_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- File storage integration specific tables
CREATE TABLE file_storage_integrations (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    integration_id TEXT NOT NULL REFERENCES integrations(id) ON DELETE CASCADE,
    file_sync_enabled BOOLEAN DEFAULT true,
    folder_sync_enabled BOOLEAN DEFAULT true,
    sharing_sync_enabled BOOLEAN DEFAULT true,
    version_control_enabled BOOLEAN DEFAULT true,
    default_folder_id TEXT,
    allowed_file_types JSONB,
    max_file_size_mb INTEGER DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- HR integration specific tables
CREATE TABLE hr_integrations (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    integration_id TEXT NOT NULL REFERENCES integrations(id) ON DELETE CASCADE,
    employee_sync_enabled BOOLEAN DEFAULT true,
    time_off_sync_enabled BOOLEAN DEFAULT true,
    payroll_sync_enabled BOOLEAN DEFAULT false,
    training_sync_enabled BOOLEAN DEFAULT true,
    applicant_sync_enabled BOOLEAN DEFAULT true,
    webhook_secret TEXT,
    employee_fields_mapping JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ticketing integration specific tables
CREATE TABLE ticketing_integrations (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    integration_id TEXT NOT NULL REFERENCES integrations(id) ON DELETE CASCADE,
    ticket_sync_enabled BOOLEAN DEFAULT true,
    user_sync_enabled BOOLEAN DEFAULT true,
    organization_sync_enabled BOOLEAN DEFAULT true,
    priority_mapping JSONB,
    status_mapping JSONB,
    auto_assignment_enabled BOOLEAN DEFAULT false,
    webhook_secret TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics integration specific tables
CREATE TABLE analytics_integrations (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    integration_id TEXT NOT NULL REFERENCES integrations(id) ON DELETE CASCADE,
    event_sync_enabled BOOLEAN DEFAULT true,
    pageview_sync_enabled BOOLEAN DEFAULT true,
    conversion_sync_enabled BOOLEAN DEFAULT true,
    audience_sync_enabled BOOLEAN DEFAULT true,
    custom_events_mapping JSONB,
    goal_tracking_enabled BOOLEAN DEFAULT true,
    real_time_sync BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Design integration specific tables
CREATE TABLE design_integrations (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    integration_id TEXT NOT NULL REFERENCES integrations(id) ON DELETE CASCADE,
    file_sync_enabled BOOLEAN DEFAULT true,
    project_sync_enabled BOOLEAN DEFAULT true,
    comment_sync_enabled BOOLEAN DEFAULT true,
    version_sync_enabled BOOLEAN DEFAULT true,
    webhook_secret TEXT,
    default_team_id TEXT,
    allowed_file_formats JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Testing integration specific tables
CREATE TABLE testing_integrations (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    integration_id TEXT NOT NULL REFERENCES integrations(id) ON DELETE CASCADE,
    test_run_sync_enabled BOOLEAN DEFAULT true,
    test_case_sync_enabled BOOLEAN DEFAULT true,
    test_suite_sync_enabled BOOLEAN DEFAULT true,
    automated_sync BOOLEAN DEFAULT true,
    browser_configurations JSONB,
    test_environments JSONB,
    webhook_secret TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Monitoring integration specific tables
CREATE TABLE monitoring_integrations (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    integration_id TEXT NOT NULL REFERENCES integrations(id) ON DELETE CASCADE,
    metric_sync_enabled BOOLEAN DEFAULT true,
    log_sync_enabled BOOLEAN DEFAULT true,
    alert_sync_enabled BOOLEAN DEFAULT true,
    error_tracking_enabled BOOLEAN DEFAULT true,
    dashboard_sync_enabled BOOLEAN DEFAULT false,
    retention_days INTEGER DEFAULT 30,
    webhook_secret TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Security integration specific tables
CREATE TABLE security_integrations (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    integration_id TEXT NOT NULL REFERENCES integrations(id) ON DELETE CASCADE,
    user_sync_enabled BOOLEAN DEFAULT true,
    group_sync_enabled BOOLEAN DEFAULT true,
    policy_sync_enabled BOOLEAN DEFAULT true,
    mfa_sync_enabled BOOLEAN DEFAULT true,
    sso_enabled BOOLEAN DEFAULT true,
    provisioning_enabled BOOLEAN DEFAULT false,
    webhook_secret TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Learning integration specific tables
CREATE TABLE learning_integrations (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    integration_id TEXT NOT NULL REFERENCES integrations(id) ON DELETE CASCADE,
    course_sync_enabled BOOLEAN DEFAULT true,
    enrollment_sync_enabled BOOLEAN DEFAULT true,
    progress_sync_enabled BOOLEAN DEFAULT true,
    certificate_sync_enabled BOOLEAN DEFAULT true,
    auto_enrollment BOOLEAN DEFAULT false,
    required_courses JSONB,
    webhook_secret TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Marketing integration specific tables
CREATE TABLE marketing_integrations (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    integration_id TEXT NOT NULL REFERENCES integrations(id) ON DELETE CASCADE,
    campaign_sync_enabled BOOLEAN DEFAULT true,
    audience_sync_enabled BOOLEAN DEFAULT true,
    email_sync_enabled BOOLEAN DEFAULT true,
    automation_sync_enabled BOOLEAN DEFAULT true,
    lead_sync_enabled BOOLEAN DEFAULT true,
    webhook_secret TEXT,
    default_list_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Legal integration specific tables
CREATE TABLE legal_integrations (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    integration_id TEXT NOT NULL REFERENCES integrations(id) ON DELETE CASCADE,
    document_sync_enabled BOOLEAN DEFAULT true,
    signature_sync_enabled BOOLEAN DEFAULT true,
    template_sync_enabled BOOLEAN DEFAULT true,
    workflow_sync_enabled BOOLEAN DEFAULT true,
    compliance_tracking BOOLEAN DEFAULT true,
    retention_policy JSONB,
    webhook_secret TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Finance integration specific tables
CREATE TABLE finance_integrations (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    integration_id TEXT NOT NULL REFERENCES integrations(id) ON DELETE CASCADE,
    transaction_sync_enabled BOOLEAN DEFAULT true,
    card_sync_enabled BOOLEAN DEFAULT true,
    expense_sync_enabled BOOLEAN DEFAULT true,
    budget_sync_enabled BOOLEAN DEFAULT false,
    receipt_sync_enabled BOOLEAN DEFAULT true,
    auto_approval BOOLEAN DEFAULT false,
    webhook_secret TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all new integration tables
ALTER TABLE project_management_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE version_control_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ci_cd_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentation_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_tracking_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_storage_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticketing_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE design_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE testing_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitoring_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_integrations ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX idx_project_management_integrations_integration_id ON project_management_integrations(integration_id);
CREATE INDEX idx_version_control_integrations_integration_id ON version_control_integrations(integration_id);
CREATE INDEX idx_ci_cd_integrations_integration_id ON ci_cd_integrations(integration_id);
CREATE INDEX idx_documentation_integrations_integration_id ON documentation_integrations(integration_id);
CREATE INDEX idx_time_tracking_integrations_integration_id ON time_tracking_integrations(integration_id);
CREATE INDEX idx_file_storage_integrations_integration_id ON file_storage_integrations(integration_id);
CREATE INDEX idx_hr_integrations_integration_id ON hr_integrations(integration_id);
CREATE INDEX idx_ticketing_integrations_integration_id ON ticketing_integrations(integration_id);
CREATE INDEX idx_analytics_integrations_integration_id ON analytics_integrations(integration_id);
CREATE INDEX idx_design_integrations_integration_id ON design_integrations(integration_id);
CREATE INDEX idx_testing_integrations_integration_id ON testing_integrations(integration_id);
CREATE INDEX idx_monitoring_integrations_integration_id ON monitoring_integrations(integration_id);
CREATE INDEX idx_security_integrations_integration_id ON security_integrations(integration_id);
CREATE INDEX idx_learning_integrations_integration_id ON learning_integrations(integration_id);
CREATE INDEX idx_marketing_integrations_integration_id ON marketing_integrations(integration_id);
CREATE INDEX idx_legal_integrations_integration_id ON legal_integrations(integration_id);
CREATE INDEX idx_finance_integrations_integration_id ON finance_integrations(integration_id);

-- Create RLS policies for new integration tables (inherit base integration access)
CREATE POLICY "Users can manage project management integrations in their organization" ON project_management_integrations
    FOR ALL USING (integration_id IN (
        SELECT id FROM integrations WHERE organization_id IN (
            SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can manage version control integrations in their organization" ON version_control_integrations
    FOR ALL USING (integration_id IN (
        SELECT id FROM integrations WHERE organization_id IN (
            SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can manage CI/CD integrations in their organization" ON ci_cd_integrations
    FOR ALL USING (integration_id IN (
        SELECT id FROM integrations WHERE organization_id IN (
            SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can manage documentation integrations in their organization" ON documentation_integrations
    FOR ALL USING (integration_id IN (
        SELECT id FROM integrations WHERE organization_id IN (
            SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can manage time tracking integrations in their organization" ON time_tracking_integrations
    FOR ALL USING (integration_id IN (
        SELECT id FROM integrations WHERE organization_id IN (
            SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can manage file storage integrations in their organization" ON file_storage_integrations
    FOR ALL USING (integration_id IN (
        SELECT id FROM integrations WHERE organization_id IN (
            SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can manage HR integrations in their organization" ON hr_integrations
    FOR ALL USING (integration_id IN (
        SELECT id FROM integrations WHERE organization_id IN (
            SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can manage ticketing integrations in their organization" ON ticketing_integrations
    FOR ALL USING (integration_id IN (
        SELECT id FROM integrations WHERE organization_id IN (
            SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can manage analytics integrations in their organization" ON analytics_integrations
    FOR ALL USING (integration_id IN (
        SELECT id FROM integrations WHERE organization_id IN (
            SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can manage design integrations in their organization" ON design_integrations
    FOR ALL USING (integration_id IN (
        SELECT id FROM integrations WHERE organization_id IN (
            SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can manage testing integrations in their organization" ON testing_integrations
    FOR ALL USING (integration_id IN (
        SELECT id FROM integrations WHERE organization_id IN (
            SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can manage monitoring integrations in their organization" ON monitoring_integrations
    FOR ALL USING (integration_id IN (
        SELECT id FROM integrations WHERE organization_id IN (
            SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can manage security integrations in their organization" ON security_integrations
    FOR ALL USING (integration_id IN (
        SELECT id FROM integrations WHERE organization_id IN (
            SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can manage learning integrations in their organization" ON learning_integrations
    FOR ALL USING (integration_id IN (
        SELECT id FROM integrations WHERE organization_id IN (
            SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can manage marketing integrations in their organization" ON marketing_integrations
    FOR ALL USING (integration_id IN (
        SELECT id FROM integrations WHERE organization_id IN (
            SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can manage legal integrations in their organization" ON legal_integrations
    FOR ALL USING (integration_id IN (
        SELECT id FROM integrations WHERE organization_id IN (
            SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can manage finance integrations in their organization" ON finance_integrations
    FOR ALL USING (integration_id IN (
        SELECT id FROM integrations WHERE organization_id IN (
            SELECT organization_id FROM user_organizations WHERE user_id = auth.uid()
        )
    ));
