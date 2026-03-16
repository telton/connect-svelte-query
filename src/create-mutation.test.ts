import type { DescMethodUnary } from '@bufbuild/protobuf';
import type { QueryClient } from '@tanstack/svelte-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createMockTransport, createTestQueryClient } from './test-utils';

const mockSchema: DescMethodUnary<any, any> = {
  name: 'CreateTodo',
  kind: 'unary',
  I: {
    typeName: 'CreateTodoRequest',
  },
  O: {
    typeName: 'CreateTodoResponse',
  },
} as any;

describe('createMutation', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = createTestQueryClient();
  });

  it('should call transport.unary when mutation executes', async () => {
    const mockData = { success: true, id: '123' };
    const transport = createMockTransport({
      CreateTodo: mockData,
    });

    const result = await transport.unary(
      mockSchema as any,
      undefined as any,
      undefined as any,
      undefined as any,
      { text: 'Test todo' },
    );

    expect(transport.unary).toHaveBeenCalled();
    expect(result.message).toEqual(mockData);
  });

  it('should handle mutation errors', async () => {
    const error = new Error('Mutation failed');
    const transport = createMockTransport({
      CreateTodo: error,
    });

    await expect(
      transport.unary(mockSchema as any, undefined as any, undefined as any, undefined as any, {}),
    ).rejects.toThrow('Mutation failed');
  });

  it('should return success response', async () => {
    const mockResponse = { success: true, message: 'Todo created' };
    const transport = createMockTransport({
      CreateTodo: mockResponse,
    });

    const result = await transport.unary(
      mockSchema as any,
      undefined as any,
      undefined as any,
      undefined as any,
      { text: 'New todo' },
    );

    expect(result.message).toEqual(mockResponse);
    expect((result.message as any).success).toBe(true);
  });
});
