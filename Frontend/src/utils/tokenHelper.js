// utils/tokenHelper.js
export const getToken = () => {
  // Check localStorage first (remember me option)
  let token = localStorage.getItem('itguru_token');
  
  // If not found, check sessionStorage
  if (!token) {
    token = sessionStorage.getItem('itguru_token');
  }
  
  return token;
};

export const removeToken = () => {
  localStorage.removeItem('itguru_token');
  sessionStorage.removeItem('itguru_token');
  localStorage.removeItem('student');
};

export const getAuthHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};