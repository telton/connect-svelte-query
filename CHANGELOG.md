# @telton/connect-svelte-query

## 0.0.4

### Minor Changes

- Add ergonomic service method syntax and fix lifecycle error

  ### New Features

  - **Ergonomic syntax**: `createMutation` and `createQuery` now accept service and method name as separate arguments

    ```typescript
    // New (recommended)
    const mutation = createMutation(AuthService, "login");
    const query = createQuery(UserService, "getUser", () => ({ id: 1 }));

    // Old syntax still works
    const mutation = createMutation(AuthService.method.login);
    const query = createQuery(UserService.method.getUser, () => ({ id: 1 }));
    ```

  ### Bug Fixes

  - **CRITICAL**: Fixed `lifecycle_outside_component` error by deferring `useTransport()` call to reactive evaluation time. This allows `createMutation` and `createQuery` to be called at the top level of component scripts without errors.

## Unreleased

### Minor Changes

- **New ergonomic syntax**: Added support for passing service and method name directly to `createQuery` and `createMutation`

  ```typescript
  // New (recommended)
  const query = createQuery(UserService, "getUser", () => ({ id: 1 }));
  const mutation = createMutation(AuthService, "login");

  // Old (still supported)
  const query = createQuery(UserService.method.getUser, () => ({ id: 1 }));
  const mutation = createMutation(AuthService.method.login);
  ```

### Patch Changes

- **CRITICAL FIX**: Fixed `lifecycle_outside_component` error by deferring `useTransport()` call to reactive evaluation time
- Both `createQuery` and `createMutation` now work correctly when called in component `<script>` blocks

## 0.0.3

### Patch Changes

- f3b3194: update README.md

## 0.0.2

### Patch Changes

- 65219f9: Add complete publishing infrastructure with automated release workflow, git hooks, package validation, and bundle size tracking
