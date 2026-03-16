# Contributing

## Development Setup

### Prerequisites

- Node.js 24+ (see `package.json` engines field)
- pnpm 10.32.1+

### Installation

```bash
pnpm install
```

**NixOS Users:** The Biome binary needs to be patched after installation. This is handled automatically by the `flake.nix` shell hook, or you can run:

```bash
patchelf --set-interpreter "$(cat $NIX_CC/nix-support/dynamic-linker)" node_modules/.pnpm/@biomejs+cli-linux-x64@*/node_modules/@biomejs/cli-linux-x64/biome
```

## Development Commands

**Building:**
- `pnpm build` - Build the library for production
- `pnpm dev` - Build in watch mode for development

**Testing:**
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

## Tooling

**Core:**
- TypeScript 5.9+ - Type safety
- tsup - Fast bundler built on esbuild
- Biome - Ultra-fast linting and formatting
- Vitest - Fast, modern test framework
- pnpm - Fast, disk space efficient package manager

**Quality:**
- simple-git-hooks + lint-staged - Pre-commit checks
- publint - Package validation
- @arethetypeswrong/cli - TypeScript types validation
- size-limit - Bundle size monitoring
- changesets - Versioning and changelog generation

## Making Changes

1. Create a feature branch
2. Make your changes
3. Run `pnpm check` to ensure all tests pass
4. Create a changeset: `pnpm changeset`
5. Commit your changes (pre-commit hooks will auto-format)
6. Open a pull request

## Release Process

This project uses manual publishing with Changesets for versioning.

### Publishing a Release

1. **Create a changeset** when making changes:
   ```bash
   pnpm changeset
   ```
   Select the version bump type (major/minor/patch) and describe your changes.

2. **Commit the changeset** along with your code changes.

3. **When ready to release:**
   ```bash
   # Update version and changelog
   pnpm changeset version
   
   # Review the changes to package.json and CHANGELOG.md
   git add .
   git commit -m "chore: release vX.Y.Z"
   git push
   
   # Build and publish
   pnpm build
   npm login  # if not already logged in
   npm publish --access public
   ```

### Automated Publishing (Optional)

The release workflow is available but currently disabled. To enable:

1. Uncomment the trigger in `.github/workflows/release.yml`
2. Enable GitHub Actions PR creation (Settings → Actions → General)
3. Add `NPM_TOKEN` secret (Settings → Secrets and variables → Actions)

Then merging to main will automatically create "Version Packages" PRs that publish when merged.

## CI/CD

Pull requests run the following checks:
- Format checking
- Linting
- Type checking
- Tests
- Build validation
- Package validation (publint + attw)
- Changeset status

All checks must pass before merging.
