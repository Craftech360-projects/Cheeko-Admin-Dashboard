Requirements for Cheeko AI Toy Admin Dashboard.
This document outlines the requirements for an admin dashboard for the Parental mobile app. The dashboard will be used for internal management of toys, users, and application data.

The dashboard should be built with Next.js and use Supabase as the backend for data and authentication.

Core Technologies:
• Framework: Next.js (App Router)
• Backend & DB: Supabase
• Styling: Use a modern component library like Shadcn/UI or MUI to ensure a clean, consistent, and responsive UI.
• State Management: Use a robust solution for managing server state, such as React Query (@tanstack/react-query), to handle data fetching, caching, and mutations efficiently.

1. Admin Authentication:
Implement a secure login page (/login) for administrators.

Authentication should be handled via Supabase Auth, preferably with email and password.

The main dashboard content and routes must be protected, redirecting any unauthenticated users back to the login page.

2. Dashboard UI & Structure:
The dashboard should have a clean, data-centric layout.

Use a sidebar for navigation between the different data sections (Toys, Users, Bugs, etc.).

The main content area will display data tables for the selected section.

Each data table should support sorting, filtering, and pagination.

For each section, there must be clear UI elements (e.g., buttons, modals) for Create, Update, and Delete operations.

3. Data Management Sections:
The core of the dashboard will be managing data from various Supabase tables. Full CRUD (Create, Read, Update, Delete) functionality is required for all records in the following sections.

3.1 All Toys
Purpose: Display and manage every toy registered in the system, active or not.

Supabase Table: public.mqtt_auth

UI: A table view displaying columns for mac_id, is_active, created_at, and activation_code. The password_hash should not be displayed directly.

Operations:

Create: A form to add a new toy entry (generate mac_id, password_hash, activation_code).

Update: Edit details for an existing toy, especially the is_active status.

Delete: Remove a toy record.

3.2 Activated Toys
Purpose: Display and manage detailed profiles for toys that have been activated and are associated with a user.

Supabase Table: public.toys

UI: A table view displaying key columns like name, kid_name, user_id, toy_mac_id, role_type, language, and activation_code. A "View/Edit" button should open a detailed view or modal.

Operations:

Create: Manually create a new toy profile.

Update: Edit all fields of a toy's profile, including name, kid_age, additional_instructions, etc.

Delete: Remove a toy profile.

3.3 Parent Profiles
Purpose: Display and manage parent user profiles.

Supabase Table: public.parent_profiles

UI: A table displaying parent_name, parent_email, parent_phone_number, and the associated user_id.

Operations:

Create: Manually add a new parent profile.

Update: Edit a parent's contact details.

Delete: Remove a parent's profile.

3.4 Login History
Purpose: Monitor user login activity for security and diagnostic purposes.

Supabase Table: public.login_history

UI: A table displaying user_id, login_time, ip_address, location, device_info, and is_suspicious. The table should be sorted by login_time (descending) by default.

Operations:

Update: Allow an admin to flag or un-flag a login as is_suspicious.

Delete: Remove login history records (e.g., for data privacy compliance).

Note: Creating login records manually is not a primary requirement.

3.5 Bugs Reported
Purpose: Track and manage bugs reported by users through the app.

Supabase Table: public.bugs_reported

UI: A table displaying title, user_id, severity, status, and created_at.

Operations:

Update: This is the most critical operation. An admin must be able to change the status (e.g., from 'open' to 'in_progress' or 'resolved') and the severity of a bug report.

Delete: Remove spam or irrelevant bug reports.

Note: Creating bug reports from the dashboard is a low priority but could be useful.

4. Code and Project Structure
Folder Structure: Organize the code logically (e.g., /app, /components, /lib/supabase, /hooks).

Data Access: Create a centralized place (e.g., in /lib/supabase) for Supabase client initialization and data access functions.

Reusable Components: Build generic, reusable components for UI elements like data tables, forms, modals, and buttons to maintain consistency.

Logging: Use a proper logger for client-side and server-side actions, not console.log.