import NavbarAdmin from "../../components/layout/Navbar/NavbarModulo";
import RoleDashboard from "../../components/ui/Dashboard"
import "./Estudiante.css"


import React from 'react'

const Estudiante = () => {
  return (
   <div className="student-container">
      <NavbarAdmin />
      <RoleDashboard role="estudiante" />
    </div>
  )
}

export default Estudiante
