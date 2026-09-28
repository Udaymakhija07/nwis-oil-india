import { create } from 'zustand';

export const useWellStore = create((set) => ({
  activeTab: 'map',
  activeWellId: 'DIK-14',
  radiusKm: 10.0,
  minScore: 0.35,
  selectedOffsetId: null,
  inspectingDoc: null,
  isDirectionalView: false,

  setActiveTab: (tab) => set({ activeTab: tab }),
  setActiveWellId: (id) => set({ activeWellId: id, selectedOffsetId: null }),
  setRadiusKm: (r) => set({ radiusKm: r }),
  setMinScore: (s) => set({ minScore: s }),
  setSelectedOffsetId: (id) => set({ selectedOffsetId: id }),
  setInspectingDoc: (doc) => set({ inspectingDoc: doc }),
  toggleDirectionalView: () => set((state) => ({ isDirectionalView: !state.isDirectionalView }))
}));
