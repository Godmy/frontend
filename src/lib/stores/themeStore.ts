import { writable } from 'svelte/store';
import { browser } from '$app/environment';

type Theme = 'light' | 'dark' | 'auto';

const userTheme = browser && localStorage.getItem('theme');

export const theme = writable<Theme>(userTheme ? (userTheme as Theme) : 'auto');

function setDarkClass(isDark: boolean) {
  if (browser) {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }
}

theme.subscribe((value) => {
  if (browser) {
    localStorage.setItem('theme', value);

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = value === 'dark' || (value === 'auto' && prefersDark);
    setDarkClass(isDark);
  }
});

// Listen for system theme changes
if (browser) {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    theme.update((currentTheme) => {
      if (currentTheme === 'auto') {
        setDarkClass(e.matches);
      }
      return currentTheme;
    });
  });
}
