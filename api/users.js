const API_URL = 'https://ciclysan.onrender.com/api/usuarios';

export const newUser = async (usuario) => {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(usuario)
    });

    const data = await res.json();

    // Agrega esto para que sepas si hubo error
    if (!res.ok) {
      console.log('⚠️ Error del backend:', data);
      return { success: false, msg: data.msg || 'Error desconocido' };
    }

    return data;

  } catch (error) {
    console.error('❌ Error de conexión:', error);
    return { success: false, msg: 'Error de conexión con el servidor' };
  }
};
