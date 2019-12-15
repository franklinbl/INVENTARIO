import { Pipe, PipeTransform } from '@angular/core';
import { Producto } from '../interfaces/interfaces';

@Pipe({
  name: 'filtroProducto'
})
export class FiltroProductoPipe implements PipeTransform {

  transform(productos: Producto[], texto: string): Producto[] {

    if (texto.length === 0) {
      return productos;
    }

    texto = texto.toLocaleLowerCase();
    console.log('TEXT', texto);

    return productos.filter(p => {
      return p.nombre.toLocaleLowerCase().includes(texto)
        || p.marca.toLocaleLowerCase().includes(texto)
        || p.codigo.toLocaleLowerCase().includes(texto)
    });
  }

}
