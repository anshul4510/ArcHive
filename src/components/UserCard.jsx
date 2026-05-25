import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

const UserCard = ({ user, showFollowButton, onFollow, isFollowingState, isOwnUser }) => {
  return (
    <div className="flex items-center justify-between bg-white border border-[#C8A96A]/15 rounded-[10px] p-4 hover:border-[#C8A96A]/30 transition-colors">
      <Link to={`/profile/${user.username}`} className="flex items-center space-x-3 group">
        {user.avatar_url ? (
          <img src={user.avatar_url} alt={user.display_name} className="w-10 h-10 rounded-full object-cover border border-[#C8A96A]/20" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-[#C8A96A]/10 text-[#C8A96A] flex items-center justify-center font-serif text-[16px] border border-[#C8A96A]/20">
            {user.display_name?.charAt(0).toUpperCase() || 'A'}
          </div>
        )}
        <div>
          <div className="flex items-center space-x-1.5">
            <h4 className="font-sans font-medium text-[14px] text-[#1A1A1A] group-hover:text-[#C8A96A] transition-colors">{user.display_name}</h4>
            {user.is_verified && (
              <span className="flex items-center justify-center w-3 h-3 bg-[#C8A96A] rounded-full">
                <Check className="w-2 h-2 text-white" strokeWidth={3} />
              </span>
            )}
          </div>
          <div className="flex space-x-2 font-mono text-[11px] text-[#6B6860]">
            <span>@{user.username}</span>
            <span>•</span>
            <span className="truncate max-w-[120px] sm:max-w-[150px]">{user.title || 'Architect'}</span>
          </div>
        </div>
      </Link>
      
      {showFollowButton && !isOwnUser && (
        <button 
          onClick={(e) => { e.preventDefault(); onFollow?.(); }}
          className={`px-4 py-1.5 rounded-full font-sans text-[12px] transition-all group relative ${
            isFollowingState 
              ? 'bg-transparent border border-[#C8A96A] text-[#C8A96A] hover:border-red-400 hover:text-red-500' 
              : 'bg-[#C8A96A] border border-[#C8A96A] text-[#1A1A1A] hover:bg-[#A8894A]'
          }`}
        >
          {isFollowingState ? (
            <>
              <span className="group-hover:hidden flex items-center">Following <Check className="w-3 h-3 ml-1" /></span>
              <span className="hidden group-hover:block">Unfollow</span>
            </>
          ) : 'Follow'}
        </button>
      )}
    </div>
  );
};

export default UserCard;
