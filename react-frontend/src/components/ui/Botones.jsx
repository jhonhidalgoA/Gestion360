import React from "react";
import { FaSave, FaEdit, FaTrash, FaFilePdf } from "react-icons/fa";
import "./Botones.css";

const ActionButtons = ({ 
  onSave, 
  onEdit, 
  onDelete, 
  onGeneratePDF,
  saveLabel = "Guardar",
  editLabel = "Editar",
  deleteLabel = "Borrar",
  generatePDFLabel = "Generar PDF"
}) => {
  return (
    <div className="action-buttons">
      <button
        type="button"
        className="btn btn-primary"
        onClick={onSave}
      >
        <FaSave /> {saveLabel}
      </button>
      <button
        type="button"
        className="btn btn-secondary"
        onClick={onEdit}
      >
        <FaEdit /> {editLabel}
      </button>
      <button
        type="button"
        className="btn btn-danger"
        onClick={onDelete}
      >
        <FaTrash /> {deleteLabel}
      </button>
      <button
        type="button"
        className="btn btn-info"
        onClick={onGeneratePDF}
      >
        <FaFilePdf /> {generatePDFLabel}
      </button>
    </div>
  );
};

export default ActionButtons;