# connect-svelte-query

A Svelte 5 adapter for integrating [ConnectRPC](https://connectrpc.com/) with [TanStack Query](https://tanstack.com/query). Provides type-safe hooks for queries and mutations that work seamlessly with Svelte's reactivity system.

## Installation

```bash
npm install @telton/connect-svelte-query @connectrpc/connect @tanstack/svelte-query
```

## Requirements

- Svelte 5+
- Node.js 24+

## Usage

### Setup Transport

First, set up your Connect transport in your root component:

```svelte
<script lang="ts">
  import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
  import { createConnectTransport } from '@connectrpc/connect-web';
  import { setTransport } from '@telton/connect-svelte-query';

  const transport = createConnectTransport({
    baseUrl: 'https://api.example.com',
  });

  setTransport(transport);

  const queryClient = new QueryClient();
</script>

<QueryClientProvider client={queryClient}>
  <slot />
</QueryClientProvider>
```

### Queries

Use `createQuery` to fetch data from unary RPC methods:

```svelte
<script lang="ts">
  import { createQuery } from '@telton/connect-svelte-query';
  import { getUser } from './gen/user_connect';

  let userId = $state(1);

  const query = createQuery(
    getUser,
    () => ({ id: userId }), // Input accessor for reactivity
  );
</script>

{#if query.isPending}
  <p>Loading...</p>
{:else if query.isError}
  <p>Error: {query.error.message}</p>
{:else}
  <p>User: {query.data.name}</p>
{/if}
```

The input must be wrapped in a function to maintain reactivity. When `userId` changes, the query automatically refetches.

### Skip Queries

Use `skipToken` to conditionally skip queries:

```svelte
<script lang="ts">
  import { createQuery, skipToken } from '@telton/connect-svelte-query';
  import { getUser } from './gen/user_connect';

  let userId = $state<number | undefined>(undefined);

  const query = createQuery(
    getUser,
    () => (userId !== undefined ? { id: userId } : skipToken),
  );
</script>
```

### Mutations

Use `createMutation` to call RPC methods that modify data:

```svelte
<script lang="ts">
  import { createMutation } from '@telton/connect-svelte-query';
  import { updateUser } from './gen/user_connect';

  const mutation = createMutation(updateUser);

  function handleSubmit(name: string) {
    mutation.mutate({ id: 1, name });
  }
</script>

<form onsubmit={(e) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  handleSubmit(formData.get('name') as string);
}}>
  <input name="name" />
  <button type="submit" disabled={mutation.isPending}>
    {mutation.isPending ? 'Saving...' : 'Save'}
  </button>
</form>

{#if mutation.isError}
  <p>Error: {mutation.error.message}</p>
{/if}
```

### Query Options

Pass additional TanStack Query options:

```svelte
<script lang="ts">
  import { createQuery } from '@telton/connect-svelte-query';
  import { getUser } from './gen/user_connect';

  const query = createQuery(
    getUser,
    () => ({ id: 1 }),
    () => ({
      staleTime: 5000,
      refetchInterval: 10000,
      select: (data) => data.name, // Transform data
    }),
  );
</script>
```

### Custom Transport

Override the transport for specific queries:

```svelte
<script lang="ts">
  import { createQuery } from '@telton/connect-svelte-query';
  import { createConnectTransport } from '@connectrpc/connect-web';
  import { getUser } from './gen/user_connect';

  const customTransport = createConnectTransport({
    baseUrl: 'https://other-api.example.com',
  });

  const query = createQuery(
    getUser,
    () => ({ id: 1 }),
    () => ({ transport: customTransport }),
  );
</script>
```

## API

### `setTransport(transport: Transport)`

Sets the Connect transport in Svelte context. Must be called in a component initialization.

### `useTransport(): Transport`

Retrieves the transport from context. Throws if no transport is set.

### `createQuery(schema, input?, options?)`

Creates a query for a unary RPC method.

**Parameters:**
- `schema` - Connect method descriptor from generated code
- `input` - Function returning the request message or `skipToken`
- `options` - Function returning TanStack Query options (optional)

**Returns:** TanStack Query result object

### `createMutation(schema, options?)`

Creates a mutation for a unary RPC method.

**Parameters:**
- `schema` - Connect method descriptor from generated code
- `options` - Function returning TanStack Query mutation options (optional)

**Returns:** TanStack Query mutation result object

### Re-exported from `@connectrpc/connect-query-core`

- `createConnectQueryKey(schema, input?)` - Generate query keys
- `callUnaryMethod(schema, input, options)` - Call methods directly
- `skipToken` - Skip queries conditionally

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup and guidelines.

## License

ISC
