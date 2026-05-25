# Project Architecture Rules (Non-Obvious Only)

## Requirement Clarification Protocol

**CRITICAL: Do not assume or jump into implementation early if requirements are unclear.**

Before starting any planning work, agents must:

1. **Analyze the request thoroughly** - Identify any ambiguities, missing details, or assumptions that need validation
2. **Initiate a clarification session** - Ask targeted questions to gather all necessary information
3. **Continue questioning** - Keep asking follow-up questions until every detail is clear and well-defined
4. **Confirm understanding** - Summarize the requirements and get explicit confirmation before proceeding
5. **Only then plan** - Begin planning only after all requirements are crystal clear

### When to Ask Questions

Ask clarifying questions when:
- The user's request is vague or open-ended
- Multiple implementation approaches are possible
- Technical details are missing (API endpoints, data structures, validation rules, etc.)
- UI/UX specifics are unclear (layout, interactions, styling preferences)
- Edge cases or error handling scenarios are not defined
- Dependencies or integration points are ambiguous
- Performance or scalability requirements are not specified

### How to Ask Questions

- Use the `ask_followup_question` tool to gather information
- Ask specific, targeted questions rather than generic ones
- Provide context for why the information is needed
- Offer multiple-choice suggestions when appropriate to speed up responses
- Group related questions together logically
- Prioritize questions that unblock the most critical decisions

### Example Question Flow

Instead of immediately planning "add a search feature":
1. What should be searchable? (todo titles, descriptions, both?)
2. Should search be real-time or triggered by a button?
3. Should it filter the current page or search across all todos?
4. What should happen when no results are found?
5. Should search state persist across page navigation?

Only after these details are clear should planning begin.

## Project Purpose

Production-style Todo application demonstrating Nuxt 4 and Vue 3 best practices. Focus on structure, configuration, and production-ready patterns rather than complex features.

## API Architecture

- **Proxy pattern**: Server routes in `server/api/` are proxies to DummyJSON API, not direct implementations
- **External API**: DummyJSON configured via `NUXT_PUBLIC_API_BASE_URL` (defaults to https://dummyjson.com)
- **Simulated persistence**: DummyJSON doesn't persist create/update/delete operations
  - Implement optimistic UI updates
  - Maintain local state for added/modified/deleted todos
  - Sync with API responses for consistency
- **Auth flow**: Two-step validation - external login, then internal `/api/auth/me` verification for protected routes
- **Error propagation**: FetchError from ofetch must be caught and re-thrown as Nuxt createError
- **Pagination**: Implement with limit/skip parameters for todo lists

## Application Architecture

This project follows Nuxt 4 conventions with a specific directory structure. See the detailed "Nuxt 4 Directory Structure" section below for complete information about where to place files.

Key architectural points:
- **All application code** must be in the `app/` directory
- **Type system**: Derive types from DummyJSON API responses, place in `shared/types/`
- **Composables**: Separate API/data logic from components in `app/composables/`
  - Todo CRUD operations
  - State management for local changes
  - Loading and error state handling
- **Components**: Reusable, typed UI components in `app/components/`
  - TodoList, TodoItem, TodoForm
  - Loading, Empty, Error states
- **Styling**: SCSS architecture in `app/assets/styles/` with variables, mixins, responsive design

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

## Testing Architecture

- **Dual test environments**: Separate vitest projects for unit (node) and nuxt (happy-dom) tests
- **Test isolation**: Unit tests in `test/unit/`, Nuxt component tests in `test/nuxt/`
- **Component mounting**: Nuxt tests require `mountSuspended` from `@nuxt/test-utils/runtime`
- **Testing Library principles**: Follow [@testing-library/vue](https://testing-library.com/docs/vue-testing-library/intro/)
  - Use accessible selectors (getByRole, getByLabelText, getByText)
  - One top-level describe block allowed for clarity
  - No nested describe blocks
  - Test user behavior, not implementation details
  - Avoid testing internal state or methods

## TypeScript Architecture

- **Project references**: Uses TypeScript project references split across `.nuxt/tsconfig.*.json` files
- **Module syntax**: `verbatimModuleSyntax` enabled - affects how imports/exports are handled
- **Type imports**: Must use `type` imports (enforced by linter)
- **Type derivation**: Derive all types from DummyJSON API responses
- **Typed responses**: All API calls must have proper TypeScript interfaces

## i18n Architecture

- **Strategy**: `no_prefix` - no locale prefix in URLs
- **Detection**: Cookie-based (`i18n_redirected` cookie) with browser language detection
- **Locale files**: Located in `i18n/locales/` directory

## Internationalization (i18n)

- **Translation format**: Always use `$t()` for all user-facing strings in Vue templates
  - Example: `{{ $t("This is a minimal todo app.") }}`
  - Use this format even if the translation key doesn't exist in `i18n/locales/*.json` files yet
  - This demonstrates production-ready i18n intent and makes it clear to reviewers that translations are intended everywhere
- **Locale files**: Translation files are located in `i18n/locales/` directory
- **Strategy**: Project uses `no_prefix` strategy with cookie-based locale detection

## Quality Assurance

- **Linting**: oxlint (not ESLint)
- **Formatting**: oxfmt (not Prettier)
- **Pre-commit hooks**: Husky configured for automated checks
- **Environment config**: `.env.example` with all required variables
- **Error handling**: User-friendly error messages
- **Form validation**: Clear validation feedback

## Todo App Features

- View paginated list of todos
- Toggle todo completion status
- Add new todos with validation
- Delete todos
- Handle loading states
- Handle empty states
- Handle error states
- Responsive layout (mobile-first)

## Visual Direction & UI Design

When planning UI components, follow this editorial-industrial aesthetic:

### Core Style
- Use a strict underlying grid, but place some cards in offset or staggered positions for a curated, spatial feel
- Composition should feel modular, graphic, and deliberate—like tiles on a paper grid
- Preserve strong alignment overall; offsets should feel intentional, not messy

### Layout Rules
- Avoid standard centered dashboard layouts and perfectly even card grids
- Use asymmetric balance: some todo cards may span 2 columns, some may sit alone in negative space, some may appear offset vertically
- Keep generous whitespace around sections and let the layout breathe
- Components should look like panels placed on a design board, not playful widgets

### Typography
- Use large, bold, high-contrast headings as graphic anchors
- Prefer short labels, crisp metadata, and minimal explanatory copy
- Typography should feel assertive and spacious, not friendly or bubbly

### Color
- Base UI should be mostly neutral or muted
- Use one dominant accent color and at most one supporting accent
- Apply accent colors strategically to buttons, tags, active states, highlights, and selected cards
- Avoid gradient-heavy or rainbow UI

### Surfaces and Texture
- Use a subtle dotted-grid or square-paper background texture across the canvas or in large sections
- Keep the texture faint and architectural, like technical paper or printed layout paper
- Cards should sit clearly above the background with clean contrast

### Components
- Todo cards should feel like modular tiles or printed index cards pinned onto a structured grid
- Use sharp or lightly rounded corners, not overly soft pill shapes
- Favor flat or lightly elevated surfaces over glossy, soft, toy-like styling
- Keep icons minimal and functional
- Focus on accessibility and reusability

### Interaction Tone
- Interactions should feel precise and calm
- Use subtle motion: fade, slide, or snap
- Avoid bouncy, elastic, cartoon-like animations

### Explicitly Avoid
- Do not make the UI cute, playful, bubbly, whimsical, or childlike
- Do not use oversized rounded pills everywhere
- Do not use pastel palettes, candy colors, or soft gradient backgrounds
- Do not make all cards identical in size and perfectly evenly distributed
- Do not default to generic SaaS dashboard aesthetics

### Style System Approach
- Keep styles minimal—not a Tailwind replacement, just enough utilities for a nice UI
- Expected components: pagination, button, text input, todo tile with completion toggle, navbar
- No need for resets/styles for every HTML element
- Focus on the specific components needed for this application

### Keywords
editorial, industrial, modular, offset-grid, asymmetric, Swiss-inspired, spacious, graphic, technical-paper, restrained, bold, systematic