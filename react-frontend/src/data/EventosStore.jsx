let _eventsData = null;

export const setEventsData = (newData) => {
  _eventsData = newData;
};

export const getEventsData = () => {
  return _eventsData || []; 
};