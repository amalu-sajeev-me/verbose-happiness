
import { EnvironmentUtil } from '../EnvironmentUtil';

describe('EnvironmentUtil', () => {
  // Set NODE_ENV before running the tests
  process.env.NODE_ENV = 'development';

  it('should correctly identify development environment', () => {
    expect(EnvironmentUtil.isDevelopment()).toBe(true);
    expect(EnvironmentUtil.isProduction()).toBe(false);
    expect(EnvironmentUtil.isTesting()).toBe(false);
  });

  it('should correctly identify production environment', () => {
    process.env.NODE_ENV = 'production';
    expect(EnvironmentUtil.isDevelopment()).toBe(false);
    expect(EnvironmentUtil.isProduction()).toBe(true);
    expect(EnvironmentUtil.isTesting()).toBe(false);
  });

  it('should correctly identify testing environment', () => {
    process.env.NODE_ENV = 'testing';
    expect(EnvironmentUtil.isDevelopment()).toBe(false);
    expect(EnvironmentUtil.isProduction()).toBe(false);
    expect(EnvironmentUtil.isTesting()).toBe(true);
  });

  it('should get current environment', () => {
    process.env.NODE_ENV = 'development';
    expect(EnvironmentUtil.getCurrentEnvironment()).toBe('development');
  });

  it('should require existing environment variable', () => {
    process.env.EXISTING_VARIABLE = 'some value';
    expect(() => EnvironmentUtil.requireEnvVariable('EXISTING_VARIABLE')).not.toThrow();
  });

  it('should throw error for non-existing environment variable', () => {
    process.env.NON_EXISTING_VARIABLE = '';
    expect(() => EnvironmentUtil.requireEnvVariable('NON_EXISTING_VARIABLE')).toThrowError(
      "Environment variable 'NON_EXISTING_VARIABLE' is not set."
    );
  });
});