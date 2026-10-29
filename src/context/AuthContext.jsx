import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const DEMO_USERS = {
  customer: {
    id: 'user-demo-1',
    name: 'Gokilavani',
    email: 'gokilavani@example.com',
    role: 'customer',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    address: {
      street: '742 Lotus Boulevard, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      zip: '560038',
      country: 'India'
    },
    memberSince: 'March 2024'
  },
  admin: {
    id: 'admin-demo-1',
    name: 'Pooja Deshmukh (Admin)',
    email: 'admin@moonlightstore.com',
    role: 'admin',
    phone: '+91 98112 34567',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    address: {
      street: '100 Cyber City, Sector 24',
      city: 'Gurugram',
      state: 'Haryana',
      zip: '122002',
      country: 'India'
    },
    memberSince: 'January 2023'
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('moonlight_user') || localStorage.getItem('novastore_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed.name === 'Alex Morgan' || parsed.name === 'Aarav Sharma' || parsed.id === 'user-demo-1') {
          return {
            ...parsed,
            name: 'Gokilavani',
            email: parsed.email.includes('admin') ? parsed.email : 'gokilavani@example.com'
          };
        }
        return parsed;
      }
      return DEMO_USERS.customer;
    } catch {
      return DEMO_USERS.customer;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('moonlight_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('moonlight_user');
      localStorage.removeItem('novastore_user');
    }
  }, [user]);

  const login = (email, password) => {
    if (email.toLowerCase().includes('admin') || password === 'admin123') {
      setUser(DEMO_USERS.admin);
      return { success: true, user: DEMO_USERS.admin };
    }
    const loggedUser = {
      ...DEMO_USERS.customer,
      email: email,
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Shopper'
    };
    setUser(loggedUser);
    return { success: true, user: loggedUser };
  };

  const register = ({ name, email, password }) => {
    const newUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: 'customer',
      phone: '+1 (555) 000-0000',
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80`,
      address: {
        street: '123 Market St',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'United States'
      },
      memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    };
    setUser(newUser);
    return { success: true, user: newUser };
  };

  const quickLogin = (role = 'customer') => {
    const targetUser = role === 'admin' ? DEMO_USERS.admin : DEMO_USERS.customer;
    setUser(targetUser);
    return targetUser;
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updatedData) => {
    setUser(prev => {
      const nextUser = { ...prev, ...updatedData };
      return nextUser;
    });
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{
      user,
      isAdmin,
      login,
      register,
      quickLogin,
      logout,
      updateProfile,
      DEMO_USERS
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
