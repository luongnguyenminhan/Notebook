// services/api/user.ts
export const getUser = async (userId: string) => {
  // Mock API call
  return { id: userId, name: 'John Doe' };
};
