


// validate user role
export const isValidRole = (role: string): role is 'contributor' | 'maintainer' => {
  return role === 'contributor' || role === 'maintainer';
};