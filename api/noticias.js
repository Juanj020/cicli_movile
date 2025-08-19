const API_URL = 'https://ciclysan.onrender.com/api/noticias';

export const getNoticiasVisibles = async () => {
  try {
    const res = await fetch(`${API_URL}/visibles`);
    if (!res.ok) {
      throw new Error('Error al obtener noticias visibles');
    }
    return await res.json();
  } catch (error) {
    console.error('Error cargando Noticias visibles', error);
    return [];
  }
};

export const getNoticias = async () => {
  try {
    const res = await fetch(`${API_URL}`);
    if (!res.ok) {
      throw new Error('Error al obtener noticias');
    }
    return await res.json();
  } catch (error) {
    console.error('Error cargando Noticias', error);
    return [];
  }
};

export const newNoticia = async (noticia) => {
  try {
    const res = await fetch(`${API_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(noticia)
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.msg || 'Error al crear la noticia');
    }
    return await res.json();
  } catch (error) {
    console.error('Error creando Noticia', error);
    throw error;
  }
};

export const importarNoticias = async () => {
  try {
    const res = await fetch(`${API_URL}/noti/importar-externas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    });
    if (!res.ok) {
      throw new Error('Error al importar noticias');
    }
    return await res.json();
  } catch (error) {
    console.error('Error importando noticias:', error);
    throw error;
  }
};

export const deleteNoticia = async (id) => {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Error al eliminar la noticia');
    }
    return await res.json();
  } catch (error) {
    console.error('Error eliminando Noticia', error);
    throw error;
  }
};

export const toggleNoticiaVisibilidad = async (id, estado) => {
  try {
    const res = await fetch(`${API_URL}/estado/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ estado }),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.msg || 'Error al cambiar el estado de la noticia');
    }
    return await res.json();
  } catch (error) {
    console.error('Error cambiando la visibilidad de la noticia', error);
    throw error;
  }
};

export const updateNoticia = async (id, noticia) => {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(noticia),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.msg || 'Error al actualizar la noticia');
    }
    return await res.json();
  } catch (error) {
    console.error('Error al actualizar la noticia:', error);
    throw error;
  }
};