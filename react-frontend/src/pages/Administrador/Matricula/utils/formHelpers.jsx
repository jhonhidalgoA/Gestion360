const gradeMap = {
  "preescolar": 0,  
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
  "undecimo": 11    
};

// Calcula edad a partir de la fecha de nacimiento
const calculateAge = (birthDateString) => {
  if (!birthDateString) return 0;
  const birthDate = new Date(birthDateString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};



export const validateTab = async (activeTab, trigger, setIsModalOpen) => {
  const fieldsByTab = {
    estudiante: [
      "name", "lastname", "studentBirthDate", "studentGender", "studentBirthPlace",
      "studentDocument", "studentDocumentNumber", "studentphone", "studentEmail",
      "studentGrade", "studentGroup", "studentShift"
    ],
    academica: [
      "studentBlood", "studentEPS", "studentEthnic", "studentReference",
      "studentAddress", "studentNeighborhood", "studentLocality", "studentZone"
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


export const formatMatriculaData = (data) => {
  const edad = calculateAge(data.studentBirthDate);
  const numeroDocumento = data.studentDocumentNumber;

  return {
    student: {
      nombres: data.name,
      apellidos: data.lastname,
      fecha_nacimiento: data.studentBirthDate,
      edad: edad,
      genero: data.studentGender,
      lugar_nacimiento: data.studentBirthPlace,
      tipo_documento: data.studentDocument,
      numero_documento: data.studentDocumentNumber,
      password: numeroDocumento,
      telefono: data.studentphone,
      correo: data.studentEmail || null, 
      grado_id: gradeMap[data.studentGrade?.toLowerCase()] || 1,
      grupo: data.studentGroup || "A",
      jornada: data.studentShift || "Mañana",
      tipo_sangre: data.studentBlood || "No especificado",
      eps: data.studentEPS || "Ninguna",
      etnia: data.studentEthnic || "No especificado",
      referencia: data.studentReference || "Ninguna",
      direccion: data.studentAddress || "",
      barrio: data.studentNeighborhood || "",
      localidad: data.studentLocality || "",
      zona: data.studentZone || "Urbana",
      foto: data.studentPhoto || null
      
    },
    family: {
      madre: {
        nombres: data.motherName || "",
        apellidos: data.motherLastname || "",
        tipo_documento: data.motherTypeDocument || "CC",
        numero_documento: data.motherDocument || "",
        telefono: data.motherPhone || "",
        correo: data.motherEmail || null,
        profesion: data.motherProfesion || "",
        ocupacion: data.motherOcupation || "",
        parentesco: "Madre"
      },
      padre: {
        nombres: data.fatherName || "",
        apellidos: data.fatherLastname || "",
        tipo_documento: data.fatherTypeDocument || "CC",
        numero_documento: data.fatherDocument || "",
        telefono: data.fatherPhone || "",
        correo: data.fatherEmail || null,
        profesion: data.fatherProfesion || "",
        ocupacion: data.fatherOcupation || "",
        parentesco: "Padre"
      }
    }
    // ⚠️ NADA de "academic" → tu backend no lo usa y causa 422
  };
};

// ✅ Solo para edición — si tu backend devuelve "academic", mapea a los campos del estudiante
export const transformMatriculaToFormValues = (matricula) => {
  return {
    name: matricula.student.nombres || "",
    lastname: matricula.student.apellidos || "",
    studentBirthDate: matricula.student.fecha_nacimiento || "",
    studentGender: matricula.student.genero || "",
    studentBirthPlace: matricula.student.lugar_nacimiento || "",
    studentDocument: matricula.student.tipo_documento || "CC",
    studentDocumentNumber: matricula.student.numero_documento || "",
    studentphone: matricula.student.telefono || "",
    studentEmail: matricula.student.correo || "",
    studentGrade: Object.keys(gradeMap).find(key => gradeMap[key] === matricula.student.grado_id) || "primero",
    studentGroup: matricula.student.grupo || "A",
    studentShift: matricula.student.jornada || "Mañana",
    studentBlood: matricula.student.tipo_sangre || "",
    studentEPS: matricula.student.eps || "",
    studentEthnic: matricula.student.etnia || "",
    studentReference: matricula.student.referencia || "",
    studentAddress: matricula.student.direccion || "",
    studentNeighborhood: matricula.student.barrio || "",
    studentLocality: matricula.student.localidad || "",
    studentZone: matricula.student.zona || "Urbana",

    motherName: matricula.family?.madre?.nombres || "",
    motherLastname: matricula.family?.madre?.apellidos || "",
    motherTypeDocument: matricula.family?.madre?.tipo_documento || "CC",
    motherDocument: matricula.family?.madre?.numero_documento || "",
    motherPhone: matricula.family?.madre?.telefono || "",
    motherEmail: matricula.family?.madre?.correo || "",
    motherProfesion: matricula.family?.madre?.profesion || "",
    motherOcupation: matricula.family?.madre?.ocupacion || "",

    fatherName: matricula.family?.padre?.nombres || "",
    fatherLastname: matricula.family?.padre?.apellidos || "",
    fatherTypeDocument: matricula.family?.padre?.tipo_documento || "CC",
    fatherDocument: matricula.family?.padre?.numero_documento || "",
    fatherPhone: matricula.family?.padre?.telefono || "",
    fatherEmail: matricula.family?.padre?.correo || "",
    fatherProfesion: matricula.family?.padre?.profesion || "",
    fatherOcupation: matricula.family?.padre?.ocupacion || "",
  };
};

export const mapMatriculaToFrontend = (matricula) => {
  const student = matricula.student;
  const family = matricula.family || {};
  const madre = family.madre || {};
  const padre = family.padre || {};

  const gradeIdToName = {
    0: "preescolar",
    1: "primero",
    2: "segundo",
    3: "tercero",
    4: "cuarto",
    5: "quinto",
    6: "sexto",
    7: "septimo",
    8: "octavo",
    9: "noveno",
    10: "decimo",
    11: "undecimo"
  };

  return {
    // Estudiante
    name: student.nombres || "",
    lastname: student.apellidos || "",
    studentBirthDate: student.fecha_nacimiento ? student.fecha_nacimiento.split("T")[0] : "",
    studentGender: student.genero || "",
    studentBirthPlace: student.lugar_nacimiento || "",
    studentDocument: student.tipo_documento || "CC",
    studentDocumentNumber: student.numero_documento || "",
    studentphone: student.telefono || "",
    studentEmail: student.correo || "",
    studentGrade: gradeIdToName[student.grado_id] || "primero",
    studentGroup: student.grupo || "A",
    studentShift: student.jornada || "Mañana",
    studentRegister: "",

    // Académica
    studentBlood: student.tipo_sangre || "No especificado",
    studentEPS: student.eps || "Ninguna",
    studentEthnic: student.etnia || "No especificado",
    studentReference: student.referencia || "Ninguna",
    studentAddress: student.direccion || "",
    studentNeighborhood: student.barrio || "",
    studentLocality: student.localidad || "",
    studentZone: student.zona || "Urbana",

    // Familia
    motherName: madre.nombres || "",
    motherLastname: madre.apellidos || "",
    motherTypeDocument: madre.tipo_documento || "CC",
    motherDocument: madre.numero_documento || "",
    motherPhone: madre.telefono || "",
    motherEmail: madre.correo || "",
    motherProfesion: madre.profesion || "",
    motherOcupation: madre.ocupacion || "",

    fatherName: padre.nombres || "",
    fatherLastname: padre.apellidos || "",
    fatherTypeDocument: padre.tipo_documento || "CC",
    fatherDocument: padre.numero_documento || "",
    fatherPhone: padre.telefono || "",
    fatherEmail: padre.correo || "",
    fatherProfesion: padre.profesion || "",
    fatherOcupation: padre.ocupacion || "",

    // Foto
    studentPhoto: student.foto || null
  };
};