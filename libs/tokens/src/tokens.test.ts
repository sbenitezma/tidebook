// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { applyTokens, tokens, tokensCss, toCssVariables, vars } from './tokens';

describe('toCssVariables', () => {
  it('turns nested camelCase keys into --tb-* custom properties', () => {
    expect(toCssVariables({ color: { primaryHover: '#000' } })).toBe(
      ':root {\n  --tb-color-primary-hover: #000;\n}\n',
    );
  });

  it('exports every token', () => {
    const count = Object.values(tokens).reduce((sum, group) => sum + Object.keys(group).length, 0);
    expect(tokensCss.match(/--tb-/g)).toHaveLength(count);
  });
});

describe('vars', () => {
  it('references the same custom properties that tokensCss declares', () => {
    expect(vars.color.primaryHover).toBe('var(--tb-color-primary-hover)');
    expect(tokensCss).toContain('--tb-color-primary-hover:');
    expect(vars.space.md).toBe('var(--tb-space-md)');
  });
});

describe('applyTokens', () => {
  it('injects the stylesheet only once', () => {
    applyTokens(document);
    applyTokens(document);
    const styles = document.querySelectorAll('#tb-tokens');
    expect(styles).toHaveLength(1);
    expect(styles[0]?.textContent).toBe(tokensCss);
  });
});
