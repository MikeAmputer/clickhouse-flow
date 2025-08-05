import { extractRefreshExpression } from '../app/classes/ChModel';

describe('extractRefreshExpression', () => {

  test('returns correct refresh expression for valid input', () => {
    expect(
      extractRefreshExpression(
        'CREATE MATERIALIZED VIEW example_mv REFRESH EVERY 1 MINUTE TO example AS SELECT 1'
      )
    ).toBe('REFRESH EVERY 1 MINUTE');
  });

  test('handles multiple intervals correctly', () => {
    expect(
      extractRefreshExpression(
        'REFRESH EVERY 1 MINUTE 30 SECONDS'
      )
    ).toBe('REFRESH EVERY 1 MINUTE 30 SECONDS');
  });

  test('is case-insensitive for REFRESH EVERY', () => {
    expect(
      extractRefreshExpression(
        'refresh every 2 HOURS'
      )
    ).toBe('REFRESH EVERY 2 HOURS');
  });

  test('is case-insensitive for interval', () => {
    expect(
      extractRefreshExpression(
        'REFRESH EVERY 2 hours'
      )
    ).toBe('REFRESH EVERY 2 HOURS');
  });

  test('returns null when no REFRESH EVERY clause is present', () => {
    expect(
      extractRefreshExpression(
        'CREATE MATERIALIZED VIEW test_mv TO example AS SELECT 1'
      )
    ).toBeNull();
  });

  test('returns null for invalid number', () => {
    expect(
      extractRefreshExpression(
        'REFRESH EVERY foo MINUTE'
      )
    ).toBeNull();
  });

  test('returns null for unsupported time unit', () => {
    expect(
      extractRefreshExpression(
        'REFRESH EVERY 1 CENTURY'
      )
    ).toBeNull();
  });

  test('returns null when interval is incomplete', () => {
    expect(
      extractRefreshExpression(
        'REFRESH EVERY 1'
      )
    ).toBeNull();
  });

  test('returns null for mixed valid and invalid units', () => {
    expect(
      extractRefreshExpression(
        'REFRESH EVERY 1 MINUTE 5 FOOBARS'
      )
    ).toBeNull();
  });

  test('trims whitespace correctly', () => {
    expect(
      extractRefreshExpression(
        'CREATE MATERIALIZED VIEW test_mv   REFRESH    EVERY  2   MINUTES  5   SECONDS   TO example AS SELECT 1'
      )
    ).toBe('REFRESH EVERY 2 MINUTES 5 SECONDS');
  });
});