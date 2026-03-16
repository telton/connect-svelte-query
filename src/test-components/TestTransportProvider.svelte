<script lang="ts">
  import type { Transport } from '@connectrpc/connect';
  import { setTransport } from '../context.svelte';
  import type { Snippet } from 'svelte';

  const { transport, children }: { transport: Transport; children: Snippet } = $props();

  setTransport(transport);
</script>

{@render children()}
