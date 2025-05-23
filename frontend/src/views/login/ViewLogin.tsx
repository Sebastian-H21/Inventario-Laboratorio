import Login from "../../components/Login";
import Footer from "../../components/Footer";
import ModoOscuro from "../../components/ModoOscuro";

const ViewLogin = () => {
    return (
        <div className="relative min-h-screen overflow-hidden bg-white dark:bg-gray-900">
        <ModoOscuro />
        <div className="flex flex-col items-center justify-center min-h-screen">
            <Login />
            <Footer />
        </div>
        </div>
    );
};

export default ViewLogin;
