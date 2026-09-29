import { create } from 'zustand';

const initialTheme = typeof window !== 'undefined' ? (localStorage.getItem('nwis_theme') || 'light') : 'light';
const initialLang = typeof window !== 'undefined' ? (localStorage.getItem('nwis_lang') || 'en') : 'en';

if (typeof document !== 'undefined') {
  if (initialTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

export const useWellStore = create((set) => ({
  activeTab: 'map',
  activeWellId: 'DIK-14',
  radiusKm: 10.0,
  minScore: 0.35,
  selectedOffsetId: null,
  inspectingDoc: null,
  isDirectionalView: false,
  theme: initialTheme,
  language: initialLang,

  setActiveTab: (tab) => set({ activeTab: tab }),
  setActiveWellId: (id) => set({ activeWellId: id, selectedOffsetId: null }),
  setRadiusKm: (r) => set({ radiusKm: r }),
  setMinScore: (s) => set({ minScore: s }),
  setSelectedOffsetId: (id) => set({ selectedOffsetId: id }),
  setInspectingDoc: (doc) => set({ inspectingDoc: doc }),
  toggleDirectionalView: () => set((state) => ({ isDirectionalView: !state.isDirectionalView })),

  toggleTheme: () => set((state) => {
    const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('nwis_theme', nextTheme);
    }
    if (typeof document !== 'undefined') {
      if (nextTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    return { theme: nextTheme };
  }),

  setTheme: (theme) => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('nwis_theme', theme);
    }
    if (typeof document !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    set({ theme });
  },

  setLanguage: (language) => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('nwis_lang', language);
    }
    set({ language });
  },

  toggleLanguage: () => set((state) => {
    const nextLang = state.language === 'hi' ? 'en' : 'hi';
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('nwis_lang', nextLang);
    }
    return { language: nextLang };
  })
}));
