import { useEffect } from "react"
import "./VerManual.css"

const VerManual = () => {
     useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div>
      <div className="pdf-container">
        <iframe
          src="/pdfs/manualConvivencia.pdf"
          title="Manual de Convivencia"
          width="100%"
          height="80vh"
          style={{ border: "none" }}
        />
      </div>
    </div>
  )
}

export default VerManual
