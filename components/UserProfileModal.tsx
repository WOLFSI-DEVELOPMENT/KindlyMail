import React, { useState, useEffect } from 'react';
import { X, User, Link as LinkIcon, LogOut, Check, Loader2, Upload } from 'lucide-react';
import { supabase } from '../services/supabase';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onSignOut: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose, user, onSignOut }) => {
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFullName(user.user_metadata?.full_name || '');
      setAvatarUrl(user.user_metadata?.avatar_url || '');
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsLoading(true);
    setMessage(null);

    const { data, error } = await supabase.auth.updateUser({
      data: {
        full_name: fullName,
        avatar_url: avatarUrl
      }
    });

    setIsLoading(false);

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('Profile updated successfully!');
      setTimeout(() => {
        setMessage(null);
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-stone-900/20 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-in zoom-in-95 fade-in duration-300">
        
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-display font-bold text-stone-900">Edit Profile</h2>
          <button onClick={onClose} className="p-2 hover:bg-stone-50 rounded-full text-stone-400 hover:text-stone-900 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-stone-100 border-4 border-white shadow-lg overflow-hidden mb-4 relative group">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-stone-300">
                <User size={40} />
              </div>
            )}
          </div>
          <p className="text-stone-500 text-sm">{user?.email}</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-stone-900 uppercase tracking-wide ml-3 mb-2 block">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
              <input 
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your Name"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-11 pr-4 py-3 text-stone-900 focus:outline-none focus:ring-2 focus:ring-black/5"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-stone-900 uppercase tracking-wide ml-3 mb-2 block">Avatar URL</label>
            <div className="relative">
              <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
              <input 
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-11 pr-4 py-3 text-stone-900 focus:outline-none focus:ring-2 focus:ring-black/5"
              />
            </div>
          </div>

          {message && (
            <div className={`text-sm text-center p-2 rounded-lg ${message.includes('Error') ? 'text-red-500 bg-red-50' : 'text-green-600 bg-green-50'}`}>
              {message}
            </div>
          )}

          <button 
            onClick={handleSave}
            disabled={isLoading}
            className="w-full bg-black text-white rounded-xl py-3.5 font-bold hover:bg-stone-800 transition-all shadow-lg shadow-stone-200 mt-2 flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
            Save Changes
          </button>

          <div className="w-full h-px bg-stone-100 my-4"></div>

          <button 
            onClick={onSignOut}
            className="w-full bg-white border border-stone-200 text-stone-600 rounded-xl py-3.5 font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all flex items-center justify-center gap-2"
          >
            <LogOut size={18} />
            Log Out
          </button>
        </div>

      </div>
    </div>
  );
};