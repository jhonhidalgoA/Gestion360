import NavbarDocente from "../../../components/layout/Navbar/NavbarDocente";
import SelectField from "../../../components/ui/SelectField";
import ActionButtons from "../../../components/ui/Botones";
import Modal from "../../../components/ui/Modal";

import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";

import "./Asistencia.css";

const Asistencia = () => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: { grupo: "", asignatura: "", periodo: "", duracion: "" },
    mode: "onChange",
  });

  const [grupos, setGrupos] = useState([{ value: "", label: "Cargando..." }]);
  const [duracionSeleccionada, setDuracionSeleccionada] = useState(1);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });
  const [estudiantes, setEstudiantes] = useState([]);


  const [asignaturas, setAsignaturas] = useState([
    { value: "", label: "Cargando..." },
  ]);

  const [periodos, setPeriodos] = useState([
    { value: "", label: "Cargando..." },
  ]);

  const [duracionClase, setDuracionClase] = useState([
    { value: "", label: "Cargando..." },
  ]);

  const [loading, setLoading] = useState({
    cargar: false,
    guardar: false,
    ver: false,
    pdf: false,
  });

  const [mensajeModal, setMensajeModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    tipo: "",
  });

 
  const cargarEstudiantes = async () => {
    const values = getValues();
    if (
      !values.grupo ||
      !values.asignatura ||
      !values.periodo ||
      !values.duracion
    ) {
      setMensajeModal({
        isOpen: true,
        title: (
          <>
            Colegio STEM <span className="modal-title-360">360</span>
          </>
        ),
        message: "Debes seleccionar Grupo, Asignatura, Período y Duración.",
        tipo: "error",
      });
      return;
    }

    setDuracionSeleccionada(parseInt(values.duracion) || 1);

    setLoading((prev) => ({ ...prev, cargar: true }));
    setMensaje({ tipo: "", texto: "" });

    try {
      const url = new URL(
        `http://localhost:8000/api/estudiantes-por-grado/${values.grupo}`
      );
      url.searchParams.append("asignatura", values.asignatura);
      url.searchParams.append("periodo", values.periodo);

      const res = await fetch(url.toString());
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || "Error al cargar estudiantes");
      }
      const data = await res.json();

      // Estado real: "P", pero marcamos como no confirmado visualmente
      const estudiantesConAsistencia = data.map((est) => ({
        ...est,
        asistencia: Array(7).fill("P"),
        confirmado: Array(7).fill(false), // ← bandera para UI
      }));

      setEstudiantes(estudiantesConAsistencia);
    } catch (err) {
      console.error("Error:", err);
      setMensajeModal({
        isOpen: true,
        title: "Colegio STEM 360",
        message:
          "No se pudieron cargar los estudiantes. " + (err.message || ""),
        tipo: "error",
      });
    } finally {
      setLoading((prev) => ({ ...prev, cargar: false }));
    }
  };

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const resGrados = await fetch("http://localhost:8000/api/grados");
        if (!resGrados.ok) throw new Error("Error al cargar los grados");
        const dataGrados = await resGrados.json();
        const opcionesGrados = dataGrados.map((grado) => ({
          value: String(grado.id),
          label: grado.nombre,
        }));

        const resAsignaturas = await fetch(
          "http://localhost:8000/api/asignaturas"
        );
        if (!resAsignaturas.ok)
          throw new Error("Error al cargar las asignaturas");
        const dataAsignaturas = await resAsignaturas.json();
        const opcionesAsignaturas = dataAsignaturas.map((asig) => ({
          value: asig.nombre.toLowerCase().replace(/\s+/g, "_"),
          label: asig.nombre,
        }));

        const resPeriodos = await fetch("http://localhost:8000/api/periodos");
        if (!resPeriodos.ok) throw new Error("Error al cargar los períodos");
        const dataPeriodos = await resPeriodos.json();
        const opcionesPeriodos = dataPeriodos.map((periodo) => ({
          value: String(periodo.id),
          label: periodo.nombre,
        }));

        const resDuracion = await fetch(
          "http://localhost:8000/api/duracion-clase"
        );
        if (!resDuracion.ok)
          throw new Error("Error al cargar duración de clase");
        const dataDuracion = await resDuracion.json();
        const opcionesDuracion = dataDuracion.map((d) => ({
          value: String(d.valor),
          label: d.etiqueta,
        }));

        setGrupos([{ value: "", label: "Seleccionar" }, ...opcionesGrados]);
        setAsignaturas([
          { value: "", label: "Seleccionar" },
          ...opcionesAsignaturas,
        ]);
        setPeriodos([{ value: "", label: "Seleccionar" }, ...opcionesPeriodos]);
        setDuracionClase([
          { value: "", label: "Seleccionar" },
          ...opcionesDuracion,
        ]);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setGrupos([{ value: "", label: "Error al cargar grados" }]);
        setAsignaturas([{ value: "", label: "Error al cargar asignaturas" }]);
        setPeriodos([{ value: "", label: "Error al cargar períodos" }]);
        setDuracionClase([{ value: "", label: "Error al cargar duración" }]);
      }
    };

    cargarDatos();
  }, []);

  const cambiarEstadoCelda = (estId, index) => {
    setEstudiantes((prev) =>
      prev.map((est) => {
        if (est.id !== estId) return est;

        const nuevaAsistencia = [...est.asistencia];
        const nuevoConfirmado = [...(est.confirmado || Array(7).fill(false))];

        let estadoActual = nuevaAsistencia[index];
        let nuevoEstado;

        // Si es la primera vez (no confirmado), empieza con "P"
        if (!nuevoConfirmado[index]) {
          nuevoEstado = "P";
        } else {
          // Ciclo: P → R → A → P (para 1h)
          if (duracionSeleccionada === 1) {
            if (estadoActual === "P") nuevoEstado = "R";
            else if (estadoActual === "R") nuevoEstado = "A";
            else if (estadoActual === "A") nuevoEstado = "P";
          }
          // Ciclo: P → PARCIAL → A → R → P (para 2h y 3h)
          else if (duracionSeleccionada === 2) {
            if (estadoActual === "P") nuevoEstado = "PARCIAL";
            else if (estadoActual === "PARCIAL") nuevoEstado = "A";
            else if (estadoActual === "A") nuevoEstado = "R";
            else if (estadoActual === "R") nuevoEstado = "P";
          } else if (duracionSeleccionada === 3) {
            if (estadoActual === "P") nuevoEstado = "PARCIAL1";
            else if (estadoActual === "PARCIAL1") nuevoEstado = "PARCIAL2";
            else if (estadoActual === "PARCIAL2") nuevoEstado = "A";
            else if (estadoActual === "A") nuevoEstado = "R";
            else if (estadoActual === "R") nuevoEstado = "P";
          }
        }

        nuevaAsistencia[index] = nuevoEstado || "P";
        nuevoConfirmado[index] = true;

        return {
          ...est,
          asistencia: nuevaAsistencia,
          confirmado: nuevoConfirmado,
        };
      })
    );
  };

  const calcularResumen = (asistencia, confirmado) => {
  let presentes = 0;
  let ausentes = 0;
  let retardos = 0; // en horas
  let diasConfirmados = 0;

  asistencia.forEach((estado, i) => {
    if (!confirmado[i]) return;
    diasConfirmados++;

    if (estado === "P") {
      presentes += 1;
    } else if (estado === "A") {
      ausentes += 1;
    } else if (estado === "R") {
      retardos += 0.25; // ← 15 minutos = 0.25 horas
    } else if (estado === "PARCIAL") {
      presentes += 0.5;
      ausentes += 0.5;
    } else if (estado === "PARCIAL1") {
      presentes += 2;
      ausentes += 1;
    } else if (estado === "PARCIAL2") {
      presentes += 1;
      ausentes += 2;
    }
  });

  const horasPresentes = presentes * duracionSeleccionada;
  const horasAusentes = ausentes * duracionSeleccionada;
  const horasRetardos = retardos; // ya está en horas

  // Porcentajes: basados en días confirmados (no en horas)
  const totalDias = diasConfirmados;
  let porcentajePresentes = 0;
  let porcentajeAusentes = 0;
  let porcentajeRetardos = 0;

  if (totalDias > 0) {
    // Contamos 1 día por cada clic (independiente del valor horario)
    let diasP = 0, diasA = 0, diasR = 0;
    asistencia.forEach((estado, i) => {
      if (!confirmado[i]) return;
      if (estado === "P") diasP++;
      else if (estado === "A") diasA++;
      else if (estado === "R") diasR++;
      else if (estado === "PARCIAL") { diasP += 0.5; diasA += 0.5; }
      else if (estado === "PARCIAL1") { diasP += 1; diasA += 0.5; } // aprox
      else if (estado === "PARCIAL2") { diasP += 0.5; diasA += 1; }
    });
    porcentajePresentes = ((diasP / totalDias) * 100).toFixed(0);
    porcentajeAusentes = ((diasA / totalDias) * 100).toFixed(0);
    porcentajeRetardos = ((diasR / totalDias) * 100).toFixed(0);
  }

  return {
    horasPresentes: `${horasPresentes.toFixed(1)}h (${porcentajePresentes}%)`,
    horasAusentes: `${horasAusentes.toFixed(1)}h (${porcentajeAusentes}%)`,
    horasRetardos: `${horasRetardos.toFixed(1)}h (${porcentajeRetardos}%)`,
  };
};

  const manejarAccion = async (data, action) => {
    setMensaje({ tipo: "", texto: "" });
    setLoading((prev) => ({ ...prev, [action]: true }));

    try {
      const values = getValues();
      if (
        !values.grupo ||
        !values.asignatura ||
        !values.periodo ||
        !values.duracion
      ) {
        throw new Error(
          "Debes seleccionar Grupo, Asignatura, Período y Duración."
        );
      }

      if (action === "guardar") {
        const payload = {
          grupo: values.grupo,
          asignatura: values.asignatura,
          periodo: values.periodo,
          duracion: values.duracion,
          estudiantes: estudiantes.map((est) => ({
            id: est.id,
            asistencia: est.asistencia,
          })),
        };

        const res = await fetch(
          "http://localhost:8000/api/guardar-asistencia",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        if (!res.ok) throw new Error("Error al guardar la asistencia");

        setMensajeModal({
          isOpen: true,
          title: "Colegio STEM 360",
          message: "Asistencia guardada correctamente.",
          tipo: "exito",
        });
      } else {
        await new Promise((resolve) => setTimeout(resolve, 800));
        setMensaje({
          tipo: "exito",
          texto: `Acción "${action}" procesada correctamente.`,
        });
      }

      setTimeout(() => {
        setMensaje({ tipo: "", texto: "" });
      }, 3000);
    } catch (error) {
      console.error("Error:", error);
      setMensajeModal({
        isOpen: true,
        title: "Colegio STEM 360",
        message: error.message || "Error al procesar la solicitud.",
        tipo: "error",
      });
      setTimeout(() => {
        setMensaje({ tipo: "", texto: "" });
      }, 5000);
    } finally {
      setLoading((prev) => ({ ...prev, [action]: false }));
    }
  };

  const handleCargarEstudiantes = (e) => {
    e.preventDefault();
    handleSubmit(() => {
      cargarEstudiantes();
    })();
  };

  const handleGuardar = handleSubmit((data) => manejarAccion(data, "guardar"));

  return (
    <div className="asistencia-container">
      <NavbarDocente
        title="Asistencia"
        color="#2e83c5"
        icon={<span className="material-symbols-outlined">edit_note</span>}
      />
      <div className="main-content">
        <form className="form-wrapper" onSubmit={(e) => e.preventDefault()}>
          <div className="form-row">
            <SelectField
              label="Grupo:"
              id="grupo"
              register={register}
              errors={errors}
              required
              options={grupos}
            />
            <SelectField
              label="Asignatura:"
              id="asignatura"
              register={register}
              errors={errors}
              required
              options={asignaturas}
            />
            <SelectField
              label="Periodo:"
              id="periodo"
              register={register}
              errors={errors}
              required
              options={periodos}
            />
            <SelectField
              label="Duracion Clase:"
              id="duracion"
              register={register}
              errors={errors}
              required
              options={duracionClase}
              onChange={(e) =>
                setDuracionSeleccionada(parseInt(e.target.value) || 1)
              }
            />
          </div>

          <div className="buttons-container">
            <ActionButtons
              onLoad={handleCargarEstudiantes}
              loadLoading={loading.cargar}
              loadLabel="Estudiantes"
              onSave={handleGuardar}
              saveLoading={loading.guardar}
              saveLabel="Guardar"
              onAddColumn={null}
              columnLabel="Nueva Columna"
              columnLoading={false}
              columnDisabled={true}
              
            />
          </div>

          {mensaje.texto && (
            <div className={`mensaje-feedback mensaje-${mensaje.tipo}`}>
              {mensaje.texto}
            </div>
          )}

          {/* Leyenda de estados */}
          <div className="leyenda-container">
            <div className="leyenda-items">
              <div className="leyenda-item">
                <span className="estado-icon presente">
                  <span className="material-symbols-outlined">check</span>
                </span>
                <span>Presente ({duracionSeleccionada}h)</span>
              </div>
              <div className="leyenda-item">
                <span className="estado-icon ausente">
                  <span className="material-symbols-outlined">close</span>
                </span>
                <span>Ausente (0h)</span>
              </div>
              <div className="leyenda-item">
                <span className="estado-icon retardo">
                  <span className="material-symbols-outlined">timer</span>
                </span>
                <span>Retardo (max 15 min)</span>
              </div>
              {duracionSeleccionada === 2 && (
                <div className="leyenda-item">
                  <span className="estado-icon parcial">
                    <span className="material-symbols-outlined">remove</span>
                  </span>
                  <span>Parcial (1h presente, 1h ausente)</span>
                </div>
              )}
              {duracionSeleccionada === 3 && (
                <>
                  <div className="leyenda-item">
                    <span className="estado-icon parcial1">
                      <span className="material-symbols-outlined">remove</span>
                    </span>
                    <span>Parcial 1 (2h presente, 1h ausente)</span>
                  </div>
                  <div className="leyenda-item">
                    <span className="estado-icon parcial2">
                      <span className="material-symbols-outlined">remove</span>
                    </span>
                    <span>Parcial 2 (1h presente, 2h ausente)</span>
                  </div>
                </>
              )}
            </div>

            <div className="leyenda-nota">
              * Clic en cada celda para cambiar el estado
            </div>
          </div>
        </form>

        <div className="tabla-container">
          <div className="tabla-scroll">
            <table className="tabla-asistencia">
              <thead>
                <tr>
                  <th className="columna-estudiante">Estudiante</th>
                  {Array.from({ length: 7 }, (_, i) => {
                    const hoy = new Date();
                    const lunes = new Date(hoy);
                    lunes.setDate(
                      hoy.getDate() -
                        (hoy.getDay() === 0 ? 6 : hoy.getDay() - 1)
                    );

                    const diaActual = new Date(lunes);
                    diaActual.setDate(lunes.getDate() + i);

                    const diaSemana = [
                      "Lun",
                      "Mar",
                      "Mié",
                      "Jue",
                      "Vie",
                      "Sáb",
                      "Dom",
                    ][i];
                    const fechaFormateada = `${diaSemana} ${diaActual.getDate()} ${diaActual.toLocaleString(
                      "es-ES",
                      { month: "short" }
                    )}.`;

                    return (
                      <th key={i} className="columna-dia">
                        {fechaFormateada}
                      </th>
                    );
                  })}
                  <th className="columna-resumen">Resumen</th>
                </tr>
              </thead>
              <tbody>
                {estudiantes.map((est, estIndex) => {
                  const resumen = calcularResumen(
                    est.asistencia,
                    est.confirmado || Array(7).fill(false)
                  );

                  return (
                    <tr
                      key={est.id}
                      className={estIndex % 2 === 0 ? "fila-par" : "fila-impar"}
                    >
                      <td className="celda-estudiante">
                        {est.apellidos} {est.nombres}
                      </td>
                      {est.asistencia.map((estado, diaIndex) => {
                        const confirmado = est.confirmado?.[diaIndex] || false;
                        let icono = "";
                        let claseEstado = "vacio";
                        let texto = "";

                        if (confirmado) {
                          if (duracionSeleccionada === 1) {
                            icono =
                              estado === "P"
                                ? "check"
                                : estado === "A"
                                ? "close"
                                : "timer";
                            texto =
                              estado === "P"
                                ? "1h"
                                : estado === "A"
                                ? "A"
                                : "R";
                            claseEstado =
                              estado === "P"
                                ? "presente"
                                : estado === "A"
                                ? "ausente"
                                : "retardo";
                          } else if (duracionSeleccionada === 2) {
                            if (estado === "P") {
                              icono = "check";
                              texto = "2h";
                              claseEstado = "presente";
                            } else if (estado === "PARCIAL") {
                              icono = "remove";
                              texto = "-";
                              claseEstado = "parcial";
                            } else if (estado === "A") {
                              icono = "close";
                              texto = "A";
                              claseEstado = "ausente";
                            } else if (estado === "R") {
                              icono = "timer";
                              texto = "R";
                              claseEstado = "retardo";
                            }
                          } else if (duracionSeleccionada === 3) {
                            if (estado === "P") {
                              icono = "check";
                              texto = "3h";
                              claseEstado = "presente";
                            } else if (
                              estado === "PARCIAL1" ||
                              estado === "PARCIAL2"
                            ) {
                              icono = "remove";
                              texto = "-";
                              claseEstado = "parcial";
                            } else if (estado === "A") {
                              icono = "close";
                              texto = "A";
                              claseEstado = "ausente";
                            } else if (estado === "R") {
                              icono = "timer";
                              texto = "R";
                              claseEstado = "retardo";
                            }
                          }
                        }

                        return (
                          <td key={diaIndex} className="celda-dia">
                            <button
                              onClick={() =>
                                cambiarEstadoCelda(est.id, diaIndex)
                              }
                              className={`boton-estado ${claseEstado} ${
                                [5, 6].includes(diaIndex) ? "deshabilitado" : ""
                              }`}
                              style={
                                [5, 6].includes(diaIndex)
                                  ? {
                                      pointerEvents: "none",
                                      opacity: 0.5,
                                      cursor: "not-allowed",
                                      backgroundColor: "#ffff",
                                    }
                                  : {}
                              }
                            >
                              <div className="icono-texto-container">
                                {icono && (
                                  <span className="material-symbols-outlined icono-estado">
                                    {icono}
                                  </span>
                                )}
                                <span className="estado-texto">{texto}</span>
                              </div>
                            </button>
                          </td>
                        );
                      })}
                      <td className="celda-resumen">
                        <div className="resumen-container">
                          <span className="resumen-item">
                            <span className="material-symbols-outlined icono-presente">
                              check
                            </span>
                            {resumen.horasPresentes}
                          </span>
                          <span className="resumen-item">
                            <span className="material-symbols-outlined icono-ausente">
                              close
                            </span>
                            {resumen.horasAusentes}
                          </span>
                          <span className="resumen-item">
                            <span className="material-symbols-outlined icono-retardo">
                              timer
                            </span>
                            {resumen.horasRetardos}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <Modal
            isOpen={mensajeModal.isOpen}
            onClose={() =>
              setMensajeModal({
                isOpen: false,
                title: "",
                message: "",
                tipo: "",
              })
            }
            title={mensajeModal.title}
            message={mensajeModal.message}
            buttons={[
              {
                text: "Cerrar",
                variant: mensajeModal.tipo === "exito" ? "success" : "error",
                onClick: () =>
                  setMensajeModal({
                    isOpen: false,
                    title: "",
                    message: "",
                    tipo: "",
                  }),
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default Asistencia;
