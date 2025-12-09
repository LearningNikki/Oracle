import React, { useState } from 'react';
import { AnalysisData, SocialPlatform } from '../types';
import { ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';
import { Send, CheckCircle, TrendingUp, Sparkles, Copy, CalendarClock, Hash } from 'lucide-react';

interface ResultsViewProps {
  data: AnalysisData;
  onPost: (platform: SocialPlatform) => void;
  isPosting: boolean;
}

const ResultsView: React.FC<ResultsViewProps> = ({ data, onPost, isPosting }) => {
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform | null>(null);
  const [postedSuccess, setPostedSuccess] = useState(false);

  const scoreData = [
    {
      name: 'Virality',
      uv: 100, // Background track
      pv: 100,
      fill: '#334155',
    },
    {
      name: 'Score',
      uv: data.viralityScore,
      fill: data.viralityScore > 80 ? '#10b981' : data.viralityScore > 50 ? '#f59e0b' : '#ef4444',
    }
  ];

  const handlePostClick = () => {
    const target = selectedPlatform || data.suggestedPlatforms[0];
    if (target) {
      onPost(target);
      setPostedSuccess(true);
      setTimeout(() => setPostedSuccess(false), 3000);
    }
  };

  const copyCaption = () => {
    if (data.improvedCaption) {
      navigator.clipboard.writeText(data.improvedCaption);
      alert("Caption copied!");
    }
  };

  return (
    <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800 rounded-3xl p-8 shadow-2xl animate-in slide-in-from-bottom-8 duration-700">
      
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-2 bg-indigo-500/20 rounded-lg">
           <TrendingUp className="w-6 h-6 text-indigo-400" />
        </div>
        <h2 className="text-2xl font-bold text-white font-serif">Oracle Analysis</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Score */}
        <div className="col-span-1 bg-slate-950/50 rounded-2xl p-6 border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent"></div>
           
           <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-4">Virality Score</h3>
           
           <div className="relative w-48 h-48 flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
               <RadialBarChart 
                 innerRadius="80%" 
                 outerRadius="100%" 
                 barSize={10} 
                 data={scoreData} 
                 startAngle={90} 
                 endAngle={-270}
               >
                 <RadialBar
                   background
                   dataKey="uv"
                 />
                 <RadialBar
                   dataKey="uv" // Actually using uv for color mapping logic above
                   fill={scoreData[1].fill}
                 />
               </RadialBarChart>
             </ResponsiveContainer>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
               <span className="text-5xl font-bold text-white">{data.viralityScore}</span>
               <span className="text-xs text-slate-500 mt-1">/ 100</span>
             </div>
           </div>

           <div className="mt-6 w-full">
              <div className="flex items-center justify-between text-sm text-slate-400 mb-2">
                <span className="flex items-center"><CalendarClock className="w-4 h-4 mr-2 text-indigo-400"/> Best Time:</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-center text-indigo-300 font-semibold shadow-inner">
                {data.bestTimeToPost || "Tomorrow at 6:00 PM"}
              </div>
           </div>
        </div>

        {/* Middle Col: Insights */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          
          {/* Reasoning */}
          <div className="bg-slate-950/30 rounded-2xl p-6 border border-slate-800/50">
            <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
              <Sparkles className="w-4 h-4 mr-2 text-yellow-400" /> Insight
            </h3>
            <p className="text-slate-300 leading-relaxed text-sm md:text-base">
              {data.reasoning}
            </p>
          </div>

          {/* Improved Caption */}
          {data.improvedCaption && (
            <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 rounded-2xl p-6 border border-indigo-500/20 relative group">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-indigo-200">Suggested Caption</h3>
                <button 
                  onClick={copyCaption}
                  className="text-indigo-400 hover:text-white transition opacity-0 group-hover:opacity-100"
                  title="Copy caption"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>
              <p className="text-indigo-100/90 italic text-sm md:text-base whitespace-pre-wrap">
                "{data.improvedCaption}"
              </p>
            </div>
          )}

          {/* Hashtags */}
          <div className="flex flex-wrap gap-2">
            {data.hashtags.map((tag, idx) => (
              <span key={idx} className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full text-xs font-medium border border-slate-700 flex items-center hover:bg-slate-700 transition cursor-default">
                <Hash className="w-3 h-3 mr-1 text-slate-500" />
                {tag.replace('#', '')}
              </span>
            ))}
          </div>

        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2 text-slate-400 text-sm">
          <span>Recommended for:</span>
          <div className="flex space-x-2">
            {data.suggestedPlatforms.map(p => (
              <span key={p} className="text-white font-medium bg-slate-800 px-2 py-1 rounded-md text-xs border border-slate-700">
                {p}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={handlePostClick}
          disabled={isPosting || postedSuccess}
          className={`
            px-8 py-3 rounded-xl font-bold text-white shadow-lg flex items-center transition-all transform hover:-translate-y-1
            ${postedSuccess 
              ? 'bg-green-600 hover:bg-green-700 ring-2 ring-green-500/50' 
              : 'bg-white text-slate-900 hover:bg-indigo-50 hover:text-indigo-900 hover:shadow-indigo-500/20'}
          `}
        >
          {isPosting ? (
            "Uploading..."
          ) : postedSuccess ? (
            <>
              <CheckCircle className="w-5 h-5 mr-2" /> Posted!
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" /> Post to {selectedPlatform || data.suggestedPlatforms[0]}
            </>
          )}
        </button>
      </div>

    </div>
  );
};

export default ResultsView;