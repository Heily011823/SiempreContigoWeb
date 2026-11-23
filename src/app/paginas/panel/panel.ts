import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BarraSuperior } from '../../componentes/barra-superior/barra-superior';
import { Menu } from '../../componentes/menu/menu';
import { Pie } from '../../componentes/pie/pie';

@Component({
  selector: 'app-panel',
  imports: [RouterOutlet, Menu, BarraSuperior, Pie],
  templateUrl: './panel.html',
  styleUrl: './panel.css',
})
export class Panel {
  protected readonly menuAbierto = signal(false);

  protected alternarMenu(): void {
    this.menuAbierto.update((v) => !v);
  }

  protected cerrarMenu(): void {
    this.menuAbierto.set(false);
  }
}
