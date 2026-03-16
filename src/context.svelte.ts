import type { Transport } from '@connectrpc/connect';
import { getContext, setContext } from 'svelte';

const TRANSPORT_KEY = Symbol('connect-transport');

export function setTransport(transport: Transport): void {
  setContext<Transport>(TRANSPORT_KEY, transport);
}

export function useTransport(): Transport {
  const transport = getContext<Transport>(TRANSPORT_KEY);
  if (!transport) {
    throw new Error('No transport found. Did you forget to call setTransport?');
  }
  return transport;
}
