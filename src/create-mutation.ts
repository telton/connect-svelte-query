import type {
    DescMessage,
    DescMethodUnary,
    MessageInitShape,
    MessageShape,
} from '@bufbuild/protobuf';
import type { Transport } from '@connectrpc/connect';
import { ConnectError } from '@connectrpc/connect';
import type { CreateMutationOptions, CreateMutationResult } from '@tanstack/svelte-query';
import { createMutation as tsCreateMutation } from '@tanstack/svelte-query';
import { callUnaryMethod } from '@connectrpc/connect-query-core';
import { useTransport } from './context.svelte';

export function createMutation<I extends DescMessage, O extends DescMessage, Context = unknown>(
  schema: DescMethodUnary<I, O>,
  options?: () => Omit<
    CreateMutationOptions<MessageShape<O>, ConnectError, MessageInitShape<I>, Context>,
    'mutationFn'
  > & {
    transport?: Transport;
  },
): CreateMutationResult<MessageShape<O>, ConnectError, MessageInitShape<I>, Context> {
  const transport = useTransport();

  return tsCreateMutation(() => ({
    mutationFn: (input: MessageInitShape<I>) => callUnaryMethod(transport, schema, input),
    ...options?.(),
  }));
}
