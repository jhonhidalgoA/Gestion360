import NavbarDocente from "../../../components/layout/Navbar/NavbarDocente";
import SelectField from "../../../components/ui/SelectField";
import ActionButtons from "../../../components/ui/Botones";
import Modal from "../../../components/ui/Modal";
import { useForm } from "react-hook-form";
import { useState, useRef, useEffect } from "react";

const Calificaciones = () => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: { grupo: "", asignatura: "", periodo: "" },
    mode: "onChange",
  });

  const [grupos, setGrupos] = useState([{ value: "", label: "Cargando..." }]);
  const [asignaturas, setAsignaturas] = useState([
    { value: "", label: "Cargando..." },
  ]);

  const [periodos, setPeriodos] = useState([
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

  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });
  const [numeroNotas, setNumeroNotas] = useState(10);
  const [estudiantes, setEstudiantes] = useState([]);

  const cargarEstudiantes = async () => {
    const values = getValues();
    if (!values.grupo || !values.asignatura || !values.periodo) {
      setMensajeModal({
        isOpen: true,
        title: (
          <>
            Colegio STEM <span className="modal-title-360">360</span>
          </>
        ),
        message: "Debes seleccionar Grupo, Asignatura y Período.",
        tipo: "error",
      });
      return;
    }

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

      // Actualizar el estado de número de notas según lo que venga del backend
      if (data.length > 0) {
        const maxNotas = Math.max(...data.map((est) => est.notas.length));
        setNumeroNotas(maxNotas);
      }

      setEstudiantes(data);
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

  const [modalAbierto, setModalAbierto] = useState(false);
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);
  const [retroalimentacionTemp, setRetroalimentacionTemp] = useState("");
  const [celdaActiva, setCeldaActiva] = useState(null);

  const inputsRef = useRef({});

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

        setGrupos([{ value: "", label: "Seleccionar" }, ...opcionesGrados]);
        setAsignaturas([
          { value: "", label: "Seleccionar" },
          ...opcionesAsignaturas,
        ]);
        setPeriodos([{ value: "", label: "Seleccionar" }, ...opcionesPeriodos]);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setGrupos([{ value: "", label: "Error al cargar grados" }]);
        setAsignaturas([{ value: "", label: "Error al cargar asignaturas" }]);
        setPeriodos([{ value: "", label: "Error al cargar períodos" }]);
      }
    };

    cargarDatos();
  }, []);

  const agregarNota = () => {
    setNumeroNotas((prev) => prev + 1);
    setEstudiantes((prev) =>
      prev.map((est) => ({
        ...est,
        notas: [...est.notas, ""],
      }))
    );
  };

  const handleNotaChange = (estId, index, value) => {
    if (value === "" || /^([1-5](\.[0-9]{0,1})?)$/.test(value)) {
      const numValue = parseFloat(value);
      if (value === "" || (numValue >= 1.0 && numValue <= 5.0)) {
        setEstudiantes((prev) =>
          prev.map((est) =>
            est.id === estId
              ? {
                  ...est,
                  notas: est.notas.map((n, i) => (i === index ? value : n)),
                }
              : est
          )
        );
      }
    }
  };

  const calcularPromedio = (notas) => {
    const nums = notas.filter((n) => n !== "").map(Number);
    if (nums.length === 0) return "0.00";
    const promedio = nums.reduce((a, b) => a + b, 0) / nums.length;
    return Math.min(promedio, 5.0).toFixed(2);
  };

  const getColor = (valor) => {
    if (valor === "" || isNaN(valor)) return "transparent";
    const n = Number(valor);
    if (n < 3) return "#ffb3b3";
    if (n < 4) return "#fff0b3";
    return "#c6ffb3";
  };

  const getColorPromedio = (prom) => {
    const p = Number(prom);
    if (p < 3) return "red";
    if (p < 4) return "orange";
    return "green";
  };

  const handleKeyDown = (e, estIndex, notaIndex) => {
    const key = e.key;
    if (key === "Enter") {
      e.preventDefault();
      if (notaIndex < numeroNotas - 1) {
        const next = `${estIndex}-${notaIndex + 1}`;
        inputsRef.current[next]?.focus();
      } else if (estIndex < estudiantes.length - 1) {
        const next = `${estIndex + 1}-0`;
        inputsRef.current[next]?.focus();
      }
    }
    if (key === "ArrowRight")
      inputsRef.current[`${estIndex}-${notaIndex + 1}`]?.focus();
    if (key === "ArrowLeft")
      inputsRef.current[`${estIndex}-${notaIndex - 1}`]?.focus();
    if (key === "ArrowDown")
      inputsRef.current[`${estIndex + 1}-${notaIndex}`]?.focus();
    if (key === "ArrowUp")
      inputsRef.current[`${estIndex - 1}-${notaIndex}`]?.focus();
  };

  const abrirModal = (estudiante) => {
    setEstudianteSeleccionado(estudiante);
    setRetroalimentacionTemp(estudiante.retroalimentacion);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setEstudianteSeleccionado(null);
    setRetroalimentacionTemp("");
  };

  const guardarRetroalimentacion = () => {
    setEstudiantes((prev) =>
      prev.map((est) =>
        est.id === estudianteSeleccionado?.id
          ? { ...est, retroalimentacion: retroalimentacionTemp }
          : est
      )
    );
    cerrarModal();
  };

  const manejarAccion = async (data, action) => {
    setMensaje({ tipo: "", texto: "" });
    setLoading((prev) => ({ ...prev, [action]: true }));

    try {
      const values = getValues();
      if (!values.grupo || !values.asignatura || !values.periodo) {
        throw new Error("Debes seleccionar Grupo, Asignatura y Período.");
      }

      if (action === "guardar") {
        const payload = {
          grupo: values.grupo,
          asignatura: values.asignatura,
          periodo: values.periodo,
          estudiantes: estudiantes.map((est) => ({
            id: est.id,
            notas: est.notas,
          })),
        };

        const res = await fetch(
          "http://localhost:8000/api/guardar-calificaciones",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        if (!res.ok) throw new Error("Error al guardar las calificaciones");

        setMensajeModal({
          isOpen: true,
          title: (
            <>
              Colegio{" "}
              <span style={{ color: "#2e83c5", fontWeight: "bold" }}>
                STEM 360
              </span>
            </>
          ),
          message: (
            <div style={{ textAlign: "center" }}>
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: "80px",
                  color: "#48bb78",                  
                  display: "block",
                }}
              >
                check_circle
              </span>
              <div style={{ fontSize: "20px", fontWeight: "bold" }}>
                Calificaciones guardadas correctamente.
              </div>
            </div>
          ),
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
    <div className="qualification">
      <NavbarDocente
        title="Calificaciones"
        color="#2e83c5"
        icon={<span className="material-symbols-outlined">edit_note</span>}
      />
      <div className="main-content">
        <form className="form-wrapper" onSubmit={(e) => e.preventDefault()}>
          <div
            className="form-row"
            style={{ justifyContent: "center", gap: "30px" }}
          >
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
          </div>

          <div
            style={{
              display: "flex",
              gap: "15px",
              alignItems: "center",
              marginBottom: "20px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <ActionButtons
              onLoad={handleCargarEstudiantes}
              loadLoading={loading.cargar}
              loadLabel="Estudiantes"
              onSave={handleGuardar}
              saveLoading={loading.guardar}
              saveLabel="Guardar"
              onAddColumn={agregarNota}
              columnLabel="Nueva Columna"
              columnLoading={false}
              columnDisabled={false}
            />
          </div>

          {mensaje.texto && (
            <div className={`mensaje-feedback mensaje-${mensaje.tipo}`}>
              {mensaje.texto}
            </div>
          )}
        </form>

        <div
          style={{
            fontFamily: "Arial, sans-serif",
            marginTop: "30px",
            marginLeft: "0px",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                borderCollapse: "collapse",
                width: "100%",
                minWidth: `${700 + numeroNotas * 60}px`,
                fontSize: "14px",
                marginLeft: "0px",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      width: "220px",
                      background: "#4a5568",
                      color: "white",
                      textAlign: "left",
                      padding: "12px",
                      borderRadius: "8px 0 0 0",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    Estudiante
                  </th>
                  {Array.from({ length: numeroNotas }, (_, i) => (
                    <th
                      key={i}
                      style={{
                        width: "60px",
                        background: "#4a5568",
                        color: "white",
                        textAlign: "center",
                        padding: "12px",
                        fontSize: "14px",
                        fontWeight: "600",
                      }}
                    >
                      N{i + 1}
                    </th>
                  ))}
                  <th
                    style={{
                      width: "90px",
                      background: "#4a5568",
                      color: "white",
                      padding: "12px",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    Promedio
                  </th>
                  <th
                    style={{
                      width: "110px",
                      background: "#4a5568",
                      color: "white",
                      padding: "12px",
                      borderRadius: "0 8px 0 0",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody>
                {estudiantes.map((est, estIndex) => {
                  const promedio = calcularPromedio(est.notas);
                  return (
                    <tr
                      key={est.id}
                      style={{
                        background: estIndex % 2 === 0 ? "#f7fafc" : "white",
                        borderBottom: "1px solid #e2e8f0",
                      }}
                    >
                      <td
                        style={{
                          padding: "10px",
                          fontWeight: "bold",
                          color: "#2d3748",
                          fontSize: "13px",
                        }}
                      >
                        {est.apellidos} {est.nombres}
                      </td>
                      {est.notas.map((nota, notaIndex) => {
                        const cellKey = `${estIndex}-${notaIndex}`;
                        const isActive = celdaActiva === cellKey;
                        return (
                          <td
                            key={notaIndex}
                            style={{
                              textAlign: "center",
                              position: "relative",
                              padding: "4px",
                            }}
                          >
                            <div
                              style={{
                                position: "relative",
                                display: "inline-block",
                              }}
                            >
                              <input
                                type="text"
                                value={nota}
                                ref={(el) => (inputsRef.current[cellKey] = el)}
                                onFocus={() => setCeldaActiva(cellKey)}
                                onBlur={() => setCeldaActiva(null)}
                                onKeyDown={(e) =>
                                  handleKeyDown(e, estIndex, notaIndex)
                                }
                                onChange={(e) =>
                                  handleNotaChange(
                                    est.id,
                                    notaIndex,
                                    e.target.value
                                  )
                                }
                                title="Rango válido: 1.0 - 5.0"
                                style={{
                                  width: "50px",
                                  textAlign: "center",
                                  padding: "6px",
                                  backgroundColor: getColor(nota),
                                  border: isActive
                                    ? "2px solid #3182ce"
                                    : "1px solid #cbd5e0",
                                  borderRadius: "4px",
                                  outline: "none",
                                  fontSize: "13px",
                                  transition: "all 0.2s ease",
                                  boxShadow: isActive
                                    ? "0 0 0 3px rgba(49, 130, 206, 0.1)"
                                    : "none",
                                }}
                              />
                              {isActive && (
                                <div
                                  style={{
                                    position: "absolute",
                                    bottom: "-30px",
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    background: "#2d3748",
                                    color: "white",
                                    padding: "4px 8px",
                                    borderRadius: "4px",
                                    fontSize: "11px",
                                    whiteSpace: "nowrap",
                                    zIndex: 1000,
                                    pointerEvents: "none",
                                  }}
                                >
                                  1.0 - 5.0
                                  <div
                                    style={{
                                      position: "absolute",
                                      top: "-4px",
                                      left: "50%",
                                      transform: "translateX(-50%)",
                                      width: 0,
                                      height: 0,
                                      borderLeft: "4px solid transparent",
                                      borderRight: "4px solid transparent",
                                      borderBottom: "4px solid #2d3748",
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          </td>
                        );
                      })}
                      <td
                        style={{
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: "14px",
                          color: getColorPromedio(promedio),
                          padding: "10px",
                        }}
                      >
                        {promedio}
                      </td>
                      <td style={{ textAlign: "center", padding: "8px" }}>
                        <button
                          onClick={() => abrirModal(est)}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: "none",
                            background: est.retroalimentacion
                              ? "#48bb78"
                              : "#3182ce",
                            color: "white",
                            cursor: "pointer",
                            fontSize: "12px",
                            fontWeight: "500",
                            transition: "all 0.2s ease",
                            width: "90px",
                          }}
                          onMouseOver={(e) => {
                            e.target.style.transform = "translateY(-1px)";
                            e.target.style.boxShadow =
                              "0 4px 6px rgba(0,0,0,0.1)";
                          }}
                          onMouseOut={(e) => {
                            e.target.style.transform = "translateY(0)";
                            e.target.style.boxShadow = "none";
                          }}
                        >
                          {est.retroalimentacion ? "✓ Ver/Editar" : "Agregar"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {modalAbierto && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
              }}
              onClick={cerrarModal}
            >
              <div
                style={{
                  background: "white",
                  borderRadius: "10px",
                  padding: "24px",
                  width: "90%",
                  maxWidth: "500px",
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3
                  style={{
                    marginTop: 0,
                    color: "#2d3748",
                    marginBottom: "8px",
                  }}
                >
                  📝 Retroalimentación
                </h3>
                <p
                  style={{
                    margin: "0 0 16px 0",
                    color: "#718096",
                    fontSize: "14px",
                  }}
                >
                  Estudiante:{" "}
                  <strong>
                    {estudianteSeleccionado?.apellidos}{" "}
                    {estudianteSeleccionado?.nombres}
                  </strong>
                </p>
                <textarea
                  value={retroalimentacionTemp}
                  onChange={(e) => setRetroalimentacionTemp(e.target.value)}
                  placeholder="Escribe aquí comentarios..."
                  style={{
                    width: "100%",
                    height: "150px",
                    padding: "12px",
                    border: "1px solid #cbd5e0",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontFamily: "Arial, sans-serif",
                    resize: "vertical",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#3182ce";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(49, 130, 206, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#cbd5e0";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    marginTop: "20px",
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    onClick={cerrarModal}
                    style={{
                      padding: "10px 20px",
                      borderRadius: "6px",
                      border: "1px solid #cbd5e0",
                      background: "white",
                      color: "#4a5568",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={guardarRetroalimentacion}
                    style={{
                      padding: "10px 20px",
                      borderRadius: "6px",
                      border: "none",
                      background: "#092b4aff",
                      color: "white",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          )}

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
            tipo={mensajeModal.tipo}
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

export default Calificaciones;
