export interface Maestro {
    id: number;
    rfc: string;
    nombre: string;
    apellido: string;
    estado: number;
}

export interface Material {
    id: number;
    codigo: string;
    nombre: string;
    cantidad: number;
    id_marca: number;
    id_categoria: number;
    id_ubicacion: number;


    marca?: { id: number; nombre: string };
    categoria?: { id: number; nombre: string };
    ubicacion?: { id: number; nombre: string };

}

export interface Encargado {
    id: number;
    email: string;
    nombre: string;
    apellido: string;
    password?: string;
    is_admin: boolean;
}           

export interface Estudiante {
    id: number;
    numero_control: string;
    nombre: string;
    apellido: string;
    carrera: string;
    semestre: string;

}


export interface Marca {
    id: number;
    nombre: string;
}

export interface Categoria {
    id: number;
    nombre: string;
}


export interface Ubicacion {
    id: number;
    nombre: string;
}





export interface Prestamo {
    id: number;
    fecha_prestamo: string;
    fecha_devolucion: string;
    id_estudiante: number;
    id_maestro: number;
    id_encargado?: number;

    
    materiales: string[]; 

    
    rfc: string;
    numero_control: string;

    
    estudiante?: Estudiante;
    maestro?: Maestro;
    encargado?: Encargado;
    

    materiales_detalle?: Array<{
        material: any;
        id: number;
        codigo: string;
        nombre: string;
    }>;
}
