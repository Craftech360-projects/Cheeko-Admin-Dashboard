# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Cheeko AI Toy Admin Dashboard - a Next.js application for managing toys, users, and application data for a parental mobile app. The dashboard provides full CRUD operations for managing toy registrations, user profiles, and bug reports.

## Core Technologies

- **Framework**: Next.js with App Router
- **Backend & Database**: Supabase (authentication, database, real-time)
- **Styling**: Shadcn/UI or Material-UI for consistent, responsive design
- **State Management**: React Query (@tanstack/react-query) for server state management
- **Authentication**: Supabase Auth with email/password

## Common Development Commands

```bash
# Development server (with Turbopack)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Linting
npm run lint

# Install additional Shadcn/UI components
npx shadcn@latest add [component-name]
```

## Project Architecture

### Folder Structure
```
/app                    # Next.js App Router pages and layouts
/components            # Reusable UI components
  /ui                 # Base UI components (buttons, forms, tables)
  /data-tables        # Specialized table components for each data type
  /modals            # Modal components for CRUD operations
/lib
  /supabase          # Supabase client and data access functions
  /utils             # Utility functions
/hooks               # Custom React hooks
/types               # TypeScript type definitions
```

### Data Management Sections

The dashboard manages five main data sections, each requiring full CRUD operations:

1. **All Toys** (`public.mqtt_auth` table)
   - Fields: mac_id, is_active, created_at, activation_code
   - Focus on toy registration and activation status

2. **Activated Toys** (`public.toys` table)
   - Fields: name, kid_name, user_id, toy_mac_id, role_type, language, activation_code
   - Detailed toy profiles with user associations

3. **Parent Profiles** (`public.parent_profiles` table)
   - Fields: parent_name, parent_email, parent_phone_number, user_id
   - User contact and profile management

4. **Login History** (`public.login_history` table)
   - Fields: user_id, login_time, ip_address, location, device_info, is_suspicious
   - Security monitoring and diagnostics
   - Primary operations: Update (flag suspicious), Delete

5. **Bugs Reported** (`public.bugs_reported` table)
   - Fields: title, user_id, severity, status, created_at
   - Bug tracking and status management
   - Critical operation: Status updates (open → in_progress → resolved)

### Key Architectural Patterns

1. **Protected Routes**: All dashboard routes require authentication, with automatic redirect to `/login` for unauthenticated users

2. **Data Tables**: Each section uses consistent table components with:
   - Sorting and filtering capabilities
   - Pagination for large datasets
   - Inline edit/delete actions
   - Bulk operations where appropriate

3. **Centralized Data Access**: All Supabase operations should be centralized in `/lib/supabase` with:
   - Type-safe query builders
   - Error handling
   - Real-time subscriptions where needed

4. **Form Management**: Consistent form patterns for CRUD operations:
   - Validation using schema validation libraries
   - Loading states during mutations
   - Optimistic updates with React Query

### Security Considerations

- Never display sensitive data like `password_hash` in UI
- Implement proper role-based access controls
- Log administrative actions for audit trails
- Use proper logging instead of console.log statements
- Validate all user inputs on both client and server side

### Development Guidelines

- Build reusable components for common patterns (data tables, forms, modals)
- Use TypeScript for type safety across the application
- Implement proper error boundaries and loading states
- Follow Next.js best practices for performance optimization
- Ensure responsive design across all screen sizes