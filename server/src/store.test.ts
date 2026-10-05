import { describe, it, expect } from 'vitest';
import { createStore } from './store.ts';

describe('createStore', () => {
  it('возвращает апишку стора', () => {
    const store = createStore();
    expect(typeof store.getLeftItems).toBe('function');
  });
});