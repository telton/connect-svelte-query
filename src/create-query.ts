import type {
    DescMessage,
    DescMethodUnary,
    MessageInitShape,
    MessageShape,
} from '@bufbuild/protobuf';
import type { Transport } from '@connectrpc/connect';
import { ConnectError } from '@connectrpc/connect';
import type { CreateQueryOptions, CreateQueryResult } from '@tanstack/svelte-query';
import { createQuery as tsCreateQuery } from '@tanstack/svelte-query';
import {
    createQueryOptions,
    type ConnectQueryKey,
    type SkipToken,
} from '@connectrpc/connect-query-core';
import { useTransport } from './context.svelte';

export function createQuery<
  I extends DescMessage,
  O extends DescMessage,
  SelectOutData = MessageShape<O>,
>(
  schema: DescMethodUnary<I, O>,
  input?: () => MessageInitShape<I> | SkipToken,
  options?: () => Omit<
    CreateQueryOptions<MessageShape<O>, ConnectError, SelectOutData, ConnectQueryKey<O>>,
    'queryKey' | 'queryFn'
  > & {
    transport?: Transport;
  },
): CreateQueryResult<SelectOutData, ConnectError> {
  const transport = useTransport();

  return tsCreateQuery(() => {
    const baseOptions = createQueryOptions(schema, typeof input === 'function' ? input() : input, {
      transport: options?.()?.transport ?? transport,
    });

    return {
      ...baseOptions,
      ...options?.(),
    };
  });
}
