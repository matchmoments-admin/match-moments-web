import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    // Use happy-dom for lightweight DOM simulation
    environment: 'happy-dom',
    
    // Global test setup
    setupFiles: ['./vitest.setup.ts'],
    
    // Include test files
    include: ['__tests__/**/*.{test,spec}.{ts,tsx}'],
    
    // Exclude directories
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/prototype/**',
      '**/.next/**',
    ],
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.d.ts',
        'src/**/*.test.{ts,tsx}',
        'src/**/*.spec.{ts,tsx}',
        'src/types/**',
        'src/app/**/layout.tsx',
        'src/app/**/page.tsx',
      ],
      // 50% coverage threshold (non-blocking - reportOnFailure only)
      thresholds: {
        lines: 50,
        functions: 50,
        branches: 50,
        statements: 50,
      },
    },
    
    // Test timeout
    testTimeout: 10000,
    
    // Global test options
    globals: true,
  },
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});

