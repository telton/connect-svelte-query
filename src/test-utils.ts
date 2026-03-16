import type { Transport } from '@connectrpc/connect';
import { QueryClient } from '@tanstack/svelte-query';
import { render as testingLibraryRender } from '@testing-library/svelte';
import type { Component } from 'svelte';
import { vi } from 'vitest';

export function createMockTransport(responses: Record<string, any> = {}): Transport {
  return {
    unary: vi.fn((schema) => {
      const methodName = schema.name;
      const response = responses[methodName];
      if (response instanceof Error) {
        return Promise.reject(response);
      }
      return Promise.resolve({
        message: response ?? { success: true },
        header: new Map(),
        trailer: new Map(),
      });
    }),
    stream: vi.fn(),
  } as any;
}

export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Number.POSITIVE_INFINITY,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

export function renderWithQueryClient(
  component: Component,
  options: {
    queryClient?: QueryClient;
    props?: Record<string, any>;
  } = {},
): any {
  const queryClient = options.queryClient ?? createTestQueryClient();

  const result = testingLibraryRender(component, {
    props: {
      ...options.props,
      queryClient,
    },
  });

  return {
    ...result,
    queryClient,
  };
}
