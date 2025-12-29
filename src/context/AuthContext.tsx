import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "@/services/auth";
import type { UserComplete } from "@/types";

interface AuthContextType {
  user: UserComplete | null;
  loading: boolean;
  setUser: (u: UserComplete | null) => void;
}

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserComplete | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
