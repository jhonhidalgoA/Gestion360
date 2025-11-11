// src/components/matricula/utils/apiHelpers.js

// 📌 IMPORTANTE: cambia la URL al endpoint real de tu backend FastAPI
// Ejemplo si tu backend corre en localhost:8000:
const BASE_URL = "http://localhost:8000";

export const postMatricula = async (data) => {
  const response = await fetch(`${BASE_URL}/register-student`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error al crear matrícula:", errorText);
    throw new Error("Error al crear matrícula");
  }

  return response.json();
};

export const putMatricula = async (id, data) => {
  const response = await fetch(`${BASE_URL}/matriculas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error al actualizar matrícula:", errorText);
    throw new Error("Error al actualizar matrícula");
  }

  return response.json();
};
