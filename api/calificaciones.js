// src/api/calificaciones.js
const API_URL = 'https://ciclysan.onrender.com/api/calificacion';

export const saveCalificacion = async (rutaId, userId, rating) => {
  try {
    const res = await fetch(`${API_URL}/calificar-ruta`, { // ← OJO con la ruta
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rutaId, userId, rating })
    });

    if (!res.ok) throw new Error('Error al guardar calificación');
    return await res.json();
  } catch (error) {
    console.error('Error guardando calificación', error);
    throw error;
  }
};

export const getPromedioCalificacion = async (rutaId) => {
  try {
    const res = await fetch(`${API_URL}/promedio/${rutaId}`);
    if (!res.ok) throw new Error('Error al obtener promedio');
    return await res.json();
  } catch (error) {
    console.error('Error promedio calificación', error);
    return { promedio: 0, totalVotos: 0 };
  }
};
