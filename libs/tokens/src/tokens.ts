/**
 * Single source of truth for Tidebook design tokens.
 * Colour pairs used for text meet WCAG AA contrast (4.5:1) on `surface` and `background`.
 */
export const tokens = {
  color: {
    background: '#fbf7f0',
    surface: '#ffffff',
    surfaceMuted: '#f1ebe0',
    text: '#1b2b34',
    textMuted: '#4a5a63',
    border: '#d9d0c1',
    primary: '#0b6e77',
    primaryHover: '#08545b',
    onPrimary: '#ffffff',
    accent: '#c2502e',
    onAccent: '#ffffff',
    success: '#1f7a4d',
    successSurface: '#e5f4ec',
    danger: '#b42318',
    dangerSurface: '#fdecea',
    warning: '#7a4b00',
    warningSurface: '#fff4e0',
    info: '#0b5560',
    infoSurface: '#e6f4f5',
    focus: '#0b6e77',
  },
  font: {
    family: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    sizeSm: '0.875rem',
    sizeMd: '1rem',
    sizeLg: '1.25rem',
    sizeXl: '1.75rem',
    weightRegular: '400',
    weightBold: '650',
    lineHeight: '1.5',
  },
  space: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  radius: {
    sm: '0.375rem',
    md: '0.75rem',
    pill: '999px',
  },
  shadow: {
    sm: '0 1px 2px rgb(27 43 52 / 0.08)',
    md: '0 4px 16px rgb(27 43 52 / 0.1)',
  },
} as const;

export type Tokens = typeof tokens;

const kebab = (value: string) => value.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);

/** Flattens the token tree into `--tb-<group>-<name>` custom properties on `:root`. */
export function toCssVariables(source: Record<string, Record<string, string>> = tokens): string {
  const declarations = Object.entries(source).flatMap(([group, values]) =>
    Object.entries(values).map(([name, value]) => `--tb-${kebab(group)}-${kebab(name)}: ${value};`),
  );
  return `:root {\n  ${declarations.join('\n  ')}\n}\n`;
}

export const tokensCss = toCssVariables();

/** Adds the token custom properties to the document once. */
export function applyTokens(doc: Document = document): void {
  if (doc.getElementById('tb-tokens')) return;
  const style = doc.createElement('style');
  style.id = 'tb-tokens';
  style.textContent = tokensCss;
  doc.head.append(style);
}
