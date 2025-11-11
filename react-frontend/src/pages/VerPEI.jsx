import { useEffect } from "react";
import "./VerPEI.css";

const VerPEI = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pei-container">
      <div className="pdf-container">
        <iframe
          src="/pdfs/pei.pdf"
          title="Proyecto Educativo Institucional"
          width="100%"
          height="90vh"
          style={{ border: "none" }}
        />
      </div>
    </div>
  );
};

export default VerPEI;