import { createContext, useState } from "react";

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (username, password) => {
    setLoading(true);
    try {
      

      const response = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

     

      if (!response.ok) throw new Error("Credenciales incorrectas");

      const data = await response.json();
     

      const userData = {
        username: data.username,
        fullName: data.full_name,
        role: data.role || data.rol,
        accessToken: data.access_token,
        redirect: data.redirect,
      };

      
      setUser(userData);

      return { success: true, redirect: data.redirect };

    } catch (error) {
      console.error("Error en login:", error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
    
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
export default AuthProvider;
