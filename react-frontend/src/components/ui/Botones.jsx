
import "./Botones.css";

const ActionButtons = ({
 
  onLoad,
  loadLabel = "Cargar",
  loadLoading = false,
  loadDisabled = false,
 
  onSave,
  saveLabel = "Guardar",
  saveLoading = false,
  saveDisabled = false,

  onEdit,
  editLabel = "Editar",
  editLoading = false,
  editDisabled = false,

  onSend,
  sendLabel = "Enviar",
  sendLoading = false,
  sendDisabled = false,


  onDelete,
  deleteLabel = "Borrar",
  deleteLoading = false,
  deleteDisabled = false,

  // Ver
  onView,
  viewLabel = "Ver",
  viewLoading = false,
  viewDisabled = false,

  // Generar PDF
  onLoadPDF,
  pdfLabel = "Generar PDF",
  pdfLoading = false,
  pdfDisabled = false,


 


}) => {
  
  const getButtonText = (isLoading, label, loadingText) => {
    return isLoading ? loadingText : label;
  };

  return (
    <div className="action-buttons">
      {onLoad && (
        <button
          type="button"
          className="btn btn-load"
          onClick={onLoad}
          disabled={loadLoading || loadDisabled}
        >
          <span className="material-symbols-outlined icon-btn">
            {loadLoading ? "hourglass_empty" : "add"}
          </span>
          {getButtonText(loadLoading, loadLabel, "Cargando...")}
        </button>
      )}

      {onSave && (
        <button
          type="button"
          className="btn btn-save"
          onClick={onSave}
          disabled={saveLoading || saveDisabled}
        >
          <span className="material-symbols-outlined icon-btn">
            {saveLoading ? "hourglass_empty" : "save"}
          </span>
          {getButtonText(saveLoading, saveLabel, "Guardando...")}
        </button>
      )}

      {onEdit && (
        <button
          type="button"
          className="btn btn-edit"
          onClick={onEdit}
          disabled={editLoading || editDisabled}
        >
          <span className="material-symbols-outlined icon-btn">
            {editLoading ? "hourglass_empty" : "edit"}
          </span>
          {getButtonText(editLoading, editLabel, "Editando...")}
        </button>
      )}

       {onSend && (
        <button
          type="button"
          className="btn btn-send"
          onClick={onSend}
          disabled={sendLoading || sendDisabled}
        >
          <span className="material-symbols-outlined icon-btn">
            {sendLoading ? "hourglass_empty" : "attach_email"}
          </span>
          {getButtonText(sendLoading, sendLabel, "Enviando...")}
        </button>
      )}

      {onDelete && (
        <button
          type="button"
          className="btn btn-delet"
          onClick={onDelete}
          disabled={deleteLoading || deleteDisabled}
        >
          <span className="material-symbols-outlined icon-btn">
            {deleteLoading ? "hourglass_empty" : "delete"}
          </span>
          {getButtonText(deleteLoading, deleteLabel, "Borrando...")}
        </button>
      )}

      {onView && (
        <button
          type="button"
          className="btn btn-view"
          onClick={onView}
          disabled={viewLoading || viewDisabled}
        >
          <span className="material-symbols-outlined icon-btn">
            {viewLoading ? "hourglass_empty" : "visibility"}
          </span>
          {getButtonText(viewLoading, viewLabel, "Cargando...")}
        </button>
      )}

      {onLoadPDF && (
        <button
          type="button"
          className="btn btn-pdf"
          onClick={onLoadPDF}
          disabled={pdfLoading || pdfDisabled}
        >
          <span className="material-symbols-outlined icon-btn">
            {pdfLoading ? "hourglass_empty" : "picture_as_pdf"}
          </span>
          {getButtonText(pdfLoading, pdfLabel, "Generando PDF...")}
        </button>
      )}

      
    </div>
  );
};

export default ActionButtons;