import { describe, it, expect } from 'vitest';
import { createGlobalState } from '@reactuse/core';

describe('createGlobalState', () => {
  it('should create a hook function', () => {
    const useGlobalState = createGlobalState('test-key', 0);
    expect(typeof useGlobalState).toBe('function');
  });

  it('should create different hooks for different keys', () => {
    const useGlobalState1 = createGlobalState('key1', 0);
    const useGlobalState2 = createGlobalState('key2', 1);
    expect(useGlobalState1).not.toBe(useGlobalState2);
  });
});