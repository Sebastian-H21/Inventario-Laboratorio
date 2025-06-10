export interface Maestro {
    deleted_at: null;
    id: number;
    rfc: string;
    nombre: string;
    apellido: string;
    estado: number;
}

export interface Material {
    deleted_at: null;
    id: number;
    codigo: string;
    nombre: string;
    cantidad: number;
    observaciones:string;
    modelo:string;
    id_marca: number;
    id_categoria: number;
    id_ubicacion: number;
    id_laboratorio: number;


    marca?: { id: number; nombre: string };
    categoria?: { id: number; nombre: string };
    ubicacion?: { id: number; nombre: string };
    laboratorio?: { id: number; nombre: string };
}

export interface Encargado {
    deleted_at: null;
    id: number;
    email: string;
    nombre: string;
    apellido: string;
    password?: string;
    is_admin: boolean;
}           

export interface Estudiante {
    deleted_at: null;
    id: number;
    numero_control: string;
    nombre: string;
    apellido: string;
    carrera: string;
    semestre: string;
    modalidad:string;

}


export interface Marca {
    deleted_at: null;
    id: number;
    nombre: string;
}

export interface Categoria {
    some(arg0: (item: any) => boolean): unknown;
    find(arg0: (item: any) => boolean): unknown;
    deleted_at: null;
    id: number;
    nombre: string;
}


export interface Ubicacion {
    deleted_at: null;
    id: number;
    nombre: string;
}

export interface Materia {
    deleted_at: null;
    id: number;
    nombre: string;
}

export interface Laboratorio {
    deleted_at: null;
    id: number;
    nombre: string;
}

export interface Prestamo {
    id: number;
    fecha_prestamo: string;
    fecha_devolucion: string;
    practica:string;
    id_estudiante: number;
    id_maestro: number;
    id_encargado?: number;
    id_materia?: number;
    deleted_at?: string | null;
    id_laboratorio?: number;
    
    
    materiales: string[]; 

    
    rfc: string;
    numero_control: string;
    nombre:string;

    
    estudiante?: Estudiante;
    maestro?: Maestro;
    encargado?: Encargado;
    materia?: Materia;
    laboratorio?:Laboratorio;
    

    materiales_detalle?: Array<{
        material: any;
        id: number;
        codigo: string;
        nombre: string;
    }>;
}
