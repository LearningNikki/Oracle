import React from 'react';
import { SocialPlatform, UserProfile } from '../types';
import { Heart, MessageCircle, Send, MoreHorizontal, Bookmark, Share2, Repeat, ThumbsUp, Phone, Video } from 'lucide-react';

interface PostPreviewProps {
  platform: SocialPlatform;
  image: string | null;
  caption: string;
  userProfile?: UserProfile | null;
}

const PostPreview: React.FC<PostPreviewProps> = ({ platform, image, caption, userProfile }) => {
  const username = userProfile?.username || "your_username";
  const displayName = userProfile?.displayName || "Your Name";
  // Default fallback if no avatar
  const avatar = userProfile?.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${displayName}`;

  // Helper to render caption with line breaks
  const renderCaption = () => {
    if (!caption) return <span className="text-slate-500 italic">No caption yet...</span>;
    return <span className="whitespace-pre-wrap">{caption}</span>;
  };

  if (platform === SocialPlatform.WhatsApp) {
    return (
      <div className="bg-[#0b141a] text-white rounded-xl overflow-hidden border border-slate-800 shadow-xl max-w-sm mx-auto font-sans h-[550px] relative flex flex-col">
        {/* Status Header */}
        <div className="absolute top-0 left-0 right-0 p-2 z-10 flex gap-1">
          <div className="h-1 bg-white rounded-full flex-1"></div>
          <div className="h-1 bg-white/30 rounded-full flex-1"></div>
        </div>
        
        <div className="flex items-center p-4 mt-2 z-10">
          <img src={avatar} className="w-10 h-10 rounded-full border border-white/20 object-cover" alt="Avatar" />
          <div className="ml-3">
             <div className="font-bold text-sm">{displayName}</div>
             <div className="text-xs text-slate-300">Just now</div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col justify-center items-center relative">
          {image ? (
            <img src={image} className="w-full h-auto max-h-full object-contain" alt="Status" />
          ) : (
            <div className="bg-emerald-700 w-full h-full flex items-center justify-center p-6 text-center text-xl font-bold">
               {caption || "Type a status..."}
            </div>
          )}
          
          {image && caption && (
             <div className="absolute bottom-20 w-full bg-black/40 backdrop-blur-sm p-4 text-center">
                {caption}
             </div>
          )}
        </div>

        {/* Reply Area */}
        <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent flex flex-col items-center">
           <div className="text-xs text-white/70 mb-2 font-bold animate-bounce">^ Reply</div>
        </div>
      </div>
    );
  }

  if (platform === SocialPlatform.Instagram) {
    return (
      <div className="bg-white text-black rounded-xl overflow-hidden border border-slate-200 shadow-xl max-w-sm mx-auto font-sans">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <img src={avatar} className="w-8 h-8 rounded-full border border-gray-200 object-cover" alt="Avatar" />
            <span className="text-sm font-semibold">{username}</span>
          </div>
          <MoreHorizontal className="w-5 h-5 text-gray-600" />
        </div>
        
        {/* Image */}
        <div className="bg-gray-100 min-h-[300px] flex items-center justify-center overflow-hidden">
          {image ? (
            <img src={image} className="w-full h-auto object-cover" alt="Post" />
          ) : (
            <div className="text-gray-400 text-sm">Image Preview</div>
          )}
        </div>

        {/* Actions */}
        <div className="p-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-4">
              <Heart className="w-6 h-6 text-black hover:text-red-500 cursor-pointer" />
              <MessageCircle className="w-6 h-6 text-black -rotate-90" />
              <Send className="w-6 h-6 text-black" />
            </div>
            <Bookmark className="w-6 h-6 text-black" />
          </div>
          <div className="text-sm font-semibold mb-1">1,234 likes</div>
          <div className="text-sm">
            <span className="font-semibold mr-2">{username}</span>
            {renderCaption()}
          </div>
        </div>
      </div>
    );
  }

  if (platform === SocialPlatform.Twitter) {
    return (
      <div className="bg-black text-white rounded-xl overflow-hidden border border-gray-800 shadow-xl max-w-sm mx-auto font-sans p-4">
        <div className="flex space-x-3">
          <img src={avatar} className="w-10 h-10 rounded-full object-cover" alt="Avatar" />
          <div className="flex-1">
            <div className="flex items-center space-x-1 mb-1">
              <span className="font-bold text-[15px]">{displayName}</span>
              <span className="text-gray-500 text-[15px]">@{username} · 2h</span>
            </div>
            <div className="text-[15px] mb-3 whitespace-pre-wrap">
              {caption || <span className="text-gray-600 italic">Drafting tweet...</span>}
            </div>
            
            {image && (
              <div className="rounded-2xl overflow-hidden border border-gray-800 mb-3">
                <img src={image} className="w-full h-auto" alt="Tweet media" />
              </div>
            )}

            <div className="flex items-center justify-between text-gray-500 max-w-md pr-4">
              <div className="flex items-center space-x-1 hover:text-blue-400 text-xs">
                <MessageCircle className="w-4 h-4" /> <span>24</span>
              </div>
              <div className="flex items-center space-x-1 hover:text-green-400 text-xs">
                <Repeat className="w-4 h-4" /> <span>12</span>
              </div>
              <div className="flex items-center space-x-1 hover:text-pink-500 text-xs">
                <Heart className="w-4 h-4" /> <span>89</span>
              </div>
              <div className="flex items-center space-x-1 hover:text-blue-400 text-xs">
                <Share2 className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (platform === SocialPlatform.Facebook) {
    return (
      <div className="bg-white text-black rounded-xl overflow-hidden border border-gray-200 shadow-xl max-w-sm mx-auto font-sans">
        <div className="p-3 flex items-center space-x-2">
          <img src={avatar} className="w-10 h-10 rounded-full object-cover" alt="Avatar" />
          <div>
            <div className="font-semibold text-sm">{displayName}</div>
            <div className="text-xs text-gray-500 flex items-center">
              2 hrs · <div className="w-3 h-3 ml-1 bg-gray-400 rounded-full opacity-50"></div>
            </div>
          </div>
          <div className="flex-grow"></div>
          <MoreHorizontal className="w-5 h-5 text-gray-500" />
        </div>

        <div className="px-3 pb-3 text-sm whitespace-pre-wrap">
          {caption || <span className="text-gray-400 italic">What's on your mind?</span>}
        </div>

        {image && (
          <div className="bg-gray-100 overflow-hidden">
            <img src={image} className="w-full h-auto" alt="FB Post" />
          </div>
        )}

        <div className="px-3 py-2 flex items-center justify-between text-xs text-gray-500 border-b border-gray-100">
           <span>👍 ❤️ 142</span>
           <span>34 comments</span>
        </div>

        <div className="flex items-center justify-around p-2">
          <button className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 px-4 py-1 rounded-lg">
            <ThumbsUp className="w-5 h-5" /> <span className="text-sm font-medium">Like</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 px-4 py-1 rounded-lg">
            <MessageCircle className="w-5 h-5" /> <span className="text-sm font-medium">Comment</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 px-4 py-1 rounded-lg">
            <Share2 className="w-5 h-5" /> <span className="text-sm font-medium">Share</span>
          </button>
        </div>
      </div>
    );
  }

  // Default / Other Platforms
  return (
    <div className="bg-slate-800 text-white rounded-xl overflow-hidden border border-slate-700 shadow-xl max-w-sm mx-auto font-sans p-4">
      <div className="flex items-center space-x-3 mb-4">
        <img src={avatar} className="w-10 h-10 rounded-full object-cover" alt="Avatar" />
        <div>
           <div className="font-bold">{displayName}</div>
           <div className="text-xs text-slate-400">@{username}</div>
        </div>
      </div>
      {image && <img src={image} className="w-full rounded-lg mb-4 border border-slate-700" alt="Preview" />}
      <div className="text-sm text-slate-300 whitespace-pre-wrap">
        {caption || "Drafting content..."}
      </div>
    </div>
  );
};

export default PostPreview;