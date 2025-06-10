export function validarRFCConFecha(rfc: string): boolean {
    const rfcRegex = /^[A-Z]{4}(\d{2})(\d{2})(\d{2})([A-Z0-9]{3})$/;
    const match = rfc.toUpperCase().match(rfcRegex);
    if (!match) return false;

    const [, year, month, day] = match.map(Number);

    if (month < 1 || month > 12 || day < 1 || day > 31) return false;

    const fullYear = year <= 30 ? 2000 + year : 1900 + year;
    const fechaNacimiento = new Date(fullYear, month - 1, day);

    if (
        fechaNacimiento.getFullYear() !== fullYear ||
        fechaNacimiento.getMonth() !== month - 1 ||
        fechaNacimiento.getDate() !== day
    ) {
        return false;
    }

    const hoy = new Date();
    const edadEnMilisegundos = hoy.getTime() - fechaNacimiento.getTime();
    const edadEnAnios = edadEnMilisegundos / (1000 * 60 * 60 * 24 * 365.25);

    if (fechaNacimiento > hoy || edadEnAnios < 18) {
        return false;
    }

    return true;
}