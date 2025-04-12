import React, { createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

const API_URL = 'http://localhost:3000'

const AuthProvider = ({ children }) => {
  const [author, setAuthor] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      fetchAuthor(token)
    } else {
      localStorage.clear()
      setLoading(false)
    }
  }, []);

  const fetchAuthor = async (token) => {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json();
        setAuthor(data);
      } else {
        localStorage.clear()
        throw new Error('Failed to fetch author');
      }
    } catch (error) {
      localStorage.clear()
      console.error('Error fetching author:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
        console.log("login")
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        await setToken(data.token)
        await setAuthor(data.author);
        window.location = "/"
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
        console.log("register")
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        setToken(data.token)
        setAuthor(data.authorId)
        navigate('/')
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null)
    setAuthor(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ author, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };