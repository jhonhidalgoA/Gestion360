import { institutionalData } from "../../../data/InstitucionalData"
import ScheduleCard from "../../ui/InstitucionalCard"
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
            subtitle={item.subtitle}            
            linkText={item.linkText}
          />
        ))}
      </div>    
    </div>
  )
}

export default Institucional
