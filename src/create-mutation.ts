import type {
  DescMessage,
  DescMethodUnary,
  MessageInitShape,
  MessageShape,
} from '@bufbuild/protobuf';
import type { ConnectError, Transport } from '@connectrpc/connect';
import { callUnaryMethod } from '@connectrpc/connect-query-core';
import type { CreateMutationOptions, CreateMutationResult } from '@tanstack/svelte-query';
import { createMutation as tsCreateMutation } from '@tanstack/svelte-query';
import { useTransport } from './context.svelte';
import type { GetMethod, MethodNames, ServiceLike } from './types';

/**
 * Creates a mutation using a method descriptor.
 *
 * @example
 * const mutation = createMutation(AuthService.method.login);
 * mutation.mutate({ email: 'user@example.com' });
 */
export function createMutation<I extends DescMessage, O extends DescMessage, Context = unknown>(
  schema: DescMethodUnary<I, O>,
  options?: () => Omit<
    CreateMutationOptions<MessageShape<O>, ConnectError, MessageInitShape<I>, Context>,
    'mutationFn'
  > & {
    transport?: Transport;
  },
): CreateMutationResult<MessageShape<O>, ConnectError, MessageInitShape<I>, Context>;

/**
 * Creates a mutation using a service and method name.
 *
 * @example
 * const mutation = createMutation(AuthService, 'login');
 * mutation.mutate({ email: 'user@example.com' });
 */
export function createMutation<
  S extends ServiceLike,
  M extends MethodNames<S>,
  Method extends GetMethod<S, M> = GetMethod<S, M>,
  I extends DescMessage = Method extends DescMethodUnary<infer Input, any> ? Input : never,
  O extends DescMessage = Method extends DescMethodUnary<any, infer Output> ? Output : never,
  Context = unknown,
>(
  service: S,
  methodName: M,
  options?: () => Omit<
    CreateMutationOptions<MessageShape<O>, ConnectError, MessageInitShape<I>, Context>,
    'mutationFn'
  > & {
    transport?: Transport;
  },
): CreateMutationResult<MessageShape<O>, ConnectError, MessageInitShape<I>, Context>;

// Implementation
export function createMutation<I extends DescMessage, O extends DescMessage, Context = unknown>(
  schemaOrService: DescMethodUnary<I, O> | ServiceLike,
  methodNameOrOptions?:
    | string
    | (() => Omit<
        CreateMutationOptions<MessageShape<O>, ConnectError, MessageInitShape<I>, Context>,
        'mutationFn'
      > & {
        transport?: Transport;
      }),
  maybeOptions?: () => Omit<
    CreateMutationOptions<MessageShape<O>, ConnectError, MessageInitShape<I>, Context>,
    'mutationFn'
  > & {
    transport?: Transport;
  },
): CreateMutationResult<MessageShape<O>, ConnectError, MessageInitShape<I>, Context> {
  // Determine which overload was called
  let schema: DescMethodUnary<I, O>;
  let options: typeof maybeOptions;

  if (typeof methodNameOrOptions === 'string') {
    // Second overload: (service, methodName, options?)
    const service = schemaOrService as ServiceLike;
    schema = service.method[methodNameOrOptions] as DescMethodUnary<I, O>;
    options = maybeOptions;
  } else {
    // First overload: (schema, options?)
    schema = schemaOrService as DescMethodUnary<I, O>;
    options = methodNameOrOptions;
  }

  return tsCreateMutation(() => {
    const transport = options?.()?.transport ?? useTransport();

    return {
      mutationFn: (input: MessageInitShape<I>) => callUnaryMethod(transport, schema, input),
      ...options?.(),
    };
  });
}
