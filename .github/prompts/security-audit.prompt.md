---
agent: ask
---

Perform a security audit of the codebase. Identify potential vulnerabilities, insecure coding practices, and areas that may require additional security measures. 

Output your findings as a markdown formatted table with the follow columns(ID should start at 1 and auto increment, File Path should be an actual link to the file): "ID", "Severity", "Issue", "File Path", "Line Number", and "Recommendation".

Next, ask the user which issues they want to fix either replying "all", or a comman separated list of IDs. AFter their reply, run a separate sub agent (#runSubagent) to fix each issue that the user has specified. Each sub agent should report back with a simple 'subAgentSuccess: true | false'.