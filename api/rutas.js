const API_URL = 'https://ciclysan.onrender.com/api/rutas';

export const getRutasVisibles = async () => {
  try {
    const res = await fetch(`${API_URL}/visibles`);
    return await res.json();
  } catch (error) {
    console.error('Error cargando rutas', error);
    return [];
  }
};

export const postRutas = async (ruta) => {
  try {
    const res = await fetch(`${API_URL}`, { // ← OJO con la ruta
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ruta)
    });

    if (!res.ok) throw new Error('Error al guardar la ruta');
    return await res.json();

  } catch (error) {
    console.error('Error guardando rutas', error);
    return [];
  }
};


export default {
  getRutasVisibles,
  postRutas
};