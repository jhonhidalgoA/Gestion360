// src/components/matricula/utils/apiHelpers.js

export const postMatricula = async (data) => {
  const response = await fetch("http://localhost:3001/matriculas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Error al crear matrícula");
  return response.json();
};

export const putMatricula = async (id, data) => {
  const response = await fetch(`http://localhost:3001/matriculas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Error al actualizar matrícula");
  return response.json();
};