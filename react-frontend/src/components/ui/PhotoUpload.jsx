import { useState, useEffect } from "react";
import "./PhotoUpload.css";

const PhotoUpload = ({
  onChange,
  value,
  error,
  label = "Foto",
  maxSizeMB = 5,
  allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"],
  id = "photo-upload"
}) => {
  const [preview, setPreview] = useState(null);

  
  useEffect(() => {
    if (value) {     
      if (value instanceof File) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(value);
      } 
      
      else if (typeof value === 'string') {
        setPreview(value);
      }
    } else {
     
      setPreview(null);
      const fileInput = document.getElementById(id);
      if (fileInput) {
        fileInput.value = "";
      }
    }
  }, [value, id]);

  const validateFile = (file) => {
    
    if (!allowedTypes.includes(file.type)) {
      const typesString = allowedTypes.map(t => t.split('/')[1].toUpperCase()).join(', ');
      throw new Error(`Solo se permiten archivos: ${typesString}`);
    }
    
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      throw new Error(`La imagen debe pesar menos de ${maxSizeMB}MB`);
    }

    return true;
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setPreview(null);
      onChange(null);
      return;
    }

    try {     
      validateFile(file);
     
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        onChange(file);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      alert(error.message);
      e.target.value = "";
      setPreview(null);
      onChange(null);
    }
  };

  const clearPhoto = () => {
    setPreview(null);
    onChange(null);
    const fileInput = document.getElementById(id);
    if (fileInput) {
      fileInput.value = "";
    }
  };

  return (
    <div className="photo-upload-container">
      <label
        htmlFor={id}
        className={`photo-upload-label ${error ? "photo-error" : ""}`}
      >
        {!preview && <span className="photo-upload-text">{label}</span>}
        <input
          type="file"
          id={id}
          accept={allowedTypes.join(',')}
          onChange={handlePhotoChange}
          className="photo-upload-input"
        />
        <div
          className="photo-preview"
          style={{
            backgroundImage: preview ? `url(${preview})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
            border: preview
              ? "2px solid #28a745"
              : error
              ? "2px dashed #dc3545"
              : "2px dashed #adb5bd",
          }}
        >
          {!preview && (
            <div className="photo-placeholder">
              <svg 
                width="48" 
                height="48" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              <span>Click para subir</span>
            </div>
          )}
        </div>
      </label>

      {preview && (
        <button
          type="button"
          onClick={clearPhoto}
          className="clear-photo-btn"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
          Quitar foto
        </button>
      )}

      {error && (
        <span className="photo-error-message">{error.message}</span>
      )}
    </div>
  );
};

export default PhotoUpload;