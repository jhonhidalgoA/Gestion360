import { institutionalData } from "../../../data/institucionalData"
import ScheduleCard from "../../ui/ScheduleCard"
import "./Institucional.css"

const Institucional = () => {
  return (
    <div>
        <div className="schedule-container">
        {institutionalData.map((item) => (
          <ScheduleCard
            key={item.id}
            icon={item.icon}
            title={item.title}            
            linkText={item.linkText}
          />
        ))}
      </div>    
    </div>
  )
}

export default Institucional
