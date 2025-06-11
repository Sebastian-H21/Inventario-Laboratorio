export function generarCodigoMaterial(nombre: string, nombreLab: string, numero: number): string {
    const palabrasIgnoradas = ["de", "la", "del", "el", "los", "las", "un", "una"];

    const limpiarYReducir = (texto: string, cantidad: number) => {
        return texto
            .toUpperCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // quitar acentos
            .split(" ")
            .filter(palabra => !palabrasIgnoradas.includes(palabra.toLowerCase()))
            .slice(0, cantidad)
            .map(p => p.slice(0, 3))
            .join("");
    };

    const nombreCorto = limpiarYReducir(nombre, 2);
    const labCorto = limpiarYReducir(nombreLab, 1);

    const secuencia = String(numero).padStart(3, "0");

    return `${nombreCorto}-${labCorto}-${secuencia}`;
}
