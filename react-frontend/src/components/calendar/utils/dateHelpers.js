
export const months = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

/* Formatea una fecha como YYYY-MM-DD */
export const formatDateForInput = (date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

/* Formatea una fecha como "día mes" */

export const formatDateShort = (date) => {
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
};

/* Obtiene el primer día del mes */
export const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month, 1);
};

/* Obtiene el último día del mes */
export const getLastDayOfMonth = (year, month) => {
  return new Date(year, month + 1, 0);
};

/* Obtiene la fecha de inicio para renderizar el calendario (incluyendo días del mes anterior) */
export const getCalendarStartDate = (year, month) => {
  const firstDay = getFirstDayOfMonth(year, month);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());
  return startDate;
};

/* Verifica si dos fechas son el mismo día */
export const isSameDay = (date1, date2) => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

/* Verifica si una fecha es hoy */
export const isToday = (date) => {
  return isSameDay(date, new Date());
};

/* Verifica si una fecha está dentro de un rango  */
export const isDateInRange = (date, startDate, endDate) => {
  const checkDate = new Date(date);
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  checkDate.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  
  return checkDate >= start && checkDate <= end;
};

/* Obtiene el rango de fechas para mostrar en el formato: "1 ene - 5 ene" o "1 ene" */
export const getDateRangeString = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (isSameDay(start, end)) {
    return formatDateShort(start);
  }
  
  return `${formatDateShort(start)} - ${formatDateShort(end)}`;
};

/* Genera un array de 42 días para el calendario (6 semanas)  */
export const generateCalendarDays = (year, month) => {
  const startDate = getCalendarStartDate(year, month);
  const days = [];
  
  for (let i = 0; i < 42; i++) {
    const cellDate = new Date(startDate);
    cellDate.setDate(startDate.getDate() + i);
    days.push(cellDate);
  }
  
  return days;
};