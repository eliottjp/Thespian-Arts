import { createContext, useContext, useState, ReactNode } from "react";

const AdminContext = createContext<{
  isAdmin: boolean;
  toggleAdminMode: () => void;
}>({
  isAdmin: false,
  toggleAdminMode: () => {},
});

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);

  const toggleAdminMode = () => setIsAdmin((prev) => !prev);

  return (
    <AdminContext.Provider value={{ isAdmin, toggleAdminMode }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminMode = () => useContext(AdminContext);
