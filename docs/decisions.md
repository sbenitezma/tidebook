# Decisions

One line per decision, with its reason.

- **Nx targets inferred from `package.json` scripts** instead of Nx generators and executors: fewer moving parts, each package stays runnable with plain npm, Nx still adds caching, the project graph and `affected`.
- **Libraries consumed from source** (`exports` points to `src/index.ts`): Vite and Vitest compile TS directly, so there is no library build step to keep in sync.
- **TypeScript 6.0** rather than 7.0: `typescript-eslint` supports TS up to 6.0 today; upgrade when it supports 7.
- **ESLint 10 flat config at the root**, shared by every package; Prettier handles formatting (`eslint-config-prettier` turns off conflicting rules).
- **npm `overrides` for `undici`**: Nx pulls a version with known advisories; pinning the patched minor keeps `npm audit` clean without forcing installs.
- **`libs/core` has no `DOM` lib in its tsconfig**: the compiler guarantees the business logic never touches the browser.
