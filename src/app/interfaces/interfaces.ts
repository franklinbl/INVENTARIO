export interface Producto {

    id: number;
    codigo: string;
    nombre: string;
    marca: string;
    precioCompra: number;
    precioVenta: number;
    stock: number;
    descripcion: string;

}

export interface CuentaCobrar {

    id: number;
    nombre: string;
    monto: number;
    fechaInicio: Date;
    fechaFin: Date;
    descripcion: string;

}

export interface CuentaPagar {
    id: number;
    nombre: string;
    monto: number;
    fechaFin: Date;
    descripcion: string;
}

export interface Abonos {

    id: number;
    monto: number;
    fecha: Date;
    descripcion: string;
    idCuenta: number;

}

export interface Ventas {

    id: number;
    cantidad: number;
    montoVenta: number;
    fecha: Date;
    idProducto: number;

}
