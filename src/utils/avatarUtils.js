

export function getInitials(displayName) {
  if (!displayName) return 'A';
  return displayName.trim().charAt(0).toUpperCase();
}

export function getAvatarColor(username) {
  if (!username) return 'rgba(200,169,106,0.25)';
  const sum = username.split('').reduce(
    (acc, ch) => acc + ch.charCodeAt(0), 0
  );
  const colors = [
    'rgba(200,169,106,0.25)',
    'rgba(200,169,106,0.35)',
    'rgba(56,130,220,0.20)',
    'rgba(56,180,180,0.20)',
    'rgba(200,160,60,0.20)',
    'rgba(150,150,150,0.18)',
  ];
  return colors[sum % colors.length];
}

