const API_URL = 'https://ciclysan.onrender.com/api/rutas';

export const getRutasAdmin = async () => {
    try {
        const res = await fetch(API_URL);
        return await res.json();
    } catch (error) {
        console.error('Error cargando rutas para admin', error);
        return [];
    }
};


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

export const toggleRutaVisibilidad = async (id, estado) => {
    try {
        const res = await fetch(`${API_URL}/estado/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ estado }),
        });
        if (!res.ok) {
            throw new Error('Error al actualizar la visibilidad');
        }
    } catch (error) {
        console.error('Error al cambiar la visibilidad:', error);
        throw error;
    }
};

export const deleteRuta = async (id) => {
    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });
        if (!res.ok) {
            throw new Error('Error al eliminar la ruta');
        }
    } catch (error) {
        console.error('Error al eliminar la ruta:', error);
        throw error;
    }
};

export const updateRuta = async (id, data) => {
    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.msg || 'Error al actualizar la ruta');
        }
        return await res.json();
    } catch (error) {
        console.error('Error al actualizar la ruta:', error);
        throw error;
    }
};


export default {
  getRutasVisibles,
  postRutas
};