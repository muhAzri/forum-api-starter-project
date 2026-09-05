import { describe, it, expect, afterEach, vi } from 'vitest';

describe('config', () => {
  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
    vi.resetModules();
  });

  it('should use production host and default debug when NODE_ENV is production', async () => {
    process.env.NODE_ENV = 'production';
    vi.resetModules();

    const { default: config } = await import('../config.js');

    expect(config.app.host).toEqual('0.0.0.0');
    expect(config.app.debug).toEqual({});
  });

  it('should enable request debug logging when NODE_ENV is development', async () => {
    process.env.NODE_ENV = 'development';
    vi.resetModules();

    const { default: config } = await import('../config.js');

    expect(config.app.host).toEqual('localhost');
    expect(config.app.debug).toEqual({ request: ['error'] });
  });
});
