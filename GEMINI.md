# Autonomous Direct Execution Rule

## Direct Execution Guidelines
- Proactively execute coding, refactoring, building, deploying, and verification tasks from start to finish without pausing for intermediate approvals.
- When a task is requested, research and implement the solution directly, running all required builds and tests to verify success.
- Present the final validated result and summary upon completion.
- Do not create blocking approval requests unless the user explicitly requests a preliminary design review or asks a clarifying question.

## Supabase Migrations & Table Access Guidelines
- When creating new tables in Supabase (migrations, SQL scripts, or schema changes in the `public` schema), always explicitly grant Data API permissions in the same migration file:
  - `grant select on public.<table_name> to anon;` (if public/anonymous access is needed)
  - `grant select, insert, update, delete on public.<table_name> to authenticated;` (for authenticated users)
  - `grant select, insert, update, delete on public.<table_name> to service_role;` (for service role / backend functions)
- Always enable and configure Row Level Security (RLS) policies alongside explicit table grants.
