# Phase 3: Project Feed + Detail Data Wiring

This plan covers connecting the `Projects` feed, `ProjectDetail` page, and user's `Studio`/`Profile` pages to real Supabase data via a new backend API wrapper.

> [!IMPORTANT]
> **User Review Required: Supabase SQL Execution**
> Before I proceed with code changes, the SQL script provided in Section 1 of the prompt must be executed in your Supabase SQL Editor. This will create the necessary `projects`, `project_files`, `upvotes`, `saved_projects`, `comments`, and associated tables, along with Row Level Security (RLS) policies and RPC functions. **Please confirm when you have executed the schema.**

## Proposed Changes

### Database Layer

#### [NEW] `database_schema.sql` (for your reference)
I will provide the schema script as a file in the workspace or you can copy-paste it directly from your prompt. Let me know if you need me to save it as a local file for easier copying.

---

### Backend API Layer

#### [NEW] [projects.js](file:///c:/Users/DELL/Desktop/ArcHive/src/lib/projects.js)
Create the `projects.js` helper file as requested in Section 2. It will contain all the necessary Supabase RPC calls:
- `getProjectsFeed`, `getProject`
- `createProject`, `updateProject`, `publishProject`, `deleteProject`
- `uploadProjectFile`, `setCoverImage`, `deleteProjectFile`
- `toggleUpvote`, `toggleSave`, `forkProject`, `recordView`
- `getComments`, `addComment`, `deleteComment`, `toggleCommentLike`
- `getCollections`, `createCollection`, `getSavedProjects`
- `getUserProjects`, `getPinnedProjects`

---

### UI Components (Data Binding)

#### [MODIFY] [Projects.jsx](file:///c:/Users/DELL/Desktop/ArcHive/src/pages/Projects.jsx)
- Import `getProjectsFeed`, `toggleUpvote`, `toggleSave` from `projects.js`.
- Replace `mockProjects` with state variables (`projects`, `loading`, `total`, `activeFilter`, `activeSort`, `page`).
- Implement `fetchProjects` on mount and when filters change.
- Implement infinite scroll with an IntersectionObserver on a sentinel div.
- Implement skeleton loaders for loading states.
- Map the retrieved Supabase data to the existing Project Cards.
- Implement optimistic upvote and save toggles using `toggleUpvote` and `toggleSave`.

#### [MODIFY] [ProjectDetail.jsx](file:///c:/Users/DELL/Desktop/ArcHive/src/pages/ProjectDetail.jsx)
- Import `getProject`, `recordView`, `getComments`, `addComment`, etc., from `projects.js`.
- Replace the mock data query with `getProject({ repoName, username, firebaseUid })`.
- Fire `recordView(project.id, firebaseUser.uid)`.
- Fetch comments and build the threaded comment tree using a `buildCommentTree` helper function.
- Map all real data (cover image, stats, author details, structural tags, and description) to the UI.
- Wire up the Save and Upvote buttons to the real API instead of local storage.
- Wire up the Fork button to call `forkProject`.
- Replace the static Related Projects with a call to `getProjectsFeed` filtered by category.
- Render dynamic comments and replies, with support for adding and deleting comments.

#### [MODIFY] [Profile.jsx](file:///c:/Users/DELL/Desktop/ArcHive/src/pages/Profile.jsx)
- Implement `getUserProjects` or `getProjectsFeed` depending on whether it is the user's own profile.
- Implement `getPinnedProjects` for the Overview tab.
- Update the Saved tab to use `getCollections` and `getSavedProjects`.

#### [MODIFY] [Studio.jsx](file:///c:/Users/DELL/Desktop/ArcHive/src/pages/Studio.jsx)
- Update Dashboard: Fetch `getUserProjects`. Update the Stats Strip and Sidebar counts dynamically based on fetched repos.
- Update New Repo Wizard (Step 3: Publish): Call `createProject`, iterate through and upload `queuedFiles` with `uploadProjectFile`, then `publishProject` and redirect to the editor workspace.

## Verification Plan

### Manual Verification
1. Open the Supabase console to confirm that RPCs and tables exist.
2. Sign in to ArcHive.
3. Open Studio, create a new repository, fill out details, and attach a file. Check that `projects` and `project_files` populate in Supabase, and Cloudinary receives the image.
4. Go to `/projects` and confirm the new project appears in the feed.
5. Click Upvote and Save; ensure numbers increment and persist across page reloads.
6. Click into the project (`/projects/:author/:repo`) to view the details, post a comment, and reply to it.
7. Verify forks create a new private draft repo under your user.
