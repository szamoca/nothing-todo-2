# Project Advanced Coding Rules (Non-Obvious Only)

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

## API Server Routes

- Server routes in `server/api/` proxy to DummyJSON API via `config.public.apiBaseUrl`
- DummyJSON simulates create/update/delete but doesn't persist - implement optimistic updates
- Auth validation: Call `/api/auth/me` internally with `Authorization` header to verify user
- Error handling: Catch `FetchError` from ofetch, re-throw as Nuxt `createError` with status codes
- Pagination: Use limit/skip parameters for todo lists

## Code Style Enforcement

- Must use `type` imports (enforced by `typescript/consistent-type-imports`)
- Vue props: type-based declaration only (no runtime props)
- No exports in `<script setup>` blocks
- Console: Only `console.warn` and `console.error` allowed
- Linter: oxlint (not ESLint), formatter: oxfmt (not Prettier)

### Vue File Block Order Convention

- **Preferred order**: `<script>` → `<template>` → `<style>` blocks in Vue SFCs
- **Note**: This order is a project convention but is **not enforced by oxlint**
  - oxlint's Vue plugin does not currently support a `block-order` rule (unlike ESLint's eslint-plugin-vue)
  - Developers should manually follow this convention when creating or modifying Vue files
  - Code reviews should check for proper block ordering

## Internationalization (i18n)

- **Translation format**: Always use `$t()` for all user-facing strings in Vue templates
  - Example: `{{ $t("This is a minimal todo app.") }}`
  - Use this format even if the translation key doesn't exist in `i18n/locales/*.json` files yet
  - This demonstrates production-ready i18n intent and makes it clear to reviewers that translations are intended everywhere
- **Locale files**: Translation files are located in `i18n/locales/` directory
- **Strategy**: Project uses `no_prefix` strategy with cookie-based locale detection

## TypeScript

- `verbatimModuleSyntax` enabled - affects import/export syntax
- Project references split across `.nuxt/tsconfig.*.json` files
- Types: Derive from DummyJSON responses, place in `shared/types/`
- All API calls must have typed responses

## Vue 3 / Nuxt 4 Best Practices

- Use Composition API with `<script setup>`
- Leverage auto-imports for composables and components
- Follow Nuxt 4 folder structure conventions
- Use `useFetch` or `$fetch` for API calls (not axios)
- Implement proper loading and error states
- Use `definePageMeta` for page-level configuration

## SCSS Architecture

- Main styles in `app/assets/styles/main.scss`
- Use SCSS features: variables, mixins, nesting
- Follow BEM or similar naming convention
- Ensure responsive design with mobile-first approach

## Tools Available

- MCP servers and Browser tools are accessible in this mode
- Use browser_action for testing UI functionality and responsiveness
- Use Carbon MCP for design system guidance if needed

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