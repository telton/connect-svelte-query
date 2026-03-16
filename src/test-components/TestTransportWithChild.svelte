<script lang="ts">
import type { Transport } from '@connectrpc/connect';
import { setTransport } from '../context.svelte';
import TestUseTransport from './TestUseTransport.svelte';

const { transport }: { transport: Transport } = $props();

setTransport(transport);
</script>

<TestUseTransport />
