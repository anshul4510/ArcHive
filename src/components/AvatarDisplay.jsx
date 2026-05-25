import React, { useState } from 'react';
import { getInitials, getAvatarColor } from '../utils/avatarUtils';

const AvatarDisplay = ({ avatarUrl, displayName, username, size = 32 }) => {
  const [hasError, setHasError] = useState(false);
  const [prevAvatarUrl, setPrevAvatarUrl] = useState(avatarUrl);

  if (avatarUrl !== prevAvatarUrl) {
    setPrevAvatarUrl(avatarUrl);
    setHasError(false);
  }

  const showFallback = !avatarUrl || hasError;

  if (!showFallback && avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={displayName}
        onError={(e) => { 
          e.currentTarget.style.display = 'none';
          setHasError(true); 
        }}
        style={{ 
          width: size, 
          height: size, 
          borderRadius: '50%',
          objectFit: 'cover' 
        }}
      />
    );
  }

  return (
    <div style={{
      width: size, 
      height: size,
      borderRadius: '50%',
      background: getAvatarColor(username),
      display: 'flex', 
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Cinzel, serif',
      fontSize: size * 0.38,
      color: '#C8A96A',
      fontWeight: 500,
      flexShrink: 0,
    }}>
      {getInitials(displayName)}
    </div>
  );
};

export default AvatarDisplay;
