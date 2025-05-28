import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";
import "tailwindcss";
import { toast } from "react-toastify";
import ModoOscuro from "./ModoOscuro";

const Sidebar = () => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    const [userName, setUserName] = useState("");

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser && storedUser !== "undefined") {
            try {
                const parsedUser = JSON.parse(storedUser);
                setIsAdmin(parsedUser.is_admin === true || parsedUser.is_admin === 1 || parsedUser.is_admin === "1");
                setUserName(parsedUser.name || parsedUser.email || "Usuario");
            } catch (error) {
                console.error("Error al parsear el usuario:", error);
            }
        } else {
            console.warn("No se encontró información válida del usuario en localStorage.");
        }
    }, []);

    const Menus = [
        { title: "Inicio", src: "home", path: "/inicio" },
        { title: "Materiales", src: "osc", path: "/materiales" },
        { title: "Prestamos", src: "prestamo", path: "/prestamos" },
        { title: "Estudiantes", src: "estudiante", path: "/estudiantes", gap: true },
        { title: "Maestros", src: "maestro", path: "/maestros" },
        ...(isAdmin
        ? [{ title: "Encargados", src: "user", path: "/encargados" }]
        : [{ title: "Mi perfil", src: "user", path: "/perfil" }]
        ),
        { title: "Materia", src: "materia", path: "/materias" },
        { title: "Marca", src: "marca", path: "/marcas", gap: true },
        { title: "categoria", src: "categoria", path: "/categorias" },
        { title: "ubicacion", src: "ubicacion", path: "/ubicacion" },
        { title: "Cerrar sesión", src: "logout", path: "/", logout: true }
    ];
    const handleLogout = () => {
        logout(navigate);
        toast.success("Sesión cerrada con éxito");
    };
    return (
        <div className="flex">
            <div className={`${open ? "w-72" : "w-20"} bg-white dark:bg-gray-900 h-screen p-5 pt-8 relative duration-300`}>
                <img
                    src="./src/assets/menu.png"
                    className={`absolute cursor-pointer -right-3 top-9 w-7 border-dark-purple 
                    border-2 rounded-full ${!open && "rotate-180"}`}
                    onClick={() => setOpen(!open)}
                />
                <div className="flex gap-x-4 items-center">
                    <img
                        src="./src/assets/logo.png"
                        className={`cursor-pointer duration-500 ${open && "rotate-[360deg]"}`}
                        onClick={() => setOpen(!open)}
                    />
                </div>
                {open && (
                    <div className="mt-4 text-sm text-gray-700 dark:text-white">
                        Bienvenido, <span className="font-semibold">{userName}</span>
                    </div>
                )}
                <ul className="pt-6">
                    {Menus.map((Menu, index) => (
                        <li key={index} className={`${Menu.gap ? "mt-9" : "mt-2"}`}>
                            {Menu.logout ? (
                                <button
                                    onClick={handleLogout}
                                    className="flex w-full rounded-md p-2 text-sm items-center gap-x-4 cursor-pointer duration-200 text-black dark:text-white hover:bg-blue-300"
                                >
                                    <img src={`./src/assets/${Menu.src}.png`} alt={Menu.title} />
                                    <span className={`${!open && "hidden"} origin-left duration-200`}>
                                        {Menu.title}
                                    </span>
                                </button>
                            ) : (
                                <NavLink
                                    to={Menu.path}
                                    className={({ isActive }) =>
                                        `flex rounded-md p-2 text-sm items-center gap-x-4 cursor-pointer duration-200
                                        ${isActive ? "bg-blue-500 text-white" : "text-black dark:text-white hover:bg-blue-300"}`
                                    }
                                >
                                    <img src={`./src/assets/${Menu.src}.png`} alt={Menu.title} />
                                    <span className={`${!open && "hidden"} origin-left duration-200`}>
                                        {Menu.title}
                                    </span>
                                </NavLink>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
            <ModoOscuro />
        </div>
    );
};

export default Sidebar;



// quitar esppaciado entre materiales y estudiantes sustituir linea 45 ${index !== 1 && "mt-2"}