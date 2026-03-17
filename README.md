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

Use `createQuery` to fetch data from unary RPC methods. There are two ways to specify the method:

#### Option 1: Service and method name (Recommended)

```svelte
<script lang="ts">
  import { createQuery } from '@telton/connect-svelte-query';
  import { UserService } from './gen/user_pb';

  let userId = $state(1);

  const query = createQuery(
    UserService,
    'getUser',
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

#### Option 2: Method descriptor

```svelte
<script lang="ts">
  import { createQuery } from '@telton/connect-svelte-query';
  import { UserService } from './gen/user_pb';

  let userId = $state(1);

  const query = createQuery(
    UserService.method.getUser,
    () => ({ id: userId }),
  );
</script>
```

Both syntaxes are fully type-safe with autocomplete. The first option is shorter and more readable.

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

Use `createMutation` to call RPC methods that modify data. Like queries, there are two ways to specify the method:

#### Option 1: Service and method name (Recommended)

```svelte
<script lang="ts">
  import { createMutation } from '@telton/connect-svelte-query';
  import { UserService } from './gen/user_pb';

  const mutation = createMutation(UserService, 'updateUser');

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

#### Option 2: Method descriptor

```svelte
<script lang="ts">
  import { createMutation } from '@telton/connect-svelte-query';
  import { UserService } from './gen/user_pb';

  const mutation = createMutation(UserService.method.updateUser);
</script>
```

### Query Options

Pass additional TanStack Query options:

```svelte
<script lang="ts">
  import { createQuery } from '@telton/connect-svelte-query';
  import { UserService } from './gen/user_pb';

  const query = createQuery(
    UserService,
    'getUser',
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
  import { UserService } from './gen/user_pb';

  const customTransport = createConnectTransport({
    baseUrl: 'https://other-api.example.com',
  });

  const query = createQuery(
    UserService,
    'getUser',
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

### `createQuery(...)`

Creates a query for a unary RPC method. Supports two signatures:

#### Signature 1: Service and method name (Recommended)

```typescript
createQuery<S, M>(
  service: S,
  methodName: M,
  input?: () => MessageInitShape<I> | SkipToken,
  options?: () => CreateQueryOptions
): CreateQueryResult
```

**Parameters:**

- `service` - The service object (e.g., `UserService`)
- `methodName` - The method name as a string (e.g., `'getUser'`)
- `input` - Function returning the request message or `skipToken` (optional)
- `options` - Function returning TanStack Query options (optional)

**Example:**

```typescript
const query = createQuery(UserService, "getUser", () => ({ id: 1 }));
```

#### Signature 2: Method descriptor

```typescript
createQuery<I, O>(
  schema: DescMethodUnary<I, O>,
  input?: () => MessageInitShape<I> | SkipToken,
  options?: () => CreateQueryOptions
): CreateQueryResult
```

**Parameters:**

- `schema` - Connect method descriptor (e.g., `UserService.method.getUser`)
- `input` - Function returning the request message or `skipToken` (optional)
- `options` - Function returning TanStack Query options (optional)

**Example:**

```typescript
const query = createQuery(UserService.method.getUser, () => ({ id: 1 }));
```

**Returns:** TanStack Query result object

### `createMutation(...)`

Creates a mutation for a unary RPC method. Supports two signatures:

#### Signature 1: Service and method name (Recommended)

```typescript
createMutation<S, M>(
  service: S,
  methodName: M,
  options?: () => CreateMutationOptions
): CreateMutationResult
```

**Parameters:**

- `service` - The service object (e.g., `UserService`)
- `methodName` - The method name as a string (e.g., `'updateUser'`)
- `options` - Function returning TanStack Query mutation options (optional)

**Example:**

```typescript
const mutation = createMutation(UserService, "updateUser");
```

#### Signature 2: Method descriptor

```typescript
createMutation<I, O>(
  schema: DescMethodUnary<I, O>,
  options?: () => CreateMutationOptions
): CreateMutationResult
```

**Parameters:**

- `schema` - Connect method descriptor (e.g., `UserService.method.updateUser`)
- `options` - Function returning TanStack Query mutation options (optional)

**Example:**

```typescript
const mutation = createMutation(UserService.method.updateUser);
```

**Returns:** TanStack Query mutation result object

### Re-exported from `@connectrpc/connect-query-core`

- `createConnectQueryKey(schema, input?)` - Generate query keys
- `callUnaryMethod(schema, input, options)` - Call methods directly
- `skipToken` - Skip queries conditionally

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup and guidelines.

## License

ISC
