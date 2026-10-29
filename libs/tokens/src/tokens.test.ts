// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { applyTokens, tokens, tokensCss, toCssVariables } from './tokens';

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

describe('applyTokens', () => {
  it('injects the stylesheet only once', () => {
    applyTokens(document);
    applyTokens(document);
    const styles = document.querySelectorAll('#tb-tokens');
    expect(styles).toHaveLength(1);
    expect(styles[0]?.textContent).toBe(tokensCss);
  });
});
