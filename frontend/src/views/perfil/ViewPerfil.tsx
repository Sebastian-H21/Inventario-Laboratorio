import Perfil from "../../components/Perfil";
import Sidebar from "../../components/Sidebar";

const ViewPerfil: React.FC = () => {
    return (
        <div className="flex bg-white dark:bg-gray-800 min-h-screen">
            <Sidebar />
            <div className="flex-1 p-8">
                <h1 className="text-3xl font-bold text-black dark:text-white mb-6 text-center">Mi Perfil</h1>

                <div className="flex justify-center">
                    <Perfil />
                </div>
            </div>
        </div>
    );
};

export default ViewPerfil;
