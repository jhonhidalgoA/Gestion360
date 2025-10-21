import {Link} from "react-router-dom"
import { institutionalData } from "../../../data/InstitucionalData"
import ScheduleCard from "../../ui/InstitucionalCard"


const Institucional = () => {
  return (
    <div>
        <div className="schedule-container">
        {institutionalData.map((item) => (
          <Link to={item.path} key={item.id} style={{ textDecoration: 'none' }}>
          <ScheduleCard
            key={item.id}
            icon={item.icon}
            title={item.title} 
            subtitle={item.subtitle}            
            linkText={item.linkText}
          />
          </Link>
        ))}
      </div>    
    </div>
  )
}

export default Institucional
