import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);  // user data (null if not logged in)

  useEffect(() => {
    try {
      // Check for user authentication on page load
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser); // Update the state with the parsed user
      }
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      // Optionally clear invalid data
      localStorage.removeItem('user');
    }
  }, []);

  const login = (userData) => {
    
    setUser(userData);
    console.log(userData);
    localStorage.setItem('user', JSON.stringify(userData)); // Store user in localStorage
    navigate("/");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');  // Remove user from localStorage
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
