import React from 'react';
import { Eye, Save, Settings, ArrowLeft, Hexagon, Sparkles } from 'lucide-react';
import { AppView, ThemeColor } from '../types';

interface HeaderProps {
  lastSaved: number | null;
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  themeColor: ThemeColor;
}

const Header: React.FC<HeaderProps> = ({ lastSaved, currentView, onNavigate, themeColor }) => {
  
  const getThemeColor = () => {
    switch(themeColor) {
      case 'rose': return 'text-rose-400';
      case 'emerald': return 'text-emerald-400';
      case 'violet': return 'text-violet-400';
      case 'amber': return 'text-amber-400';
      default: return 'text-indigo-400';
    }
  };

  const getGradientText = () => {
    switch(themeColor) {
      case 'rose': return 'from-rose-400 to-orange-300';
      case 'emerald': return 'from-emerald-400 to-cyan-300';
      case 'violet': return 'from-violet-400 to-fuchsia-300';
      case 'amber': return 'from-amber-400 to-yellow-200';
      default: return 'from-indigo-400 to-purple-300';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/60">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        
        {/* Left Side: Logo */}
        <div className="flex items-center space-x-4">
          {currentView === 'settings' && (
            <button 
              onClick={() => onNavigate('home')}
              className="p-2 -ml-2 hover:bg-slate-800 rounded-full text-slate-400 transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div 
            className="flex items-center space-x-3 cursor-pointer group" 
            onClick={() => onNavigate('home')}
          >
            {/* Spicy Icon */}
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className={`absolute inset-0 bg-gradient-to-tr ${getGradientText()} opacity-20 rounded-xl blur-lg group-hover:opacity-40 transition duration-500`}></div>
              <Hexagon className={`w-10 h-10 ${getThemeColor()} absolute rotate-90 opacity-20 group-hover:rotate-180 transition-transform duration-700`} />
              <Eye className="w-6 h-6 text-white relative z-10 group-hover:scale-110 transition-transform duration-300" />
              <Sparkles className="w-3 h-3 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
            </div>

            <h1 className={`text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r ${getGradientText()} font-serif`}>
              Oracle
            </h1>
          </div>
        </div>
        
        {/* Right Side: Actions */}
        <div className="flex items-center space-x-4">
          
          {/* Auto-save Indicator */}
          {currentView === 'home' && (
            <div className="flex items-center space-x-2 text-xs font-medium text-slate-500 hidden sm:flex bg-slate-900/50 px-3 py-1 rounded-full border border-slate-800">
              {lastSaved ? (
                <>
                  <Save className="w-3 h-3" />
                  <span>Draft saved</span>
                </>
              ) : null}
            </div>
          )}

          {/* Nav Buttons */}
          <button 
            onClick={() => onNavigate('settings')}
            className={`
              p-2.5 rounded-full transition-all border
              ${currentView === 'settings' 
                ? 'bg-slate-800 text-white border-slate-700 shadow-inner' 
                : 'bg-transparent text-slate-400 border-transparent hover:bg-slate-800/50 hover:text-white'}
            `}
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>

        </div>
      </div>
    </header>
  );
};

export default Header;