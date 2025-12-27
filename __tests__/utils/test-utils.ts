/**
 * Test Utilities
 * 
 * Shared helpers and utilities for tests
 */

import { expect } from 'vitest';

/**
 * Wait for a specified amount of time
 */
export const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Create a mock Date that can be controlled
 */
export function mockDate(isoDate: string) {
  const mockNow = new Date(isoDate);
  const originalDate = global.Date;
  
  global.Date = class extends originalDate {
    constructor(...args: any[]) {
      if (args.length === 0) {
        return mockNow;
      }
      return new originalDate(...args);
    }
    
    static now() {
      return mockNow.getTime();
    }
  } as any;
  
  return () => {
    global.Date = originalDate;
  };
}

/**
 * Assert that a value is defined (not null or undefined)
 */
export function assertDefined<T>(value: T | null | undefined, message?: string): asserts value is T {
  expect(value).toBeDefined();
  expect(value).not.toBeNull();
}

/**
 * Create a partial mock object with type safety
 */
export function createMock<T>(partial: Partial<T>): T {
  return partial as T;
}

/**
 * Test if a string matches a date pattern
 */
export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

/**
 * Compare two objects deeply (useful for debugging test failures)
 */
export function deepEqual(obj1: any, obj2: any): boolean {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

