// src/components/matricula/utils/formHelpers.js

const gradeMap = {
  "primero": 1,
  "segundo": 2,
  "tercero": 3,
  "cuarto": 4,
  "quinto": 5,
  "sexto": 6,
  "septimo": 7,
  "octavo": 8,
  "noveno": 9,
  "decimo": 10,
  "once": 11
};

export const validateTab = async (activeTab, trigger, setIsModalOpen) => {
  const fieldsByTab = {
    estudiante: [
      "name", "lastname", "studentBirthDate", "studentGender", "studentBirthPlace",
      "studentDocument", "studentDocumentNumber", "studentphone", "studentEmail",
      "studentGrade", "studentGroup", "studentShift", "studentRegister", "studentPhoto"
    ],
    academica: [
      "studentBlood", "studentEPS", "studentEthnic", "studentReference",
      "studentAddress", "studentNeighborhood", "studentLocality", "studentStatus", "studentZone"
    ],
    familia: [
      "motherName", "motherLastname", "motherTypeDocument", "motherDocument", "motherPhone", "motherEmail", "motherProfesion", "motherOcupation",
      "fatherName", "fatherLastname", "fatherTypeDocument", "fatherDocument", "fatherPhone", "fatherEmail", "fatherProfesion", "fatherOcupation"
    ]
  };

  const fieldsToValidate = fieldsByTab[activeTab] || [];
  if (fieldsToValidate.length > 0) {
    const isValid = await trigger(fieldsToValidate);
    if (!isValid) {
      setIsModalOpen(true);
      return false;
    }
  }
  return true;
};

// ✅ CORREGIDO: Coincide con los campos del backend (FastAPI schemas.py)
export const formatMatriculaData = (data) => {
  return {
    student: {
      fecha_registro: data.registerDate,
      nombres: data.name,
      apellidos: data.lastname,
      fecha_nacimiento: data.studentBirthDate,
      edad: data.studentAge,
      genero: data.studentGender,
      lugar_nacimiento: data.studentBirthPlace,
      tipo_documento: data.studentDocument,
      numero_documento: data.studentDocumentNumber,
      telefono: data.studentphone,
      correo: data.studentEmail,
      grado_id: gradeMap[data.studentGrade.toLowerCase()] || 0,
      grupo: data.studentGroup,
      jornada: data.studentShift,
      tipo_sangre: data.studentBlood,
      eps: data.studentEPS,
      etnia: data.studentEthnic,
      referencia: data.studentReference,
      direccion: data.studentAddress,
      barrio: data.studentNeighborhood,
      localidad: data.studentLocality,
      zona: data.studentZone,
    },
    academic: {
      direccion: data.studentAddress,
      barrio: data.studentNeighborhood,
      localidad: data.studentLocality,
      zona: data.studentZone,
      estado: data.studentStatus,
    },
    family: {
      madre: {
        nombres: data.motherName,
        apellidos: data.motherLastname,
        tipo_documento: data.motherTypeDocument,
        numero_documento: data.motherDocument,
        telefono: data.motherPhone,
        correo: data.motherEmail,
        profesion: data.motherProfesion,
        ocupacion: data.motherOcupation,
        parentesco: "Madre",
      },
      padre: {
        nombres: data.fatherName,
        apellidos: data.fatherLastname,
        tipo_documento: data.fatherTypeDocument,
        numero_documento: data.fatherDocument,
        telefono: data.fatherPhone,
        correo: data.fatherEmail,
        profesion: data.fatherProfesion,
        ocupacion: data.fatherOcupation,
        parentesco: "Padre",
      },
    },
  };
};

// ✅ Convierte una matrícula obtenida del backend al formato de formulario
export const transformMatriculaToFormValues = (matricula) => {
  return {
    registerDate: matricula.student.fecha_registro,
    name: matricula.student.nombres,
    lastname: matricula.student.apellidos,
    studentBirthDate: matricula.student.fecha_nacimiento,
    studentAge: matricula.student.edad?.toString() || "",
    studentGender: matricula.student.genero,
    studentBirthPlace: matricula.student.lugar_nacimiento,
    studentDocument: matricula.student.tipo_documento,
    studentDocumentNumber: matricula.student.numero_documento,
    studentphone: matricula.student.telefono,
    studentEmail: matricula.student.correo,
    studentGrade: matricula.student.grado_id,
    studentGroup: matricula.student.grupo,
    studentShift: matricula.student.jornada,
    studentBlood: matricula.student.tipo_sangre,
    studentEPS: matricula.student.eps,
    studentEthnic: matricula.student.etnia,
    studentReference: matricula.student.referencia,
    studentAddress: matricula.student.direccion,
    studentNeighborhood: matricula.student.barrio,
    studentLocality: matricula.student.localidad,
    studentZone: matricula.student.zona,
    studentStatus: matricula.academic.estado || "",

    motherName: matricula.family.madre?.nombres || "",
    motherLastname: matricula.family.madre?.apellidos || "",
    motherTypeDocument: matricula.family.madre?.tipo_documento || "",
    motherDocument: matricula.family.madre?.numero_documento || "",
    motherPhone: matricula.family.madre?.telefono || "",
    motherEmail: matricula.family.madre?.correo || "",
    motherProfesion: matricula.family.madre?.profesion || "",
    motherOcupation: matricula.family.madre?.ocupacion || "",

    fatherName: matricula.family.padre?.nombres || "",
    fatherLastname: matricula.family.padre?.apellidos || "",
    fatherTypeDocument: matricula.family.padre?.tipo_documento || "",
    fatherDocument: matricula.family.padre?.numero_documento || "",
    fatherPhone: matricula.family.padre?.telefono || "",
    fatherEmail: matricula.family.padre?.correo || "",
    fatherProfesion: matricula.family.padre?.profesion || "",
    fatherOcupation: matricula.family.padre?.ocupacion || "",
  };
};
