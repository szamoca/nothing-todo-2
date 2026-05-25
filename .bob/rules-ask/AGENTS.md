# Project Documentation Rules (Non-Obvious Only)

## Requirement Clarification Protocol

**CRITICAL: Do not assume or jump into providing answers if the question is unclear.**

Before providing documentation or answers, agents must:

1. **Analyze the question thoroughly** - Identify any ambiguities or missing context
2. **Initiate a clarification session** - Ask targeted questions to understand what information is truly needed
3. **Continue questioning** - Keep asking follow-up questions until the information need is clear
4. **Confirm understanding** - Summarize what you understand they're asking before providing the answer
5. **Only then answer** - Provide documentation or explanations only after the question is crystal clear

### When to Ask Questions

Ask clarifying questions when:
- The user's question is vague or open-ended
- Multiple interpretations of the question are possible
- The scope of the answer is unclear (high-level overview vs. detailed explanation)
- Context is missing (which part of the codebase, which feature, etc.)
- The user's goal or use case is not specified
- Technical level of the answer is unclear (beginner vs. advanced)

### How to Ask Questions

- Use the `ask_followup_question` tool to gather information
- Ask specific, targeted questions rather than generic ones
- Provide context for why the clarification is needed
- Offer multiple-choice suggestions when appropriate to speed up responses
- Group related questions together logically
- Prioritize questions that help narrow down the information need

### Example Question Flow

Instead of immediately answering "how does authentication work?":
1. Are you asking about the login flow, token validation, or session management?
2. Do you need a high-level overview or implementation details?
3. Are you trying to understand existing code or implement something new?
4. Which part of the auth system are you working with?

Only after these details are clear should the answer be provided.

## Project Overview

Production-style Todo application demonstrating Nuxt 4 and Vue 3 best practices with DummyJSON API integration. Focus is on project structure, configuration, and production-ready patterns.

## Project Structure

This project follows Nuxt 4 conventions with a specific directory structure. See the detailed "Nuxt 4 Directory Structure" section below for complete information about where to place files.

Key points:
- **All application code** must be in the `app/` directory
- **Types and utilities** go in `shared/` (auto-imported)
- **Server routes** go in `server/api/`
- **i18n locales** are in `i18n/locales/` (not typical `locales/` or `lang/` directories)
- **Test split**: `test/unit/` for node env, `test/nuxt/` for Nuxt-specific tests with happy-dom

## Nuxt 4 Directory Structure

**CRITICAL**: This project uses Nuxt 4's directory structure. All application code (components, composables, pages, layouts) MUST be placed inside the `app/` directory. Do NOT create root-level `composables/`, `components/`, or `pages/` directories.

### The `app/` Directory

The `app/` directory is the main application directory containing all client-side code:

- **`app/assets/`** - Static assets like styles, images, fonts
  - `app/assets/styles/` - SCSS architecture with variables, mixins, utilities
- **`app/components/`** - Vue components (auto-imported throughout the app)
  - Example: `app/components/NavigationBar.vue`
- **`app/composables/`** - Composables for shared logic (auto-imported throughout the app)
  - Example: `app/composables/useUser.ts`
  - **CRITICAL**: Composables go in `app/composables/`, NOT in a root-level `composables/` directory
- **`app/layouts/`** - Layout components for different page structures
  - Example: `app/layouts/default.vue`
- **`app/pages/`** - File-based routing pages
  - Example: `app/pages/index.vue`, `app/pages/todos/index.vue`
- **`app/app.vue`** - Root application component

### The `shared/` Directory

The `shared/` directory contains code that is auto-imported and accessible throughout the app:

- **`shared/types/`** - TypeScript type definitions (auto-imported)
  - Derive types from DummyJSON API responses
  - Example: `shared/types/todo.ts`, `shared/types/user.ts`
- **`shared/utils/`** - Utility functions (auto-imported)
  - Example: `shared/utils/api-client.ts`, `shared/utils/auth.ts`

### The `server/` Directory

The `server/` directory contains server-side code:

- **`server/api/`** - API route handlers following Nuxt file-based routing
  - Example: `server/api/todos/[id].put.ts`, `server/api/auth/login.post.ts`
  - All routes proxy to the external DummyJSON API

### Other Root-Level Directories

- **`i18n/locales/`** - Translation files for internationalization
  - Example: `i18n/locales/en.json`
- **`public/`** - Public static files served at the root
  - Example: `public/favicon.ico`, `public/robots.txt`
- **`test/`** - Test files
  - `test/unit/` - Unit tests (node environment)
  - `test/nuxt/` - Nuxt component tests (nuxt environment with happy-dom)

### Critical Reminders

- ✅ **DO**: Place composables in `app/composables/`
- ✅ **DO**: Place components in `app/components/`
- ✅ **DO**: Place pages in `app/pages/`
- ✅ **DO**: Place types in `shared/types/`
- ❌ **DON'T**: Create a root-level `composables/` directory
- ❌ **DON'T**: Create a root-level `components/` directory
- ❌ **DON'T**: Create a root-level `pages/` directory

## Internationalization (i18n)

- **Translation format**: Always use `$t()` for all user-facing strings in Vue templates
  - Example: `{{ $t("This is a minimal todo app.") }}`
  - Use this format even if the translation key doesn't exist in `i18n/locales/*.json` files yet
  - This demonstrates production-ready i18n intent and makes it clear to reviewers that translations are intended everywhere
- **Locale files**: Translation files are located in `i18n/locales/` directory
- **Strategy**: Project uses `no_prefix` strategy with cookie-based locale detection

## Configuration Context

- **API proxy**: All server routes proxy to DummyJSON API defined in `NUXT_PUBLIC_API_BASE_URL` env var
- **DummyJSON limitation**: Create/update/delete operations are simulated, not persisted
- **Auth pattern**: Internal auth validation via `/api/auth/me` endpoint (not external)
- **i18n strategy**: Uses `no_prefix` with cookie detection (`i18n_redirected` cookie)
- **TypeScript refs**: Project uses TypeScript project references in `.nuxt/tsconfig.*.json` files
- **Linting**: oxlint/oxfmt (not ESLint/Prettier)
- **Pre-commit hooks**: Husky configured for quality checks

## Testing Context

- **Two test environments**: Unit tests run in node, Nuxt tests run in nuxt environment with happy-dom
- **Nuxt component testing**: Must use `mountSuspended` from `@nuxt/test-utils/runtime`
- **Coverage**: v8 provider enabled by default
- **Testing Library principles**: Follow [@testing-library/vue](https://testing-library.com/docs/vue-testing-library/intro/)
  - Use accessible selectors (getByRole, getByLabelText, etc.)
  - One top-level describe block allowed, no nested describes
  - Test user behavior, not implementation details

## Todo App Features

- Paginated todo list view
- Toggle completion status
- Add new todos with validation
- Delete todos
- Loading, empty, and error state handling
- Responsive design

## Production Expectations

- Clear Nuxt 4 folder structure
- Reusable, typed components
- Composables for API logic separation
- Runtime config for API base URL
- Environment variable examples
- Error handling with user feedback
- Form validation
- Responsive SCSS architecture