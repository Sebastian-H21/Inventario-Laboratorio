import { JSX, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setAuthToken } from '../utils/api';

const RutasProtegidas = ({ children, role }: { children: JSX.Element, role?: "admin" | "encargado" }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;

        if (!token || !user) {
            navigate("/");
            return;
        }

        setAuthToken(token);

        // Validar acceso por rol
        if (role) {
            const isAdmin = user.is_admin === true;

            if ((role === "admin" && !isAdmin) || (role === "encargado" && isAdmin)) {
                localStorage.clear();
                navigate("/");
                return;
            }
        }

        setLoading(false);
    }, [navigate, role]);

    if (loading) return <div>Cargando...</div>;

    return children;
};

export default RutasProtegidas;
