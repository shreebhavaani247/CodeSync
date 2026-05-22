// Utility functions
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const generateRoomId = () => {
  return Math.random().toString(36).substring(2, 9).toUpperCase();
};

export const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};
