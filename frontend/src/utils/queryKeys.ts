export const queryKeys = {
    materiales: "materials",
    estudiantes: "estudiantes",
    maestros: "maestros",
    categorias: "categorias",
    marcas: "marcas",
    ubicaciones: "ubicaciones",
    laboratorios: "laboratorios",
    prestamos: "prestamos",
};

export const queryKeysP = {
    prestamos: { all: ["prestamos"] as const },
    materiales: { all: ["materiales"] as const },
    maestros: { all: ["maestros"] as const },
    materias: { all: ["materias"] as const },
    laboratorios: { all: ["laboratorios"] as const },
};
