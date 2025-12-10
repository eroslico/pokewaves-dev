import { useState, useEffect } from 'react';

export type ViewMode = 'grid' | 'list';

const VIEW_MODE_KEY = 'pokemonViewMode';

export const useViewMode = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    try {
      const stored = localStorage.getItem(VIEW_MODE_KEY);
      return (stored as ViewMode) || 'grid';
    } catch {
      return 'grid';
    }
  });

  useEffect(() => {
    localStorage.setItem(VIEW_MODE_KEY, viewMode);
  }, [viewMode]);

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === 'grid' ? 'list' : 'grid'));
  };

  return {
    viewMode,
    setViewMode,
    toggleViewMode,
  };
};
