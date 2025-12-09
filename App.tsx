import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import SettingsView from './components/SettingsView';
import { AppSettings, AppView } from './types';

const SETTINGS_KEY = 'viralvision_settings';

const DEFAULT_SETTINGS: AppSettings = {
  themeColor: 'indigo',
  linkedAccounts: {} 
};

export default function App() {
  // Global State
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [lastSaved, setLastSaved] = useState<number | null>(null);

  // Load Settings on Mount
  useEffect(() => {
    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        // Merge with default to ensure structure exists
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
  }, []);

  // Persist Settings
  const updateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
  };

  const handleNavigate = (view: AppView) => {
    setCurrentView(view);
  };

  // Dynamic Background based on Theme
  const getThemeBackground = () => {
    switch(settings.themeColor) {
      case 'rose': return 'bg-slate-950 selection:bg-rose-500/30';
      case 'emerald': return 'bg-slate-950 selection:bg-emerald-500/30';
      case 'violet': return 'bg-slate-950 selection:bg-violet-500/30';
      case 'amber': return 'bg-slate-950 selection:bg-amber-500/30';
      default: return 'bg-slate-950 selection:bg-indigo-500/30';
    }
  };

  return (
    <div className={`min-h-screen ${getThemeBackground()} pb-20 transition-colors duration-500`}>
      <Header 
        lastSaved={lastSaved} 
        currentView={currentView} 
        onNavigate={handleNavigate}
        themeColor={settings.themeColor}
      />

      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {currentView === 'home' && (
          <DashboardView 
            settings={settings}
            onGoToSettings={() => setCurrentView('settings')}
            themeColor={settings.themeColor}
            setLastSaved={setLastSaved}
          />
        )}

        {currentView === 'settings' && (
          <SettingsView 
            settings={settings}
            updateSettings={updateSettings}
          />
        )}

      </main>
    </div>
  );
}