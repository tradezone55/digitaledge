// src/flags.ts
export function isBeta(): boolean {
  const url = new URL(window.location.href);
  const q = (url.searchParams.get('beta') || '').trim();
  if (q === '1') localStorage.setItem('beta', '1');
  if (q === '0') localStorage.removeItem('beta');
  return localStorage.getItem('beta') === '1';
}
