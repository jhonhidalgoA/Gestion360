import SelectField from "../../../components/ui/SelectField";

const FormStep = ({
  currentStep,
  register,
  errors,
  grupos,
  asignaturas,
  periodos,
  tipoOptions,
  estandarOptions,
  dbaOptions,
  evidenciaOptions,
  proyectoOptions,
}) => {
  const AccordionSection = ({ children, title, icon }) => (
    <div className="accordion-section open">
      <div className="accordion-header">
        <span
          className="material-symbols-outlined"
          style={{ fontSize: "40px", marginRight: "8px" }}
        >
          {icon}
        </span>
        <span className="accordion-title">{title}</span>
      </div>
      <div className="accordion-content">{children}</div>
    </div>
  );

  switch (currentStep) {
    case 1:
      return (
        <AccordionSection
          title="Información Básica"
          icon={
            <span className="material-symbols-outlined icon-planning">
              calendar_month
            </span>
          }
        >
          <div className="form-row information-basic">
            <div className="form-group">
              <label htmlFor="fecha_inicio">Fecha de Inicio:</label>
              <input
                type="date"
                id="fecha_inicio"
                className={`input-line ${
                  errors.fecha_inicio ? "input-error" : ""
                }`}
                {...register("fecha_inicio", {
                  required: "Este campo es obligatorio",
                })}
              />
              {errors.fecha_inicio && (
                <span className="error-message">
                  {errors.fecha_inicio.message}
                </span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="fecha_fin">Fecha de Fin:</label>
              <input
                type="date"
                id="fecha_fin"
                className={`input-line ${
                  errors.fecha_fin ? "input-error" : ""
                }`}
                {...register("fecha_fin", {
                  required: "Este campo es obligatorio",
                })}
              />
              {errors.fecha_fin && (
                <span className="error-message">
                  {errors.fecha_fin.message}
                </span>
              )}
            </div>
            <SelectField
              label="Periodo:"
              id="periodo"
              register={register}
              errors={errors}
              required
              options={periodos}
            />
          </div>
          <div className="form-row form-row-group">
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
              label="Tipo:"
              id="tipo"
              register={register}
              errors={errors}
              required
              options={tipoOptions}
            />
          </div>
          <div className="form-group form-group-name ">
            <label htmlFor="tema">Nombre de la Unidad / Tema:</label>
            <input
              type="text"
              id="tema"
              className={`input-line input-planning ${
                errors.tema ? "input-error" : ""
              }`}
              {...register("tema", {
                required: "Este campo es obligatorio",
              })}
              placeholder="Ej: Circunferencia, Ecuaciones lineales..."
            />
            {errors.tema && (
              <span className="error-message">{errors.tema.message}</span>
            )}
          </div>
        </AccordionSection>
      );

    case 2:
      return (
        <AccordionSection
          title="Estándares y DBA"
          icon={
            <span className="material-symbols-outlined icon-planning">
              ads_click
            </span>
          }
        >
          <div className="form-row information-basic ">
            <SelectField
              label="Estándar:"
              id="estandar"
              register={register}
              errors={errors}
              required
              options={estandarOptions}
            />
            <SelectField
              label="DBA:"
              id="dba"
              register={register}
              errors={errors}
              required
              options={dbaOptions}
            />
            <SelectField
              label="Evidencia de Aprendizaje:"
              id="evidencia"
              register={register}
              errors={errors}
              required
              options={evidenciaOptions}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="competencias">Competencias:</label>
              <textarea
                id="competencias"
                className={`input-line ${
                  errors.competencias ? "input-error" : ""
                }`}
                placeholder="Escribe aquí las competencias a desarrollar..."
                rows="4"
                {...register("competencias", {
                  required: "Este campo es obligatorio",
                })}
              ></textarea>
              {errors.competencias && (
                <span className="error-message">
                  {errors.competencias.message}
                </span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="objetivos">Objetivos:</label>
              <textarea
                id="objetivos"
                className={`input-line ${
                  errors.objetivos ? "input-error" : ""
                }`}
                placeholder="Escribe aquí los objetivos a desarrollar..."
                rows="4"
                {...register("objetivos", {
                  required: "Este campo es obligatorio",
                })}
              ></textarea>
              {errors.objetivos && (
                <span className="error-message">
                  {errors.objetivos.message}
                </span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="proyecto">Proyecto Transversal:</label>
              <SelectField
                label=""
                id="proyecto"
                register={register}
                errors={errors}
                required
                options={proyectoOptions}
              />
            </div>
          </div>
        </AccordionSection>
      );

    case 3:
      return (
        <AccordionSection
          title="Actividades y Desarrollo de la Clase"
          icon={
            <span className="material-symbols-outlined icon-planning">
              psychology
            </span>
          }
        >
          <div className="form-group">
            <label htmlFor="saberes_previos">Saberes Previos (Inicio):</label>
            <textarea
              id="saberes_previos"
              className={`input-line ${
                errors.saberes_previos ? "input-error" : ""
              }`}
              placeholder="Describe actividades o preguntas para activar conocimientos previos..."
              rows="4"
              {...register("saberes_previos", {
                required: "Este campo es obligatorio",
              })}
            ></textarea>
            {errors.saberes_previos && (
              <span className="error-message">
                {errors.saberes_previos.message}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="contenidos">Analiza:</label>
            <textarea
              id="contenidos"
              className={`input-line ${errors.analiza ? "input-error" : ""}`}
              placeholder="Describe los temas, explicaciones, ejemplos o actividades del desarrollo..."
              rows="4"
              {...register("analiza", {
                required: "Este campo es obligatorio",
              })}
            ></textarea>
            {errors.analiza && (
              <span className="error-message">{errors.analiza.message}</span>
            )}
          </div>
        </AccordionSection>
      );
    case 4:
      return (
        <AccordionSection
          title="Contenidos y Evaluación"
          icon={
            <span className="material-symbols-outlined icon-planning">
              content_copy
            </span>
          }
        >
          <div className="form-group">
            <label htmlFor="contenidos">Contenidos:</label>
            <textarea
              id="contenidos"
              className={`input-line ${errors.contenidos ? "input-error" : ""}`}
              placeholder="Describe los temas, explicaciones, ejemplos o actividades del desarrollo..."
              rows="4"
              {...register("contenidos", {
                required: "Este campo es obligatorio",
              })}
            ></textarea>
            {errors.contenidos && (
              <span className="error-message">{errors.contenidos.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="evaluacion">Evaluación:</label>
            <textarea
              id="evaluacion"
              className={`input-line ${errors.evaluacion ? "input-error" : ""}`}
              placeholder="Describe cómo se evaluará el aprendizaje (instrumentos, criterios, actividades)..."
              rows="4"
              {...register("evaluacion", {
                required: "Este campo es obligatorio",
              })}
            ></textarea>
            {errors.evaluacion && (
              <span className="error-message">{errors.evaluacion.message}</span>
            )}
          </div>
        </AccordionSection>
      );

    case 5:
      return (
        <AccordionSection
          title="Recursos y Observaciones"
          icon={
            <span className="material-symbols-outlined icon-planning">
              add_link
            </span>
          }
        >
          <div className="form-group">
            <label htmlFor="observaciones">Observaciones:</label>
            <textarea
              id="observaciones"
              className={`input-line ${
                errors.observaciones ? "input-error" : ""
              }`}
              placeholder="Notas adicionales, adaptaciones, incidencias, etc."
              rows="4"
              {...register("observaciones", {
                required: "Este campo es obligatorio",
              })}
            ></textarea>
            {errors.observaciones && (
              <span className="error-message">
                {errors.observaciones.message}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="bibliografia">Bibliografía / Recursos:</label>
            <textarea
              id="bibliografia"
              className={`input-line ${
                errors.bibliografia ? "input-error" : ""
              }`}
              placeholder="Libros, páginas web, videos, materiales utilizados..."
              rows="4"
              {...register("bibliografia", {
                required: "Este campo es obligatorio",
              })}
            ></textarea>
            {errors.bibliografia && (
              <span className="error-message">
                {errors.bibliografia.message}
              </span>
            )}
          </div>
        </AccordionSection>
      );

    default:
      return null;
  }
};

export default FormStep;
