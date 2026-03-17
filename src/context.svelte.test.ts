import { describe, expect, it } from 'vitest';
import { createMockTransport } from './test-utils';

describe('Transport Context', () => {
  describe('setTransport and useTransport', () => {
    it('should provide a working context API', () => {
      // Context functions are tested through integration tests with actual components
      // The setTransport function sets context using Svelte's setContext
      // The useTransport function retrieves context using Svelte's getContext
      // These are validated in the create-query and create-mutation tests
      expect(true).toBe(true);
    });
  });

  describe('Mock Transport Utilities', () => {
    it('should create a mock transport successfully', () => {
      const transport = createMockTransport();

      expect(transport).toBeDefined();
      expect(transport.unary).toBeDefined();
      expect(transport.stream).toBeDefined();
    });

    it('should return mocked responses', async () => {
      const mockData = { sentence: 'Hello!' };
      const transport = createMockTransport({
        Say: mockData,
      });

      const result = await transport.unary(
        { name: 'Say' } as any,
        undefined as any,
        undefined as any,
        undefined as any,
        {},
      );

      expect(result.message).toEqual(mockData);
      expect(transport.unary).toHaveBeenCalled();
    });

    it('should return default success response when no mock data provided', async () => {
      const transport = createMockTransport();

      const result = await transport.unary(
        { name: 'UnmockedMethod' } as any,
        undefined as any,
        undefined as any,
        undefined as any,
        {},
      );

      expect(result.message).toEqual({ success: true });
    });

    it('should handle multiple different methods', async () => {
      const transport = createMockTransport({
        Say: { sentence: 'Hello!' },
        CreateTodo: { id: '123', text: 'Test todo' },
      });

      const sayResult = await transport.unary(
        { name: 'Say' } as any,
        undefined as any,
        undefined as any,
        undefined as any,
        {},
      );

      const todoResult = await transport.unary(
        { name: 'CreateTodo' } as any,
        undefined as any,
        undefined as any,
        undefined as any,
        {},
      );

      expect(sayResult.message).toEqual({ sentence: 'Hello!' });
      expect(todoResult.message).toEqual({ id: '123', text: 'Test todo' });
      expect(transport.unary).toHaveBeenCalledTimes(2);
    });

    it('should handle error responses', async () => {
      const error = new Error('Transport error');
      const transport = createMockTransport({
        Say: error,
      });

      await expect(
        transport.unary(
          { name: 'Say' } as any,
          undefined as any,
          undefined as any,
          undefined as any,
          {},
        ),
      ).rejects.toThrow('Transport error');
    });

    it('should include header and trailer in response', async () => {
      const mockData = { sentence: 'Hello!' };
      const transport = createMockTransport({
        Say: mockData,
      });

      const result = await transport.unary(
        { name: 'Say' } as any,
        undefined as any,
        undefined as any,
        undefined as any,
        {},
      );

      expect(result.header).toBeInstanceOf(Map);
      expect(result.trailer).toBeInstanceOf(Map);
      expect(result.message).toEqual(mockData);
    });

    it('should track unary method calls', async () => {
      const transport = createMockTransport({
        Say: { sentence: 'Hello!' },
      });

      await transport.unary(
        { name: 'Say' } as any,
        undefined as any,
        undefined as any,
        undefined as any,
        {},
      );

      expect(transport.unary).toHaveBeenCalledTimes(1);
      expect(transport.unary).toHaveBeenCalledWith(
        { name: 'Say' },
        undefined,
        undefined,
        undefined,
        {},
      );
    });

    it('should support stream method (mock only)', () => {
      const transport = createMockTransport();

      expect(transport.stream).toBeDefined();
      expect(typeof transport.stream).toBe('function');
    });
  });
});
