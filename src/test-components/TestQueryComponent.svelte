<script lang="ts">
  import type { DescMethodUnary } from '@bufbuild/protobuf';
  import { QueryClientProvider } from '@tanstack/svelte-query';
  import { createQuery } from '../create-query';
  import type { QueryClient } from '@tanstack/svelte-query';

  const {
    schema,
    input,
    options,
    queryClient,
  }: {
    schema: DescMethodUnary<any, any>;
    input?: () => any;
    options?: () => any;
    queryClient: QueryClient;
  } = $props();

  const query = createQuery(schema, input, options);

  export { query };
</script>

<QueryClientProvider client={queryClient}>
  {#if query.isPending}
    <div data-testid="loading">Loading...</div>
  {:else if query.isError}
    <div data-testid="error">Error: {query.error.message}</div>
  {:else if query.isSuccess}
    <div data-testid="success">Data: {JSON.stringify(query.data)}</div>
  {/if}
</QueryClientProvider>
