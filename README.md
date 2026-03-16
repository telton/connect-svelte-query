# connect-svelte-query

A library for integrating ConnectRPC with TanStack Query in Svelte applications.

## Development

### Prerequisites

- Node.js (see `.nvmrc` or `flake.nix` for version)
- pnpm 10.32.1+

### Setup

```bash
pnpm install
```

**NixOS Users:** The Biome binary needs to be patched after installation. This is handled automatically by the `flake.nix` shell hook, or you can manually run:

```bash
patchelf --set-interpreter "$(cat $NIX_CC/nix-support/dynamic-linker)" node_modules/.pnpm/@biomejs+cli-linux-x64@*/node_modules/@biomejs/cli-linux-x64/biome
```

### Available Scripts

**Development:**
- `pnpm build` - Build the library for production
- `pnpm dev` - Build in watch mode for development
- `pnpm test` - Run tests once
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:ui` - Run tests with Vitest UI
- `pnpm test:coverage` - Run tests with coverage report

**Code Quality:**
- `pnpm lint` - Check for linting issues
- `pnpm lint:fix` - Fix linting issues automatically
- `pnpm format` - Check code formatting
- `pnpm format:fix` - Format code automatically
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm check` - Run all checks (lint, format, typecheck, test)

**Package Validation:**
- `pnpm validate` - Validate package exports and types (publint + attw)
- `pnpm size` - Check bundle size limits

**Release:**
- `pnpm changeset` - Create a new changeset for versioning
- `pnpm version` - Apply changesets and bump version
- `pnpm release` - Build, validate, and publish to npm (CI only)

### Tooling

This project uses modern 2026 tooling:

**Core:**
- **TypeScript 5.9+** - Type safety
- **tsup** - Fast bundler built on esbuild
- **Biome** - Ultra-fast linting and formatting (replaces ESLint + Prettier)
- **Vitest** - Fast, modern test framework
- **pnpm** - Fast, disk space efficient package manager

**Quality & Publishing:**
- **simple-git-hooks** + **lint-staged** - Pre-commit checks
- **publint** - Package validation
- **@arethetypeswrong/cli** - TypeScript types validation
- **size-limit** - Bundle size monitoring
- **changesets** - Automated versioning and changelog generation

## Release Process

This project uses [Changesets](https://github.com/changesets/changesets) for automated versioning and publishing:

1. **Create a changeset** when making changes:
   ```bash
   pnpm changeset
   ```
   Select the version bump type (major/minor/patch) and describe your changes.

2. **Commit the changeset** along with your code changes.

3. **Open a PR** - CI will validate all checks including changeset status.

4. **Merge to main** - CI automatically creates a "Version Packages" PR.

5. **Merge Version PR** - CI automatically publishes to npm with provenance.

### Pre-releases

For alpha/beta releases, use changeset prerelease mode:
```bash
pnpm changeset pre enter alpha
pnpm changeset
# ... make your changes ...
pnpm changeset pre exit
```

## License

ISC
