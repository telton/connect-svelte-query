import type {
  DescMessage,
  DescMethodUnary,
  MessageInitShape,
  MessageShape,
} from '@bufbuild/protobuf';
import type { ConnectError, Transport } from '@connectrpc/connect';
import {
  type ConnectQueryKey,
  createQueryOptions,
  type SkipToken,
} from '@connectrpc/connect-query-core';
import type { CreateQueryOptions, CreateQueryResult } from '@tanstack/svelte-query';
import { createQuery as tsCreateQuery } from '@tanstack/svelte-query';
import { useTransport } from './context.svelte';
import type { GetMethod, MethodNames, ServiceLike } from './types';

/**
 * Creates a query using a method descriptor.
 *
 * @example
 * const query = createQuery(UserService.method.getUser, () => ({ id: userId }));
 */
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
): CreateQueryResult<SelectOutData, ConnectError>;

/**
 * Creates a query using a service and method name.
 *
 * @example
 * const query = createQuery(UserService, 'getUser', () => ({ id: userId }));
 */
export function createQuery<
  S extends ServiceLike,
  M extends MethodNames<S>,
  Method extends GetMethod<S, M> = GetMethod<S, M>,
  I extends DescMessage = Method extends DescMethodUnary<infer Input, any> ? Input : never,
  O extends DescMessage = Method extends DescMethodUnary<any, infer Output> ? Output : never,
  SelectOutData = MessageShape<O>,
>(
  service: S,
  methodName: M,
  input?: () => MessageInitShape<I> | SkipToken,
  options?: () => Omit<
    CreateQueryOptions<MessageShape<O>, ConnectError, SelectOutData, ConnectQueryKey<O>>,
    'queryKey' | 'queryFn'
  > & {
    transport?: Transport;
  },
): CreateQueryResult<SelectOutData, ConnectError>;

// Implementation
export function createQuery<
  I extends DescMessage,
  O extends DescMessage,
  SelectOutData = MessageShape<O>,
>(
  schemaOrService: DescMethodUnary<I, O> | ServiceLike,
  inputOrMethodName?: (() => MessageInitShape<I> | SkipToken) | string,
  optionsOrInput?:
    | (() => Omit<
        CreateQueryOptions<MessageShape<O>, ConnectError, SelectOutData, ConnectQueryKey<O>>,
        'queryKey' | 'queryFn'
      > & {
        transport?: Transport;
      })
    | (() => MessageInitShape<I> | SkipToken),
  maybeOptions?: () => Omit<
    CreateQueryOptions<MessageShape<O>, ConnectError, SelectOutData, ConnectQueryKey<O>>,
    'queryKey' | 'queryFn'
  > & {
    transport?: Transport;
  },
): CreateQueryResult<SelectOutData, ConnectError> {
  // Determine which overload was called
  let schema: DescMethodUnary<I, O>;
  let input: (() => MessageInitShape<I> | SkipToken) | undefined;
  let options: typeof maybeOptions;

  if (typeof inputOrMethodName === 'string') {
    // Second overload: (service, methodName, input?, options?)
    const service = schemaOrService as ServiceLike;
    schema = service.method[inputOrMethodName] as DescMethodUnary<I, O>;
    input = optionsOrInput as (() => MessageInitShape<I> | SkipToken) | undefined;
    options = maybeOptions;
  } else {
    // First overload: (schema, input?, options?)
    schema = schemaOrService as DescMethodUnary<I, O>;
    input = inputOrMethodName;
    options = optionsOrInput as typeof maybeOptions;
  }

  return tsCreateQuery(() => {
    const transport = options?.()?.transport ?? useTransport();

    const baseOptions = createQueryOptions(schema, typeof input === 'function' ? input() : input, {
      transport,
    });

    return {
      ...baseOptions,
      ...options?.(),
    };
  });
}
