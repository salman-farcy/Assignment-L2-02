


// validate user role
export const isValidRole = (role: string): role is 'contributor' | 'maintainer' => {
  return role === 'contributor' || role === 'maintainer';
};

// Validate isssue title (max 150 chracters)
export const isValidTitle = (title: string): boolean => {
  return title.length > 0 && title.length <= 150;
};


// validate issue description (min 20 characters)
export const isValidDescription = (description: string): boolean => {
  return description.length >= 20;
};


// validate issue type
export const isValidType = (type: string): type is 'bug' | 'feature_request' => {
  return type === 'bug' || type === 'feature_request';
};


//Validate issue status
export const isValidStatus = (status: string): status is 'open' | 'in_progress' | 'resolved' => {
  return status === 'open' || status === 'in_progress' || status === 'resolved';
};