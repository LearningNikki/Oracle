import React, { useState } from 'react';
import { AppSettings, SocialPlatform, ThemeColor, UserProfile } from '../types';
import { Palette, Link as LinkIcon, Edit2, Check, X, Upload } from 'lucide-react';
import ImageUploader from './ImageUploader';

interface SettingsViewProps {
  settings: AppSettings;
  updateSettings: (newSettings: AppSettings) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ settings, updateSettings }) => {
  const [editingPlatform, setEditingPlatform] = useState<SocialPlatform | null>(null);
  const [editForm, setEditForm] = useState<UserProfile>({
    username: '',
    displayName: '',
    avatarUrl: '',
    bioVibe: 'Authentic'
  });

  const startEditing = (platform: SocialPlatform) => {
    const existing = settings.linkedAccounts[platform];
    setEditForm(existing || {
      username: '',
      displayName: '',
      avatarUrl: '',
      bioVibe: 'Authentic'
    });
    setEditingPlatform(platform);
  };

  const saveProfile = () => {
    if (editingPlatform) {
      // Use default avatar if none provided
      const finalProfile = {
        ...editForm,
        avatarUrl: editForm.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${editForm.displayName}`
      };

      updateSettings({
        ...settings,
        linkedAccounts: {
          ...settings.linkedAccounts,
          [editingPlatform]: finalProfile
        }
      });
      setEditingPlatform(null);
    }
  };

  const unlinkAccount = (platform: SocialPlatform) => {
    if (confirm(`Unlink ${platform}?`)) {
      updateSettings({
        ...settings,
        linkedAccounts: {
          ...settings.linkedAccounts,
          [platform]: null
        }
      });
    }
  };

  const setTheme = (color: ThemeColor) => {
    updateSettings({
      ...settings,
      themeColor: color
    });
  };

  const platforms = [
    { name: SocialPlatform.Instagram, color: 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600' },
    { name: SocialPlatform.WhatsApp, color: 'bg-green-500' },
    { name: SocialPlatform.TikTok, color: 'bg-black border border-slate-700' },
    { name: SocialPlatform.Twitter, color: 'bg-sky-500' },
    { name: SocialPlatform.Facebook, color: 'bg-blue-600' },
    { name: SocialPlatform.LinkedIn, color: 'bg-blue-700' },
  ];

  const colors: { id: ThemeColor, class: string, label: string }[] = [
    { id: 'indigo', class: 'bg-indigo-600', label: 'Indigo Future' },
    { id: 'rose', class: 'bg-rose-600', label: 'Rose Gold' },
    { id: 'emerald', class: 'bg-emerald-600', label: 'Emerald City' },
    { id: 'violet', class: 'bg-violet-600', label: 'Ultra Violet' },
    { id: 'amber', class: 'bg-amber-500', label: 'Amber Glow' },
  ];

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-white mb-2 font-serif tracking-tight">Oracle Settings</h2>
        <p className="text-slate-400">Manage your real personas for accurate previews.</p>
      </div>

      {/* Account Linking Section */}
      <div className="bg-slate-900/50 rounded-3xl border border-slate-800 overflow-hidden mb-8">
        <div className="p-6 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center">
            <LinkIcon className="w-5 h-5 text-indigo-400 mr-2" />
            <h3 className="text-lg font-semibold text-slate-100">Profile Setup</h3>
          </div>
        </div>
        
        <div className="p-6 grid gap-4">
          {platforms.map((p) => {
            const profile = settings.linkedAccounts[p.name];
            const isLinked = !!profile;
            const isEditing = editingPlatform === p.name;

            if (isEditing) {
              return (
                <div key={p.name} className="bg-slate-800 rounded-2xl p-6 border border-indigo-500/50 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
                  <h4 className="text-white font-bold mb-4 flex items-center">
                    Setup {p.name} Profile
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Avatar Upload */}
                    <div className="md:col-span-1">
                      <label className="block text-xs font-medium text-slate-400 mb-2">Profile Photo</label>
                      <div className="w-full aspect-square bg-slate-900 rounded-xl overflow-hidden border border-slate-700 relative group">
                        {editForm.avatarUrl ? (
                          <img src={editForm.avatarUrl} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full text-slate-500">
                            <Upload className="w-8 h-8" />
                          </div>
                        )}
                        <input 
                           type="file" 
                           accept="image/*"
                           className="absolute inset-0 opacity-0 cursor-pointer"
                           onChange={(e) => {
                             if(e.target.files?.[0]) {
                               const reader = new FileReader();
                               reader.onloadend = () => setEditForm({...editForm, avatarUrl: reader.result as string});
                               reader.readAsDataURL(e.target.files[0]);
                             }
                           }}
                        />
                      </div>
                      <p className="text-xs text-center text-slate-500 mt-2">Tap to upload</p>
                    </div>

                    {/* Inputs */}
                    <div className="md:col-span-2 space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Display Name</label>
                        <input 
                          type="text" 
                          value={editForm.displayName}
                          onChange={(e) => setEditForm({...editForm, displayName: e.target.value})}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                          placeholder="e.g. John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Username / Handle</label>
                        <input 
                          type="text" 
                          value={editForm.username}
                          onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                          placeholder="e.g. johndoe_123"
                        />
                      </div>
                      <div className="flex space-x-3 mt-6">
                        <button 
                          onClick={saveProfile}
                          className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg font-medium transition"
                        >
                          Save Profile
                        </button>
                        <button 
                          onClick={() => setEditingPlatform(null)}
                          className="px-4 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg font-medium transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div 
                key={p.name} 
                className={`
                  relative overflow-hidden rounded-2xl border transition-all duration-300
                  ${isLinked ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-900/20 border-slate-800 border-dashed hover:border-slate-700'}
                `}
              >
                <div className="p-4 flex items-center justify-between">
                  {/* Left: Identity */}
                  <div className="flex items-center space-x-4">
                    {isLinked ? (
                       <img src={profile.avatarUrl} alt="Avatar" className="w-14 h-14 rounded-full border-2 border-slate-600 shadow-sm object-cover" />
                    ) : (
                       <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-inner opacity-80 ${p.color}`}>
                         {p.name.charAt(0)}
                       </div>
                    )}
                    
                    <div>
                      {isLinked ? (
                        <>
                          <h4 className="font-bold text-white text-lg">{profile.displayName}</h4>
                          <p className="text-sm text-slate-400 flex items-center">
                            {p.name} <span className="mx-2 text-slate-600">•</span> @{profile.username}
                          </p>
                        </>
                      ) : (
                        <>
                          <h4 className="font-bold text-slate-300">{p.name}</h4>
                          <p className="text-sm text-slate-500">Not connected</p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right: Action */}
                  <div className="flex space-x-2">
                    {isLinked ? (
                      <>
                         <button
                          onClick={() => startEditing(p.name)}
                          className="p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700 transition"
                          title="Edit Profile"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => unlinkAccount(p.name)}
                          className="p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-slate-700 border border-slate-700 transition"
                          title="Unlink"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => startEditing(p.name)}
                        className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-white text-slate-900 hover:bg-slate-200 shadow-lg shadow-indigo-500/10 transition"
                      >
                        Connect
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Appearance Section */}
      <div className="bg-slate-900/50 rounded-3xl border border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center">
            <Palette className="w-5 h-5 text-indigo-400 mr-2" />
            <h3 className="text-lg font-semibold text-slate-100">Theme</h3>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {colors.map((c) => (
              <button
                key={c.id}
                onClick={() => setTheme(c.id)}
                className={`
                  flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-200
                  ${settings.themeColor === c.id 
                    ? 'bg-slate-800 border-white/20 shadow-xl scale-105' 
                    : 'bg-slate-900/40 border-slate-800 hover:bg-slate-800 hover:border-slate-700'}
                `}
              >
                <div className={`w-8 h-8 rounded-full ${c.class} shadow-lg mb-3 ring-2 ring-white/10`}></div>
                <span className={`text-xs font-medium ${settings.themeColor === c.id ? 'text-white' : 'text-slate-500'}`}>
                  {c.label.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default SettingsView;