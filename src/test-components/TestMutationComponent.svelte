<script lang="ts">
import type { DescMethodUnary } from '@bufbuild/protobuf';
import type { QueryClient } from '@tanstack/svelte-query';
import { QueryClientProvider } from '@tanstack/svelte-query';
import { createMutation } from '../create-mutation';

const {
  schema,
  options,
  queryClient,
}: {
  schema: DescMethodUnary<any, any>;
  options?: () => any;
  queryClient: QueryClient;
} = $props();

const mutation = createMutation(schema, options);

export { mutation };
</script>

<QueryClientProvider client={queryClient}>
  <button data-testid="mutate-button" onclick={() => mutation.mutate({ text: 'test' })}>
    Mutate
  </button>

  {#if mutation.isPending}
    <div data-testid="loading">Mutating...</div>
  {:else if mutation.isError}
    <div data-testid="error">Error: {mutation.error.message}</div>
  {:else if mutation.isSuccess}
    <div data-testid="success">Success: {JSON.stringify(mutation.data)}</div>
  {/if}
</QueryClientProvider>
