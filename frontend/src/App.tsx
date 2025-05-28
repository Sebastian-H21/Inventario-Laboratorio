import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import ViewMaestros from "./views/maestros/ViewMaestros";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ViewEstudiantes from "./views/estudiantes/ViewEstudiante";
import ViewEncargado from "./views/encargados/ViewEncargado";
import Error from "./components/Error";
import { AnimatePresence, motion } from "framer-motion";
import ViewHome from "./views/inicio/ViewHome";
import ViewMateriales from "./views/materiales/ViewMateriales";
import ViewPrestamo from "./views/prestamos/ViewPrestamo";
import ViewLogin from "./views/login/ViewLogin";
import { setAuthToken } from './utils/api';
import RutasProtegidas from "./components/RutasProtegidas";
import ViewPerfil from "./views/perfil/ViewPerfil";
import ViewMarcas from "./views/marcas/ViewMarcas";
import ViewCategorias from "./views/categorias/ViewCategorias";
import ViewUbicacion from "./views/ubicacion/ViewUbicacion";
import ViewMaterias from "./views/materias/viewMaterias";


const token = localStorage.getItem('token');
if (token) {
    setAuthToken(token);
}

const AnimationSettings = {
    transition: { duration: 0.3 },
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 }
};

const AnimatedRoutes = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <motion.div className="route-container" key={location.pathname} {...AnimationSettings}>
                <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<ViewLogin />} />
                    <Route path="/inicio" element={<RutasProtegidas><ViewHome /></RutasProtegidas>} />
                    <Route path="/materiales" element={<RutasProtegidas><ViewMateriales /></RutasProtegidas>} />
                    <Route path="/prestamos" element={<RutasProtegidas><ViewPrestamo /></RutasProtegidas>} />
                    <Route path="/maestros" element={<RutasProtegidas><ViewMaestros /></RutasProtegidas>} />
                    <Route path="/estudiantes" element={<RutasProtegidas><ViewEstudiantes /></RutasProtegidas>} />
                    <Route path="/encargados" element={<RutasProtegidas role="admin"><ViewEncargado /></RutasProtegidas>} />
                    <Route path="/perfil" element={<RutasProtegidas><ViewPerfil /></RutasProtegidas>} />
                    <Route path="/marcas" element={<RutasProtegidas><ViewMarcas /></RutasProtegidas>} />
                    <Route path="/categorias" element={<RutasProtegidas><ViewCategorias /></RutasProtegidas>} />
                    <Route path="/ubicacion" element={<RutasProtegidas><ViewUbicacion /></RutasProtegidas>} />
                    <Route path="/materias" element={<RutasProtegidas><ViewMaterias /></RutasProtegidas>} />
                    <Route path="*" element={<Error />} />
                </Routes>
            </motion.div>
        </AnimatePresence>
    );
};

function App() {
    return (
        <>
            <BrowserRouter>
                <AnimatedRoutes />
            </BrowserRouter>
            <ToastContainer />
        </>
    );
}

export default App;
