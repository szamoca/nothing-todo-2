# Production-style todo application

A production-ready todo application built with Nuxt 4, Vue 3 Composition API, TypeScript, and SCSS, integrating with the DummyJSON API.

## Getting started

1. Install dependencies with your chosen package manager:
```bash
npm install
```

2. Create a `.env` file in the project root:
```bash
NUXT_PUBLIC_API_BASE_URL=https://dummyjson.com
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`, in case no other service reserves that port. See terminal output in such a case.

## Project goals

Build a production-style todo application demonstrating:
- Clean folder structure following Nuxt 4 conventions
- Reusable components with TypeScript
- Composables for API and data logic
- Typed API responses
- Runtime configuration
- Error handling and form validation
- Responsive SCSS architecture
- Linting and formatting setup

## What was achieved

### Core features
- View list of todos with completed and incomplete states
- Add new todos with form validation
- Toggle todo completion with optimistic updates
- Delete todos
- Loading, empty, and error state handling
- Responsive layout with editorial-industrial design

### Technical implementation
- Nuxt 4 with proper directory structure
- Vue 3 Composition API with `<script setup>`
- TypeScript with type checking
- SCSS architecture with variables, mixins, and utilities
- DummyJSON API integration via server proxy
- Authentication system with DummyJSON's JWT tokens (no signing, just for demo purposes)
- Internationalization support (i18n)
- Test setup with Vitest
- Code quality tools (oxlint, oxfmt, Stylelint, Husky)

## What's missing

- Pagination UI controls (metadata tracked but controls not implemented due to limited test data)

## Known issues

- Test setup prepared but no tests written yet
- Top-level `await` in NavigationBar and login page blocks rendering
- Direct state mutation in useTodos composable
- Duplicated auth guard logic across pages
- NavigationBar tightly coupled to useUser composable
- Limited component extraction (only NavigationBar exists)
- SCSS utilities contain unused classes
- Missing responsive typography scaling
- Component scoping conflicts in NavigationBar styles
- No dark mode support

## Available commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run oxlint
npm run format       # Run oxfmt
npm run test         # Run all tests
npm run test:unit    # Run unit tests
npm run test:nuxt    # Run Nuxt component tests
```
