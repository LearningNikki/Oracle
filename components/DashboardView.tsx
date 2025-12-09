import React, { useState, useEffect } from 'react';
import { SocialPlatform, AppSettings, ThemeColor, AnalysisData, SavedState, PostVibe } from '../types';
import { analyzePostPotential } from '../services/gemini';
import ImageUploader from './ImageUploader';
import PostEditor from './PostEditor';
import ResultsView from './ResultsView';
import PostPreview from './PostPreview';
import { Loader2, AlertCircle, RefreshCw, Sparkles, Instagram, Facebook, Twitter, Linkedin, Video, Link as LinkIcon, Eye, Phone } from 'lucide-react';

interface DashboardViewProps {
  settings: AppSettings;
  themeColor: ThemeColor;
  onGoToSettings: () => void;
  setLastSaved: (ts: number | null) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ settings, themeColor, onGoToSettings, setLastSaved }) => {
  const STORAGE_KEY = 'viralvision_oracle_draft';

  // State
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform>(SocialPlatform.Instagram);
  const [image, setImage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [postVibe, setPostVibe] = useState<PostVibe>('Authentic');
  
  // Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);

  // Load Saved Draft
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed: SavedState = JSON.parse(savedData);
        if (parsed.imageData) setImage(parsed.imageData);
        if (parsed.caption) setCaption(parsed.caption);
        if (parsed.hashtags) setHashtags(parsed.hashtags);
        if (parsed.lastSaved) setLastSaved(parsed.lastSaved);
      } catch (e) {
        console.error("Failed to parse draft", e);
      }
    }
  }, [setLastSaved]);

  // Auto-Save
  useEffect(() => {
    const timer = setTimeout(() => {
      const now = Date.now();
      const stateToSave: SavedState = {
        caption,
        hashtags,
        imageData: image,
        lastSaved: now
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
      setLastSaved(now);
    }, 1500);
    return () => clearTimeout(timer);
  }, [caption, hashtags, image, setLastSaved]);

  const handleAnalyze = async () => {
    // Validation: Require at least ONE (Image OR Caption)
    if (!caption.trim() && !image) {
      setError("Please add an image OR a caption to analyze.");
      return;
    }
    
    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    try {
      // Get linked profile if available
      const userProfile = settings.linkedAccounts[selectedPlatform];

      const result = await analyzePostPotential(
        image, 
        caption, 
        hashtags, 
        selectedPlatform, 
        postVibe,
        userProfile
      );
      setAnalysisResult(result);
      
      // Scroll to results
      setTimeout(() => {
        document.getElementById('oracle-results')?.scrollIntoView({ behavior: 'smooth' });
      }, 200);

    } catch (e) {
      setError("The Oracle is clouded. Please check your connection.");
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePost = (target: SocialPlatform) => {
    setIsPosting(true);
    setTimeout(() => {
      setIsPosting(false);
      alert(`Sent to ${target}! (Simulation)`);
    }, 1500);
  };

  const handleClear = () => {
    if(confirm("Clear current draft?")) {
      setImage(null);
      setCaption('');
      setHashtags('');
      setAnalysisResult(null);
      localStorage.removeItem(STORAGE_KEY);
      setLastSaved(null);
    }
  };

  const platforms = [
    { id: SocialPlatform.Instagram, icon: <Instagram className="w-5 h-5" />, color: 'hover:text-pink-500 peer-checked:bg-pink-600 peer-checked:border-pink-500' },
    { id: SocialPlatform.Facebook, icon: <Facebook className="w-5 h-5" />, color: 'hover:text-blue-600 peer-checked:bg-blue-600 peer-checked:border-blue-500' },
    { id: SocialPlatform.WhatsApp, icon: <Phone className="w-5 h-5" />, color: 'hover:text-green-500 peer-checked:bg-green-500 peer-checked:border-green-400' },
    { id: SocialPlatform.Twitter, icon: <Twitter className="w-5 h-5" />, color: 'hover:text-sky-500 peer-checked:bg-sky-500 peer-checked:border-sky-400' },
    { id: SocialPlatform.TikTok, icon: <Video className="w-5 h-5" />, color: 'hover:text-slate-200 peer-checked:bg-black peer-checked:border-slate-600' },
    { id: SocialPlatform.LinkedIn, icon: <Linkedin className="w-5 h-5" />, color: 'hover:text-blue-700 peer-checked:bg-blue-700 peer-checked:border-blue-600' },
  ];

  const getButtonGradient = () => {
    switch(themeColor) {
      case 'rose': return 'from-rose-600 to-orange-600';
      case 'emerald': return 'from-emerald-600 to-teal-600';
      case 'amber': return 'from-amber-600 to-yellow-500';
      default: return 'from-indigo-600 to-violet-600';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">

      {/* 1. Platform Selector Row */}
      <div className="flex flex-col items-center space-y-4 mb-8">
        <div className="flex flex-wrap justify-center gap-6">
          {platforms.map((p) => {
             const isLinked = !!settings.linkedAccounts[p.id];
             return (
              <label key={p.id} className="relative cursor-pointer group">
                <input 
                  type="radio" 
                  name="platform" 
                  className="peer sr-only" 
                  checked={selectedPlatform === p.id}
                  onChange={() => setSelectedPlatform(p.id)}
                />
                <div className={`
                  w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300
                  bg-slate-900 border-slate-700 text-slate-400 shadow-xl
                  peer-checked:text-white peer-checked:scale-110 peer-checked:shadow-2xl peer-checked:border-transparent
                  ${p.color}
                `}>
                  {p.icon}
                </div>
                {/* Linked Status Indicator */}
                {isLinked && (
                   <img 
                    src={settings.linkedAccounts[p.id]?.avatarUrl} 
                    alt="Linked"
                    className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-slate-950 shadow-md object-cover"
                   />
                )}
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-medium text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {p.id}
                </span>
              </label>
             );
          })}
        </div>
      </div>

      {/* 2. Main Editor Area */}
      <div className="bg-slate-900/40 backdrop-blur-sm rounded-3xl border border-slate-800 p-6 md:p-8 relative overflow-hidden">
        {/* Decorative BG */}
        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${getButtonGradient()}`}></div>

        <div className="flex justify-between items-center mb-8">
           <div className="flex items-center space-x-3">
             <div className="p-2 bg-slate-800 rounded-lg">
                <Sparkles className="w-5 h-5 text-indigo-400" />
             </div>
             <div>
               <h2 className="text-xl font-bold text-white">Create Post</h2>
               <p className="text-xs text-slate-400">Targeting: <span className="text-slate-200">{selectedPlatform}</span></p>
             </div>
           </div>
           
           <button onClick={handleClear} className="text-xs text-slate-500 hover:text-red-400 flex items-center transition-colors px-3 py-1.5 rounded-full hover:bg-slate-800">
             <RefreshCw className="w-3 h-3 mr-1" /> Reset
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left: Image & Preview */}
          <div className="md:col-span-5 flex flex-col space-y-6">
            <ImageUploader image={image} onImageChange={setImage} />
            
            {/* Live Preview Card */}
            <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800">
              <div className="flex items-center space-x-2 mb-4 text-slate-400 text-xs uppercase tracking-widest font-semibold">
                <Eye className="w-3 h-3" />
                <span>Live Preview</span>
              </div>
              <div className="transform scale-95 origin-top">
                <PostPreview 
                  platform={selectedPlatform} 
                  image={image} 
                  caption={caption}
                  userProfile={settings.linkedAccounts[selectedPlatform]}
                />
              </div>
            </div>

            {/* Linked Profile Linker */}
            {!settings.linkedAccounts[selectedPlatform] && (
               <button 
                onClick={onGoToSettings} 
                className="flex items-center justify-between w-full p-3 rounded-xl border border-dashed border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 hover:bg-slate-800/50 transition group"
               >
                 <div className="flex items-center">
                   <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center mr-3 group-hover:bg-slate-700">
                     <LinkIcon className="w-4 h-4" />
                   </div>
                   <div className="text-left">
                     <p className="text-sm font-medium">Setup {selectedPlatform} Profile</p>
                     <p className="text-xs text-slate-500">For accurate profile preview</p>
                   </div>
                 </div>
               </button>
            )}
          </div>

          {/* Right: Text & Config */}
          <div className="md:col-span-7 flex flex-col justify-between">
            <PostEditor 
              caption={caption} 
              setCaption={setCaption} 
              hashtags={hashtags} 
              setHashtags={setHashtags}
              vibe={postVibe}
              setVibe={setPostVibe}
            />

            <div className="mt-8">
              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                  {error}
                </div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className={`
                  w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center transition-all shadow-xl
                  bg-gradient-to-r ${getButtonGradient()} hover:shadow-indigo-500/20 text-white
                  disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.99]
                `}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Consulting Oracle...
                  </>
                ) : (
                  "Analyze Potential"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Results Section */}
      <div id="oracle-results">
        {analysisResult && (
          <ResultsView 
            data={analysisResult} 
            onPost={handlePost}
            isPosting={isPosting}
          />
        )}
      </div>

    </div>
  );
};

export default DashboardView;