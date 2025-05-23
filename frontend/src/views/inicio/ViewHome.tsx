import Home from "../../components/Home";
import Sidebar from "../../components/Sidebar";

const ViewHome = () => {
    return (
        <div className="flex bg-white dark:bg-gray-800 min-h-screen">
            <Sidebar />
            <div className="flex-1 p-4">
                <Home />
                <br />
                <br />
                <div className="text-center mt-4 text-black dark:text-white">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text">Sistema de Inventario Laboratorio Eléctrica y Electrónica</h1>
                </div>
            </div>
        </div>
    );
};

export default ViewHome;
