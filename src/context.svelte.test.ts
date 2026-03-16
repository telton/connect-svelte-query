import { describe, expect, it } from 'vitest';
import { createMockTransport } from './test-utils';

describe('Transport Context', () => {
  describe('Mock Transport', () => {
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
    });
  });
});
