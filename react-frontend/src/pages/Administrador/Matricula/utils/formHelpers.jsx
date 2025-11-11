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

// ✅ JSON que SÍ funciona con tu backend (basado en el log de éxito)
export const formatMatriculaData = (data) => {
  const edad = calculateAge(data.studentBirthDate);

  return {
    student: {
      nombres: data.name,
      apellidos: data.lastname,
      fecha_nacimiento: data.studentBirthDate,
      edad: edad, // Asegura que sea número
      genero: data.studentGender,
      lugar_nacimiento: data.studentBirthPlace,
      tipo_documento: data.studentDocument,
      numero_documento: data.studentDocumentNumber,
      telefono: data.studentphone,
      correo: data.studentEmail || null, // Permite null si no hay correo
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
      password: "temp1234" // o el que uses; tu backend lo hashea
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