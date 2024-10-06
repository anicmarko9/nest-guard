---
name: Bug report
about: Create a report to help us improve
title: 'bug: cache does not reset'
labels: bug
assignees: anicmarko9
---

# Bug Report

**Describe the bug**  
Provide a clear and concise description of what the issue is, focusing on the backend logic, API, database, or caching (Redis) functionality.

**To Reproduce**  
Steps to reproduce the behavior:

1. Send a request to the endpoint '...'
2. Use Postman/cURL with the following payload: '...'
3. Check the response or logs for the error.
4. (Optional) Inspect the database (PostgreSQL) or cache (Redis) to verify data inconsistency.

**Expected behavior**  
A clear and concise description of what you expected to happen. Include expected API responses, correct data handling, or proper cache behavior.

**Logs/Errors**  
If applicable, add error logs from the backend (e.g., Nest.js logs, PostgreSQL errors, Redis logs, etc.) to help explain the problem.

**Environment (please complete the following information):**

- Node.js Version: [e.g. 22.x]
- PostgreSQL Version: [e.g. 16.x]
- Redis Version: [e.g. 6.x]

**API Client Details (if applicable):**

- Tool: [e.g. Postman, cURL, Insomnia]
- Request Type: [e.g. GET, POST, PUT, PATCH, DELETE]
- Request Payload: Provide details about the request payload that caused the issue.

**Database/Caching Information (if applicable):**

- Affected Tables (PostgreSQL): [e.g. users, organizations]
- Cache Key/Value (Redis): [e.g. user:{id}, organization:{id}]

**Additional context**  
Add any other relevant information, such as recent code changes, external integrations, or deployment details.
