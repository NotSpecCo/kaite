import type { ThemeConfig } from 'onyx-ui/models';

export const themes: ThemeConfig[] = [
  {
    id: 'light',
    values: {
      cardColorH: 0,
      cardColorS: 0,
      cardColorL: 100,

      accentColorH: 206,
      accentColorS: 82,
      accentColorL: 63,

      textColorH: 0,
      textColorS: 0,
      textColorL: 0,

      focusColorA: 20,
      dividerColorA: 10,
    },
  },
  {
    id: 'dark',
    values: {
      cardColorH: 192,
      cardColorS: 8,
      cardColorL: 12,

      accentColorH: 206,
      accentColorS: 82,
      accentColorL: 63,

      textColorH: 0,
      textColorS: 0,
      textColorL: 100,

      focusColorA: 70,
      dividerColorA: 10,
    },
  },
];
