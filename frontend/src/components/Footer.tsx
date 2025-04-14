
const Footer = () => {
return (


<footer className="rounded-lg shadow-sm m-0 w-full fixed bottom-0 dark:bg-gray-900">
    <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
        <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">TecNM <a href="https://pabellon.tecnm.mx/" className="hover:underline">Campus Pabellón de Arteaga</a>.
        </span>
        <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
            <li>
                <a href="https://pabellon.tecnm.mx/presentacion.php" className="hover:underline me-4 md:me-6">Conocenos</a>
            </li>
            <li>
                <a href="https://cursos-itpa.net" className="hover:underline me-4 md:me-6">Moodle</a>
            </li>
            <li>
                <a href="http://sii.pabellon.tecnm.mx" className="hover:underline me-4 md:me-6">SII</a>
            </li>
            <li>
                <a href="https://www.facebook.com/share/12DvXmG3bBU/" className="hover:underline">Facebook</a>
            </li>
        </ul>
    </div>
</footer>
);    
}

export default Footer;