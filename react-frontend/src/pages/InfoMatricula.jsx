import Navbar from "../components/layout/Navbar/Navbar";
import "./InfoMatricula.css";
import { useState } from "react";

const InfoMatricula = () => {
  const [expanded, setExpanded] = useState(null);

  const toggleContent = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  return (
    <div>
      <Navbar />
      <div className="section-admissions">
        <div className="title-admissions">
          <h1>¡Bienvenido al Proceso de Admisiones 2026!</h1>
          <p>
            Toda la información necesaria para aplicar al proceso de admision.
          </p>
        </div>
        <div className="admissions">
          <div className="container-admissions">
            <div 
              className="header-admissions" 
              onClick={() => toggleContent(1)}
            >
              <h2>1. SOLICITUD INICIAL</h2>
              <div className="toggle-icon">
                {expanded === 1 ? '−' : '+'}
              </div>
            </div>
            <div className={`content-admissions ${expanded === 1 ? 'expanded' : ''}`}>
              <p>
                Para el 2026 tenemos cupos en todos los grados: Prejardín,
                Jardín, Transición, toda la primaria y todo el bachillerato
                hasta grado once.
              </p>
              <ul>
                <li>
                  <strong>Prejardín:</strong> 3 años cumplidos a abril de 2026
                </li>
                <li>
                  <strong>Jardín:</strong> 4 años cumplidos a abril de 2026
                </li>
                <li>
                  <strong>Transición:</strong> 5 años cumplidos en abril de 2026
                </li>
              </ul>
            </div>
          </div>

          <div className="container-admissions">
            <div 
              className="header-admissions" 
              onClick={() => toggleContent(2)}
            >
              <h2>2. DOCUMENTOS REQUERIDOS</h2>
              <div className="toggle-icon">
                {expanded === 2 ? '−' : '+'}
              </div>
            </div>
            <div className={`content-admissions ${expanded === 2 ? 'expanded' : ''}`}>
              <p>
                Los documentos necesarios para completar el proceso de
                admisión son los siguientes:
              </p>
              <p>
                Debe presentar todos los documentos en{" "}
                <span className="phone-number">original y copia</span> para el
                proceso de verificación.
              </p>
              <ul>
                <li>
                  <strong>Registro civil:</strong> Del estudiante actualizado
                </li>
                <li>
                  <strong>Fotocopia cédula:</strong> De ambos padres o
                  acudientes
                </li>
                <li>
                  <strong>Certificados académicos:</strong> De los últimos 2
                  años cursados
                </li>
                <li>
                  <strong>Paz y salvo:</strong> De la institución anterior
                </li>
                <li>
                  <strong>Carnet de vacunas:</strong> Actualizado según la
                  edad
                </li>
              </ul>
            </div>
          </div>

          <div className="container-admissions">
            <div 
              className="header-admissions" 
              onClick={() => toggleContent(3)}
            >
              <h2>3. PROCESO DE EVALUACION</h2>
              <div className="toggle-icon">
                {expanded === 3 ? '−' : '+'}
              </div>
            </div>
            <div className={`content-admissions ${expanded === 3 ? 'expanded' : ''}`}>
              <p>
                El proceso de evaluación se realizará de acuerdo al grado
                solicitado y consta de las siguientes etapas:
              </p>
              <p>
                Las evaluaciones se programarán según disponibilidad y serán
                comunicadas con{" "}
                <span className="phone-number">48 horas de anticipación</span>.
              </p>
              <ul>
                <li>
                  <strong>Entrevista familiar:</strong> Reunión con padres y
                  estudiante
                </li>
                <li>
                  <strong>Evaluación académica:</strong> Pruebas según el
                  grado
                </li>
                <li>
                  <strong>Evaluación psicológica:</strong> Para estudiantes de
                  primaria y bachillerato
                </li>
                <li>
                  <strong>Revisión de documentos:</strong> Verificación de
                  requisitos
                </li>
              </ul>
            </div>
          </div>

          <div className="container-admissions">
            <div 
              className="header-admissions" 
              onClick={() => toggleContent(4)}
            >
              <h2>4. COSTOS Y PAGOS</h2>
              <div className="toggle-icon">
                {expanded === 4 ? '−' : '+'}
              </div>
            </div>
            <div className={`content-admissions ${expanded === 4 ? 'expanded' : ''}`}>
              <p>
                Los costos para el año lectivo 2026 incluye los siguientes
                conceptos:
              </p>
              <ul>
                <li>
                  <strong>Matrícula:</strong> Pago único al momento de la
                  admisión
                </li>
                <li>
                  <strong>Pensión mensual:</strong> 10 pagos durante el año
                  lectivo
                </li>
                <li>
                  <strong>Otros cobros:</strong> Uniformes, útiles y
                  actividades especiales
                </li>
                <li>
                  <strong>Seguro estudiantil:</strong> Cobertura anual
                  obligatoria
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoMatricula;