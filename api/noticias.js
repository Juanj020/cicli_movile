const API_URL = 'https://ciclysan.onrender.com/api/noticias';

export const getNoticiasVisibles = async () => {
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
      throw new Error('Error al crear la noticia');
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