import React from 'react';
import { Type, Hash, Zap } from 'lucide-react';
import { PostVibe } from '../types';

interface PostEditorProps {
  caption: string;
  setCaption: (s: string) => void;
  hashtags: string;
  setHashtags: (s: string) => void;
  vibe: PostVibe;
  setVibe: (v: PostVibe) => void;
}

const PostEditor: React.FC<PostEditorProps> = ({ caption, setCaption, hashtags, setHashtags, vibe, setVibe }) => {
  const vibes: PostVibe[] = ['Authentic', 'Spicy', 'Professional', 'Savage', 'Inspirational', 'Funny'];

  const handleVibeClick = (v: PostVibe) => {
    if (typeof setVibe === 'function') {
      setVibe(v);
    } else {
      console.error("setVibe prop is not a function", setVibe);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Vibe Selector */}
      <div>
        <label className="flex items-center text-sm font-medium text-slate-300 mb-2">
          <Zap className="w-4 h-4 mr-2 text-yellow-400" />
          2. Select Vibe
        </label>
        <div className="flex flex-wrap gap-2">
          {vibes.map((v) => (
            <button
              key={v}
              onClick={() => handleVibeClick(v)}
              className={`
                px-3 py-1.5 rounded-lg text-xs font-medium transition-all border
                ${vibe === v 
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/50' 
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-750'}
              `}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Caption Input */}
      <div>
        <label className="flex items-center text-sm font-medium text-slate-300 mb-2">
          <Type className="w-4 h-4 mr-2 text-indigo-400" />
          3. Draft Caption
        </label>
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Write something engaging..."
          className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition resize-none h-32"
        />
        <div className="text-right mt-1">
          <span className={`text-xs ${caption.length > 2200 ? 'text-red-400' : 'text-slate-500'}`}>
            {caption.length} chars
          </span>
        </div>
      </div>

      {/* Hashtag Input */}
      <div>
        <label className="flex items-center text-sm font-medium text-slate-300 mb-2">
          <Hash className="w-4 h-4 mr-2 text-pink-400" />
          4. Add Hashtags
        </label>
        <div className="relative">
          <textarea
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            placeholder="#viral #trending #fyp"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition resize-none h-20"
          />
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Separate tags with spaces. We'll suggest optimized ones later.
        </p>
      </div>
    </div>
  );
};

export default PostEditor;