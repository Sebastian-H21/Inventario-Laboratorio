import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import ModalForm from "../components/Ventana"; 
import api from "../utils/api"; 
import { toast } from "react-toastify";

const getInitials = (name: string | undefined) => {
  if (!name) return "US"; 
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};
const Perfil: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string; email: string }>({
    name: "Usuario",
    email: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser({
          name: parsedUser.name || "Usuario",
          email: parsedUser.email || "",
        });
      } catch (error) {
        console.error("Error al parsear el usuario:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
    toast.success("Sesión cerrada con éxito");
  };

const handleSubmit = async (updatedData: Record<string, any>) => {
  try {
    const payload: Record<string, any> = {
      name: updatedData.name,
      email: updatedData.email,
    };
  if (updatedData.password) {
    payload.password = updatedData.password;
  }

    
    await api.put("/perfil", payload); 


    const updatedUser = {
      name: user.name,
      email: updatedData.email,
    };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    toast.success("Perfil actualizado con éxito");
  } catch (error) {
    toast.error("Error al actualizar perfil");
  }
};

  return (
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <div className="flex flex-col items-center pb-10 pt-6">
        <div className="w-24 h-24 mb-3 flex items-center justify-center rounded-full bg-blue-600 text-white text-3xl font-bold shadow-lg">
          {getInitials(user.name)}
        </div>
        <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{user.name}</h5>
        <span className="text-sm text-gray-500 dark:text-gray-400">Encargado del sistema</span>
        <div className="flex mt-4 md:mt-6">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 cursor-pointer"
          >
            Editar perfil
          </button>
          <button
            onClick={handleLogout}
            className="py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 cursor-pointer"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      <ModalForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={{ email: user.email }}
        fields={[
          {name: "email",label: "Correo electrónico",type: "email",placeholder: "ejemplo@correo.com",minLength: 5,maxLength: 100,required: true},
          {name: "password", label: "Contraseña", type: "password", placeholder: "Ingrese la nueva contraseña o deja el campo vacio",minLength: 8,maxLength: 12,required: false,pattern:"^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$",
            title: "Debe contener minimo 8 caracteres, al menos una minúscula, mayúscula y un número"
          },
        ]}
      />
    </div>
  );
};

export default Perfil;
