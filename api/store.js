const API_URL = 'https://ciclysan.onrender.com/api/tienda';

export const getTiendasVisibles = async () => {
    try {
        const res = await fetch(`${API_URL}`);
        if (!res.ok) {
            throw new Error('Error al obtener tiendas visibles');
        }
        return await res.json();
    } catch (error) {
        console.error('Error cargando tiendas visibles', error);
        return [];
    }
};

export const getTiendasVisiblesAdmin = async () => {
    try {
        const res = await fetch(`${API_URL}/admin`);
        if (!res.ok) {
            throw new Error('Error al obtener tiendas visibles');
        }
        return await res.json();
    } catch (error) {
        console.error('Error cargando tiendas visibles', error);
        return [];
    }
};

export const postTiendas = async (tiendaData) => { // 🆕 Se agregó el parámetro
    try {
        const res = await fetch(`${API_URL}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tiendaData) // 🆕 Se usa el parámetro `tiendaData`
        });

        if (!res.ok) throw new Error('Error al guardar la tienda');
        return await res.json();

    } catch (error) {
        console.error('Error guardando tiendas', error);
        return [];
    }
};

export const toggleTiendaVisibilidad = async (id, estado) => {
    try {
        const res = await fetch(`${API_URL}/visibilidad/${id}`, {
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

export const deleteTienda = async (id) => {
    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });
        if (!res.ok) {
            throw new Error('Error al eliminar la Tienda');
        }
    } catch (error) {
        console.error('Error al eliminar la tienda:', error);
        throw error;
    }
};

export const putTiendas = async (id, data) => {
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
            throw new Error(errorData.msg || 'Error al actualizar la tienda');
        }
        return await res.json();
    } catch (error) {
        console.error('Error al actualizar la tienda:', error);
        throw error;
    }
};