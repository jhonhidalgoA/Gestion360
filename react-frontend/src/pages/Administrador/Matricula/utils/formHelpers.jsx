// src/components/matricula/utils/formHelpers.js

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

export const formatMatriculaData = (data) => {
  return {
    registerDate: data.registerDate,
    codigo: data.codigo,
    student: {
      photo: data.studentPhoto,
      name: data.name,
      lastname: data.lastname,
      birthDate: data.studentBirthDate,
      age: data.studentAge,
      gender: data.studentGender,
      birthPlace: data.studentBirthPlace,
      documentType: data.studentDocument,
      documentNumber: data.studentDocumentNumber,
      phone: data.studentphone,
      email: data.studentEmail,
      eps: data.studentEPS,
      grade: data.studentGrade,
      group: data.studentGroup,
      bloodType: data.studentBlood,
      shift: data.studentShift,
      ethnicGroup: data.studentEthnic,
      reference: data.studentReference,
      registerType: data.studentRegister,
    },
    academic: {
      address: data.studentAddress,
      neighborhood: data.studentNeighborhood,
      locality: data.studentLocality,
      status: data.studentStatus,
      zone: data.studentZone,
    },
    family: {
      mother: {
        name: data.motherName,
        lastname: data.motherLastname,
        documentType: data.motherTypeDocument,
        document: data.motherDocument,
        phone: data.motherPhone,
        email: data.motherEmail,
        profession: data.motherProfesion,
        occupation: data.motherOcupation,
      },
      father: {
        name: data.fatherName,
        lastname: data.fatherLastname,
        documentType: data.fatherTypeDocument,
        document: data.fatherDocument,
        phone: data.fatherPhone,
        email: data.fatherEmail,
        profession: data.fatherProfesion,
        occupation: data.fatherOcupation,
      },
    },
  };
};

// ✅ NUEVO: Transforma una matrícula de la API al formato de defaultValues
export const transformMatriculaToFormValues = (matricula) => {
  return {
    registerDate: matricula.registerDate,
    codigo: matricula.codigo,
    studentPhoto: matricula.student.photo || null,

    // Estudiante
    name: matricula.student.name,
    lastname: matricula.student.lastname,
    studentBirthDate: matricula.student.birthDate,
    studentAge: matricula.student.age?.toString() || "",
    studentGender: matricula.student.gender,
    studentBirthPlace: matricula.student.birthPlace,
    studentDocument: matricula.student.documentType,
    studentDocumentNumber: matricula.student.documentNumber,
    studentphone: matricula.student.phone,
    studentEmail: matricula.student.email,
    studentGrade: matricula.student.grade,
    studentGroup: matricula.student.group,
    studentShift: matricula.student.shift,
    studentRegister: matricula.student.registerType || "",

    // Académicos
    studentBlood: matricula.student.bloodType,
    studentEPS: matricula.student.eps,
    studentEthnic: matricula.student.ethnicGroup,
    studentReference: matricula.student.reference,
    studentAddress: matricula.academic.address,
    studentNeighborhood: matricula.academic.neighborhood,
    studentLocality: matricula.academic.locality,
    studentStatus: matricula.academic.status?.toString() || "",
    studentZone: matricula.academic.zone,

    // Madre
    motherName: matricula.family.mother.name,
    motherLastname: matricula.family.mother.lastname,
    motherTypeDocument: matricula.family.mother.documentType,
    motherDocument: matricula.family.mother.document,
    motherPhone: matricula.family.mother.phone,
    motherEmail: matricula.family.mother.email,
    motherProfesion: matricula.family.mother.profession,
    motherOcupation: matricula.family.mother.occupation,

    // Padre
    fatherName: matricula.family.father.name,
    fatherLastname: matricula.family.father.lastname,
    fatherTypeDocument: matricula.family.father.documentType,
    fatherDocument: matricula.family.father.document,
    fatherPhone: matricula.family.father.phone,
    fatherEmail: matricula.family.father.email,
    fatherProfesion: matricula.family.father.profession,
    fatherOcupation: matricula.family.father.occupation,
  };
};