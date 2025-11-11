
import { isSameDay } from './utils/dateHelpers';

const EventBar = ({ event, cellDate, onEdit }) => {
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);

  
  const getBarClass = () => {
    const isStart = isSameDay(startDate, cellDate);
    const isEnd = isSameDay(endDate, cellDate);

    if (isStart && isEnd) return 'single';
    if (isStart) return 'start';
    if (isEnd) return 'end';
    return 'middle';
  };

  const handleClick = (e) => {
    e.stopPropagation();
    onEdit(event.id);
  };

  return (
    <div
      className={`event-bar color-${event.color} ${getBarClass()}`}
      onClick={handleClick}
      title={event.title}
    >
      {event.title}
    </div>
  );
};

export default EventBar;