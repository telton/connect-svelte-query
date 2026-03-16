<script lang="ts">
import type { Transport } from '@connectrpc/connect';
import type { Snippet } from 'svelte';
import { setTransport } from '../context.svelte';

const { transport, children }: { transport: Transport; children: Snippet } = $props();

setTransport(transport);
</script>

{@render children()}
