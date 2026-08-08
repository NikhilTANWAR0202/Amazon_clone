import { createContext, useContext, useEffect, useState } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async () => {
    try {
      const res = await api.get('/auth/profile')
      setUser(res.data.user)
    } catch (err) {
      setUser(null)
      localStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const login = async (values) => {
    const res = await api.post('/auth/login', values)
    if (res.data.token) {
      localStorage.setItem('token', res.data.token)
    }
    setUser(res.data.user)
    return res.data
  }
  const adminLogin = async (values) => {
  const res = await api.post('/auth/admin/login', values);

  if (res.data.token) {
    localStorage.setItem('token', res.data.token);
  }

  setUser(res.data.user);
  return res.data;
};

  const register = async (values) => {
    const res = await api.post('/auth/register', values)
    if (res.data.token) {
      localStorage.setItem('token', res.data.token)
    }
    setUser(res.data.user)
    return res.data
  }

  const updateProfile = async (values) => {
    const res = await api.put('/auth/profile', values)
    setUser(res.data.user)
    return res.data
  }

  const logout = async () => {
    await api.post('/auth/logout')
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
<AuthContext.Provider
  value={{
    user,
    loading,
    login,
    adminLogin,
    register,
    logout,
    fetchProfile,
    updateProfile,
    setUser
  }}
>      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
