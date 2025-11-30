// src/context/AuthContext.js
import { createContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Recuperar sesión al iniciar
  useEffect(() => {
    const savedUser = sessionStorage.getItem("user_session");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        sessionStorage.removeItem("user_session");
      }
    }
    setLoading(false);
  }, []);

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
      console.log("Respuesta del backend:", data);

      const userData = {
        username: data.username, // 👈 Este es el teacherDocumentNumber del backend
        fullName: data.full_name,
        role: data.rol ? data.rol.toLowerCase() : '', 
        accessToken: data.access_token,
        redirect: data.redirect,
        correo: data.correo || data.email || data.username,
        grado_id: data.grado_id || null, 
      };

      setUser(userData);
      sessionStorage.setItem("user_session", JSON.stringify(userData));
      
      // ✅ TAMBIÉN GUARDAR EN LOCALSTORAGE PARA COMPATIBILIDAD
      localStorage.setItem("username", data.username);
      localStorage.setItem("accessToken", data.access_token);
      
      console.log("Usuario guardado:", userData);

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
    sessionStorage.removeItem("user_session");
    localStorage.removeItem("username");
    localStorage.removeItem("accessToken");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
export default AuthProvider;