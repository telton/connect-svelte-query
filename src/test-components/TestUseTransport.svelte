<script lang="ts">
  import { useTransport } from '../context.svelte';

  let transport = $state<any>(null);
  let error = $state<string | null>(null);

  try {
    transport = useTransport();
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
  }

  export { transport, error };
</script>

{#if error}
  <div data-testid="error">{error}</div>
{:else}
  <div data-testid="transport-set">Transport Retrieved</div>
{/if}
