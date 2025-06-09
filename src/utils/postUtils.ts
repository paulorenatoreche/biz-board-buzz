
// Utility functions for post management

export const getCurrentUserId = (): string => {
  let userId = localStorage.getItem('currentUserId');
  if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('currentUserId', userId);
  }
  return userId;
};

export const createPostWithCreator = (postData: any) => {
  const currentUserId = getCurrentUserId();
  return {
    ...postData,
    creatorId: currentUserId
  };
};
