import { useState } from "react";


const Sidebar = () => {
    const [open, setOpen] = useState(true);

    const Menus = [
    { title: "Inicio", src: "home" },
    { title: "Materiales", src: "osc" },
    { title: "Prestamos ", src: "prestamo" },
    { title: "Estudiantes", src: "estudiante", gap: true },
    { title: "Reportes", src: "report" },
    { title: "Cerrar sesión", src: "logout" },
    ];

    return (
    <div className="flex" >
        <div  className={` ${open ? "w-72" : "w-20 "} bg-white  dark:bg-gray-900 h-screen p-5  pt-8 relative duration-300`}
        >
        <img
            src="./src/assets/menu.png"
            className={`absolute cursor-pointer -right-3 top-9 w-7 border-dark-purple
            border-2 rounded-full  ${!open && "rotate-180"}`}
            onClick={() => setOpen(!open)}
        />
        <div className="flex gap-x-4 items-center">
            <img
                src="./src/assets/logo.png"
                className={`cursor-pointer duration-500 ${
                open && "rotate-[360deg]"
                }`}
            />
        </div>
        <ul className="pt-6">
            {Menus.map((Menu, index) => (
            <li
                key={index}
                className={`flex  rounded-md p-2 cursor-pointer hover:bg-blue-300 text-black dark:text-white text-sm items-center gap-x-4  
                ${Menu.gap ? "mt-9" : "mt-2"}                         
                ${index === 0 && "bg-light-white"  
                } `}
            >
                <img src={`./src/assets/${Menu.src}.png`} />
                <span className={`${!open && "hidden"} origin-left duration-200`}>
                {Menu.title}
                </span>
            </li>
            ))}
        </ul>
        </div>
        </div>
    
);
}
export default Sidebar;


// quitar esppaciado entre materiales y estudiantes sustituir linea 45 ${index !== 1 && "mt-2"}