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

- `pnpm build` - Build the library for production
- `pnpm dev` - Build in watch mode for development
- `pnpm test` - Run tests once
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:ui` - Run tests with Vitest UI
- `pnpm test:coverage` - Run tests with coverage report
- `pnpm lint` - Check for linting issues
- `pnpm lint:fix` - Fix linting issues automatically
- `pnpm format` - Check code formatting
- `pnpm format:fix` - Format code automatically
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm check` - Run all checks (lint, format, typecheck, test)

### Tooling

This project uses modern 2026 tooling:

- **TypeScript 5.9+** - Type safety
- **tsup** - Fast bundler built on esbuild
- **Biome** - Ultra-fast linting and formatting (replaces ESLint + Prettier)
- **Vitest** - Fast, modern test framework
- **pnpm** - Fast, disk space efficient package manager

## Publishing Roadmap

When ready to publish, we'll need to set up:

- [ ] **Git hooks** - Pre-commit hooks with `simple-git-hooks` + `lint-staged`
- [ ] **Package validation** - Add `publint` and `@arethetypeswrong/cli` to catch publishing issues
- [ ] **Versioning & Changelogs** - Set up `changesets` for semantic versioning
- [ ] **CI/CD** - GitHub Actions for automated testing and publishing
- [ ] **Bundle size tracking** - Add `size-limit` to monitor package size

## License

ISC
