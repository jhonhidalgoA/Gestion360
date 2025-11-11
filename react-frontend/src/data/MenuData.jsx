import evaluationsImg from '../assets/student-img/evaluaciones.png';
import scheduleImg from '../assets/student-img/calendario.png';
import tasksImg from '../assets/student-img/algoritmo.png';
import activitatesImg from '../assets/student-img/actividades.png';
import chatImg from '../assets/student-img/chat.png';
import teamImg from '../assets/student-img/brainstorm.png';


const menuConfig = {
  admin: [
    {
      id: 1,
      icon: "how_to_reg",
      title: "Matrícula Estudiante",
      path: "/matricula",
      gradient: "linear-gradient(135deg, #F57C00)",
    },
    {
      id: 2,
      icon: "app_registration",
      title: "Registro Docente",
      path: "/registro-docente",
      gradient: "linear-gradient(135deg, #388E3C)",
    },
    {
      id: 3,
      icon: "hourglass_bottom",
      title: "Horario Grados",
      path: "/horario-grados",
      gradient: "linear-gradient(135deg, #A9A9A9 )",
    },
    {
      id: 4,
      icon: "schedule",
      title: "Horario Docentes",
      path: "/horario-docentes",
      gradient: "linear-gradient(135deg, #FF00FF)",
    },
    {
      id: 5,
      icon: "calendar_month",
      title: "Editar Calendario",
      path: "/calendario",
      gradient: "linear-gradient(135deg, #0D47A1)",
    },
    {
      id: 6,
      icon: "restaurant",
      title: "Editar Menú Escolar",
      path: "/menu-escolar",
      gradient: "linear-gradient(135deg, #7B1FA2)",
    },
    {
      id: 7,
      icon: "article",
      title: "Editar Noticias",
      path: "/noticias",
      gradient: "linear-gradient(135deg, #0097A7, #006064)",
    },
    {
      id: 8,
      icon: "description",
      title: "Agregar Circulares",
      path: "/circulares",
      gradient: "linear-gradient(135deg, #B8860B)",
    },
    {
      id: 9,
      icon: "forum",
      title: "Comunicación con Padres",
      path: "/comunicacion",
      gradient: "linear-gradient(135deg, #F08080)",
    },
  ],
  docente: [
    {
      id: 1,
      icon: "diamond_shine",
      title: "Calificaciones",
      path: "/calificaciones",
      gradient: "linear-gradient(135deg, #4169E1)",
    },
    {
      id: 2,
      icon: "app_registration",
      title: "Asistencia",
      path: "/asistencia",
      gradient: "linear-gradient(135deg, #32cd32)",
    },
    {
      id: 3,
      icon: "checklist_rtl",
      title: "Planeación",
      path: "/planeacion",
      gradient: "linear-gradient(135deg, #9c27b0, #7b1fa2)",
    },
    {
      id: 4,
      icon: "format_list_numbered",
      title: "Asignar Tareas",
      path: "/tareas",
      gradient: "linear-gradient(135deg, #ff9800, #f57c00)",
    },
    {
      id: 5,
      icon: "table_view",
      title: "Reportes Académicos",
      path: "/reportes",
      gradient: "linear-gradient(135deg, #000080)",
    },
    {
      id: 6,
      icon: "forum",
      title: "Comunicación con Padres",
      path: "/comunicacion",
      gradient: "linear-gradient(135deg, #ec407a, #d81b60)",
    },
    {
      id: 7,
      icon: "calendar_month",
      title: "Ver Calendario",
      path: "/calendario",
      gradient: "linear-gradient(135deg, #6B8E23)",
    },
    {
      id: 8,
      icon: "folder_eye",
      title: "Observador",
      path: "/observador",
      gradient: "linear-gradient(135deg, #7f8c8d, #636e72)",
    },
    {
      id: 9,
      icon: "family_restroom",
      title: "Agenda de Reuniones",
      path: "/atencion",
      gradient: "linear-gradient(135deg, #7B68EE)",
      iconSize: 100,
    },
  ],
  padre: [
    {
      id: 1,
      icon: "diamond_shine",
      title: "Calificaciones",
      path: "/calificaciones-estudiante",
      gradient: "linear-gradient(135deg, #5B8FF9, #3A6DD8)",      
      iconSize: 100,
    },
    {
      id: 2,
      icon: "app_registration",
      title: "Asistencia",
      path: "/asistencia",
      gradient: "linear-gradient(135deg, #5B8FF9, #3A6DD8)",      
      iconSize: 100,
    },
    {
      id: 3,
      icon: "schedule",
      title: "Ver Horario",
      path: "/horario-ver",
       gradient: "linear-gradient(135deg, #5B8FF9, #3A6DD8)", 
    },
    {
      id: 4,
      icon: "format_list_numbered",
      title: "Ver Tareas",
      path: "/tarea-ver",
      gradient: "linear-gradient(135deg, #5B8FF9, #3A6DD8)", 
    },
    {
      id: 5,
      icon: "table_view",
      title: "Reportes Académicos",
      path: "/reportes-ver",
      gradient: "linear-gradient(135deg, #5B8FF9, #3A6DD8)",
    },
    {
      id: 6,
      icon: "forum",
      title: "Comunicación",
      path: "/comunicacion",
      gradient: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    },
    
  ],
  estudiante: [
    {
      id: 1,      
      title: "Mi Horario",
      path: "/horario-ver",
      iconUrl:scheduleImg,
      gradient: "linear-gradient(135deg, #90d40aff)"
    },
    {
      id: 2,     
      title: " Mis Calificaciones",
      path: "/calificaciones-estudiante",    
      iconUrl: evaluationsImg,  
      gradient: "linear-gradient(135deg, #F59E0B, #D97706)"   
      
    },
    {
      id: 3,
      icon: "format_list_numbered",
      title: "Mis Tareas",
      path: "/tareas-hacer",
      iconUrl: activitatesImg,
      gradient: "linear-gradient(135deg, #5B8FF9, #3A6DD8)", 
    },
        
    {
      id:4,
      icon: "table_view",
      title: "Compañeros",
      path: "/compañeros",
      iconUrl: teamImg,
      gradient: "linear-gradient(135deg, #F7971E, #FFD200)",
    },

    {
      id:5,
      icon: "app_registration",
      title: "Recursos",
      path: "/recursos",
      iconUrl:tasksImg,
      gradient: "linear-gradient(135deg, #6C63FF, #836FFF)"      
      
    }, 
    
     {
      id:6,
      icon: "forum",
      title: "Mensajes",
      path: "/comunicacion",
      iconUrl:chatImg,
      gradient: "linear-gradient(135deg, #ec407a, #d81b60)",
    },
   
    
  ],
};

export const getMenuData = (role) => {
  return menuConfig[role] || [];
};
