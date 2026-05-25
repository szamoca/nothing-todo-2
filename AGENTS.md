# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Requirement Clarification Protocol

**CRITICAL: Do not assume or jump into implementation early if requirements are unclear.**

Before starting any implementation work, agents must:

1. **Analyze the request thoroughly** - Identify any ambiguities, missing details, or assumptions that need validation
2. **Initiate a clarification session** - Ask targeted questions to gather all necessary information
3. **Continue questioning** - Keep asking follow-up questions until every detail is clear and well-defined
4. **Confirm understanding** - Summarize the requirements and get explicit confirmation before proceeding
5. **Only then implement** - Begin coding only after all requirements are crystal clear

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

Instead of immediately implementing "add a search feature":
1. What should be searchable? (todo titles, descriptions, both?)
2. Should search be real-time or triggered by a button?
3. Should it filter the current page or search across all todos?
4. What should happen when no results are found?
5. Should search state persist across page navigation?

Only after these details are clear should implementation begin.

## Project Overview

Production-style Todo application built with Nuxt 4, Vue 3 Composition API, TypeScript, and SCSS. Integrates with DummyJSON API for todo operations with local state management for simulated persistence.

## Build & Test Commands

- Run single test file: `npm run test:unit test/unit/example.test.ts` or `npm run test:nuxt test/nuxt/component.test.ts`
- Run all tests: `npm run test`
- Lint: `npm run lint` (oxlint)
- Format: `npm run format` (oxfmt)

## Code Style (Non-Obvious)

- **Formatting**: Uses tabs (not spaces), 160 char line width, single quotes, trailing commas
- **Linter**: oxlint/oxfmt (not ESLint/Prettier)
- **Imports**: Must use `type` imports via `typescript/consistent-type-imports` rule
- **Vue**: Props must use type-based declaration (not runtime), no exports in `<script setup>`
- **Unused vars**: Ignore patterns `^(_|instance)` for args, `^(prop|pending|key)$` for vars
- **Console**: Only `console.warn` and `console.error` allowed (no `console.log`)

## Testing Setup

- **Two projects**: `unit` (node env, test/unit/) and `nuxt` (nuxt env with happy-dom, test/nuxt/)
- **Nuxt tests**: Use `mountSuspended` from `@nuxt/test-utils/runtime` for components
- **Coverage**: Enabled by default with v8 provider
- **Testing Library principles**: Follow [@testing-library/vue](https://testing-library.com/docs/vue-testing-library/intro/) guidelines
  - Use accessible selectors (getByRole, getByLabelText, etc.) whenever possible
  - One top-level describe block allowed for clarity, no nested describes
  - Focus on user behavior, not implementation details
  - Avoid testing internal component state or methods

## Project Structure (Nuxt 4 Best Practices)

- **Types**: Derive from DummyJSON responses, place in `shared/types/` directory
- **Composables**: API/data logic in `composables/` (auto-imported)
- **Components**: Reusable UI components in `components/` (auto-imported)
- **Server routes**: API proxies in `server/api/` following Nuxt file-based routing
- **Styles**: SCSS architecture in `app/assets/styles/`
- **i18n locales**: Located in `i18n/locales/` (not typical `locales/` or `lang/` directories)

## API Integration Patterns

- **DummyJSON API**: Base URL configured via `NUXT_PUBLIC_API_BASE_URL` (defaults to https://dummyjson.com)
- **Server proxy pattern**: All routes in `server/api/` proxy to external DummyJSON API
- **Simulated persistence**: DummyJSON doesn't persist create/update/delete operations
  - Handle gracefully with local UI state management
  - Optimistic updates for better UX
  - Sync local state with API responses
- **Auth flow**: Bearer token via `Authorization` header, validated by `/api/auth/me` internally
- **Error handling**: Catch `FetchError` from ofetch, re-throw as Nuxt `createError` with status codes
- **Pagination**: Handle paginated todo lists with limit/skip parameters

## TypeScript Patterns

- **Type derivation**: Derive types from DummyJSON API responses, don't manually define
- **Typed API responses**: All API calls must have proper TypeScript interfaces
- **Project references**: Split across `.nuxt/tsconfig.*.json` files
- **Module syntax**: `verbatimModuleSyntax` enabled - affects import/export syntax

## Todo App Features

- View paginated list of todos
- Toggle todo completion status
- Add new todos
- Delete todos
- Handle loading, empty, and error states
- Responsive layout
- Form validation for new todos

## Production Expectations

- Clear folder structure following Nuxt 4 conventions
- Reusable components with proper TypeScript typing
- Composables for API/data logic separation
- Runtime config for API base URL
- Environment variable examples in `.env.example`
- Basic error handling with user-friendly messages
- Form validation with clear feedback
- Responsive SCSS architecture
- Husky pre-commit hooks for quality checks

## Visual Direction & UI Design

When working on UI components, follow this editorial-industrial aesthetic:

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