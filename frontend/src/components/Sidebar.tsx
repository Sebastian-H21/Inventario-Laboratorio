import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";
import { toast } from "react-toastify";
import ModoOscuro from "./ModoOscuro";

const Sidebar = () => {
    const [fijarSidebar, setFijarSidebar] = useState(() => {
        return localStorage.getItem("sidebarFijada") === "true";
    });

    const [open, setOpen] = useState(fijarSidebar);
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
        }
    }, []);

    const handleLogout = () => {
        logout(navigate);
        toast.success("Sesión cerrada con éxito");
    };

    const toggleFijarSidebar = () => {
        const nuevaFijacion = !fijarSidebar;
        setFijarSidebar(nuevaFijacion);
        localStorage.setItem("sidebarFijada", nuevaFijacion.toString());
        setOpen(nuevaFijacion);
    };

    const Menus = [
        { title: "Inicio", src: "home", path: "/inicio", gap: false},
        { title: "Prestamos", src: "prestamo", path: "/prestamos", gap: false},
        { title: "Materiales", src: "osc", path: "/materiales", gap: false },
        { title: "Estudiantes", src: "estudiante", path: "/estudiantes", gap: false },
        { title: "Maestros", src: "maestro", path: "/maestros", gap: false},
        ...(isAdmin
            ? [{ title: "Encargados", src: "user", path: "/encargados" , gap: false}]
            : [{ title: "Mi perfil", src: "user", path: "/perfil", gap: false }]
        ),
        { title: "Materia", src: "materia", path: "/materias", gap: false },
        { title: "Marca", src: "marca", path: "/marcas", gap: false },
        { title: "Categoría", src: "categoria", path: "/categorias", gap: false },
        { title: "Ubicación", src: "ubicacion", path: "/ubicacion", gap: false },
        { title: "Laboratorio", src: "labo", path: "/laboratorios", gap: false },
        { title: "Cerrar sesión", src: "logout", path: "/", logout: true, gap: false }
    ];

    return (
        <div className="flex">
            <div className={`${open ? "w-72" : "w-20" } bg-white dark:bg-gray-900 h-screen p-5 pt-8 relative duration-300`}>
                {/* Botón de Toggle (ícono menú) */}
                <img
                    src="/Inventario/menu.png"
                    className={`absolute cursor-pointer -right-3 top-9 w-7 border-dark-purple 
                    border-2 rounded-full ${!open && "rotate-180"}`}
                    onClick={() => setOpen(!open)}
                />
                {/* Logo */}
                <div className="flex gap-x-4 items-center">
                    <img
                        src="/Inventario/logo.png"
                        className={`cursor-pointer duration-500`} // rotar logo itpa ${open && "rotate-[360deg]"}
                        onClick={() => setOpen(!open)}
                    />
                </div>
                {/* Nombre del usuario */}
                {open && (
                    <div className="mt-4 text-sm text-gray-700 dark:text-white">
                        Bienvenido, <span className="font-semibold">{userName}</span>
                    </div>
                )}
                {/* Menú */}
                <ul className="pt-6">
                    {Menus.map((Menu, index) => (
                        <li key={index} className={`${Menu.gap ? "mt-9" : "mt-1"}`}>
                            {Menu.logout ? (
                                <button
                                    onClick={handleLogout}
                                    className="flex w-full rounded-md p-2 text-sm items-center gap-x-4 cursor-pointer duration-200 text-black dark:text-white hover:bg-blue-300"
                                >
                                    <img src={`/Inventario/${Menu.src}.png`} alt={Menu.title} />
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
                                    <img src={`/Inventario/${Menu.src}.png`} alt={Menu.title} />
                                    <span className={`${!open && "hidden"} origin-left duration-200`}>
                                        {Menu.title}
                                    </span>
                                </NavLink>
                            )}
                        </li>
                    ))}
                </ul>
                <li className="mt-4 relative group">
                    <button
                        onClick={toggleFijarSidebar}
                        aria-label={fijarSidebar ? "Bloquear Sidebar" : "Desbloquear Sidebar"}
                        className="flex items-center gap-x-4 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm text-black dark:text-white w-full"
                    >
                        <img
                            src={`/Inventario/${fijarSidebar ? "candadoa" : "candadoc"}.png`}
                            alt={fijarSidebar ? "Desbloquear Sidebar" : "Bloquear Sidebar"}
                            className="w-5 h-5"
                        />
                        <span className={`${!open && "hidden"} origin-left duration-300`}>
                            {fijarSidebar ? "Bloquear Sidebar" : "Desbloquear Sidebar"}
                        </span>
                    </button>

                    {/* Tooltip para vista colapsada */}
                    {!open && (
                        <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 whitespace-nowrap bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            {fijarSidebar ? "Bloquear Sidebar" : "Desbloquear Sidebar"}
                        </div>
                    )}
                </li>
            </div>
            <ModoOscuro />
        </div>
    );
};

export default Sidebar;
