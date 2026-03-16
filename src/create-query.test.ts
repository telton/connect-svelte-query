import type { DescMethodUnary } from '@bufbuild/protobuf';
import { createQueryOptions } from '@connectrpc/connect-query-core';
import type { QueryClient } from '@tanstack/svelte-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createMockTransport, createTestQueryClient } from './test-utils';

// Mock schema for testing
const mockSchema: DescMethodUnary<any, any> = {
  name: 'Say',
  kind: 'unary',
  I: {
    typeName: 'SayRequest',
  },
  O: {
    typeName: 'SayResponse',
  },
} as any;

describe('createQuery', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = createTestQueryClient();
  });

  it('should create query options with correct structure', () => {
    const transport = createMockTransport();
    const options = createQueryOptions(mockSchema, {}, { transport });

    expect(options.queryKey).toBeDefined();
    expect(options.queryKey[0]).toBe('connect-query');
    expect(options.queryFn).toBeDefined();
  });

  it('should call transport.unary when query executes', async () => {
    const mockData = { sentence: 'Hello!' };
    const transport = createMockTransport({
      Say: mockData,
    });

    const result = await transport.unary(
      mockSchema as any,
      undefined as any,
      undefined as any,
      undefined as any,
      {},
    );

    expect(transport.unary).toHaveBeenCalled();
    expect(result.message).toEqual(mockData);
  });

  it('should handle errors correctly', async () => {
    const error = new Error('Connection failed');
    const transport = createMockTransport({
      Say: error,
    });

    await expect(
      transport.unary(mockSchema as any, undefined as any, undefined as any, undefined as any, {}),
    ).rejects.toThrow('Connection failed');
  });
});
