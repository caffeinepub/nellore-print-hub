import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CustomerSession {
  customerId: string;
  identifier: string; // email or mobile
}

interface CustomerAuthContextType {
  customer: CustomerSession | null;
  isAuthenticated: boolean;
  login: (customerId: string, identifier: string) => void;
  logout: () => void;
}

const CustomerAuthContext = createContext<CustomerAuthContextType>({
  customer: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

const SESSION_KEY = 'customer_session';

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<CustomerSession | null>(() => {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = (customerId: string, identifier: string) => {
    const session: CustomerSession = { customerId, identifier };
    setCustomer(session);
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  };

  const logout = () => {
    setCustomer(null);
    localStorage.removeItem(SESSION_KEY);
  };

  return (
    <CustomerAuthContext.Provider value={{ customer, isAuthenticated: !!customer, login, logout }}>
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  return useContext(CustomerAuthContext);
}
