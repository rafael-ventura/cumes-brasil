// src/boot/debugEnv.ts
export default () => {
  // @ts-ignore
  window.__APP_DEBUG__ = {
    env: {
      API: import.meta.env.VITE_APP_API_URL,
      ASSETS: import.meta.env.VITE_APP_ASSETS_URL,
    },
    img: (p: string) => {
      const base = (import.meta.env.VITE_APP_ASSETS_URL || 'http://localhost:8080/assets').replace(/\/$/, '');
      const rel = String(p || '').replace(/^\/?assets?\//i, '');
      const full = /^https?:\/\//i.test(rel) ? rel : `${base}/${rel}`;
      console.log({ base, rel, full });
      return full;
    }
  };
};
