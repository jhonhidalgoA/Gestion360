import talento_1 from "../assets/images/talento-01.jpg";
import talento_2 from "../assets/images/talento-02.jpg";
import talento_3 from "../assets/images/talento-03.jpg";
import talento_4 from "../assets/images/talento-04.jpg";

import estudiante_1 from "../assets/images/estudiante-04.png";

import maestro_1 from "../assets/images/maestro-01.jpg";
import familia_1 from "../assets/images/familia-01.jpg";
import bachiller_1 from "../assets/images/bachilleres-01.jpg";
import primaria_1 from "../assets/images/primaria-01.png";

export const newsData = [
  {
    id: 1,
    image: talento_1,
    school: "Colegio",
    title: "Realización Festival de Talentos 2025",
    date: "06-jun-2025",
    comment:
      "Un evento lleno de música, baile y arte donde nuestros estudiantes demostraron sus increíbles habilidades artísticas. Más de 200 participantes deleitaron al público con presentaciones memorables.",
    buttonText: "Ver detalles",
    buttonLink: "/noticias/1",
    photos: [
      {
        url: talento_1,
        title: "Ana María Agudelo",
        subtitle: "Grado 3A",
        comment:
          "Participó con entusiasmo y seguridad en la presentación artística, destacándose por su expresividad y dedicación. Su actuación refleja el compromiso y el talento que caracterizan a nuestros estudiantes.",
      },
      { url: talento_2, title: "Grado 2B", subtitle: "Baile grupal", comment: "Una alegre presentación de baile grupal durante la muestra de talentos, destacándose por su entusiasmo, coordinación y trabajo en equipo. Su participación llenó el escenario de energía y sonrisas."  },
      {
        url: talento_3,
        title: "Valentina Rendon - Maritza Giraldo - Estefania Gomez",
        subtitle: "Grado 4B",
        comment: "La presentación de su obra de teatro, destacándose por su talento, expresividad y compañerismo. Su actuación transmitió alegría y emoción al público.",
      },
      { url: talento_4, title: "Jorge Armando Giraldo", subtitle: "Docente" },
    ],
  },
  {
    id: 2,
    image: estudiante_1,
    school: "Colegio",
    title: "Celebración Día del Estudiante 2025",
    date: "15-may-2025",
    comment:
      "Un evento lleno de música, baile y arte donde nuestros estudiantes",
    buttonText: "Ver detalles",
    buttonLink: "/noticias/2",
    photos: [
      {
        url: talento_1,
        title: "Talento 1",
        subtitle: "Canto y baile",
        comment: "Estudiante cantando en el escenario.",
      },
      {
        url: talento_2,
        title: "Talento 2",
        subtitle: "Baile grupal",
        comment: "Grupo de baile en acción.",
      },
    ],
  },
  {
    id: 3,
    image: maestro_1,
    school: "Colegio",
    title: "Celebración Día del Maestro 2025",
    date: "22-abr-2025",
    buttonText: "Ver detalles",
    buttonLink: "/eventos/1",
    photos: [
      {
        url: talento_1,
        title: "Talento 1",
        subtitle: "Canto y baile",
        comment: "Estudiante cantando en el escenario.",
      },
      {
        url: talento_2,
        title: "Talento 2",
        subtitle: "Baile grupal",
        comment: "Grupo de baile en acción.",
      },
    ],
  },
  {
    id: 4,
    image: familia_1,
    school: "Colegio",
    title: "Celebración Día de la Familia 2025",
    date: "22-abr-2025",
    buttonText: "Ver detalles",
    buttonLink: "/eventos/1",
    photos: [
      {
        url: talento_1,
        title: "Talento 1",
        subtitle: "Canto y baile",
        comment: "Estudiante cantando en el escenario.",
      },
      {
        url: talento_2,
        title: "Talento 2",
        subtitle: "Baile grupal",
        comment: "Grupo de baile en acción.",
      },
    ],
  },
  {
    id: 5,
    image: bachiller_1,
    school: "Colegio",
    title: "Graduación Bachilleres 2024",
    date: "30-nov-2024",
    buttonText: "Ver detalles",
    buttonLink: "/eventos/1",
    photos: [
      {
        url: talento_1,
        title: "Talento 1",
        subtitle: "Canto y baile",
        comment: "Estudiante cantando en el escenario.",
      },
      {
        url: talento_2,
        title: "Talento 2",
        subtitle: "Baile grupal",
        comment: "Grupo de baile en acción.",
      },
    ],
  },
  {
    id: 6,
    image: primaria_1,
    school: "Colegio",
    title: "Graduación Primaria 2024",
    date: "30-nov-2024",
    buttonText: "Ver detalles",
    buttonLink: "/eventos/1",
    photos: [
      {
        url: talento_1,
        title: "Talento 1",
        subtitle: "Canto y baile",
        comment: "Estudiante cantando en el escenario.",
      },
      {
        url: talento_2,
        title: "Talento 2",
        subtitle: "Baile grupal",
        comment: "Grupo de baile en acción.",
      },
    ],
  },
];
