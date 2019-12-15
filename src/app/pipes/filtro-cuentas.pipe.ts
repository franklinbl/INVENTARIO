import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroCuentas'
})
export class FiltroCuentasPipe implements PipeTransform {

  transform(cuentas: any[], texto: string): any[] {

    if (texto.length === 0) {
      return cuentas;
    }

    texto = texto.toLocaleLowerCase();

    return cuentas.filter(c => {
      return c.nombre.toLocaleLowerCase().includes(texto)
    });
  }

}
