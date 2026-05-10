import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Planta } from '../../modelos/planta.model';
import { IconosService } from '../../servicios/iconos.service';

@Component({
  selector: 'app-imagen-planta',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="imagen-wrapper" [style.width.px]="size" [style.height.px]="size">
      
      <img 
        *ngIf="!usarIcono && planta?.imagen"
        [src]="planta.imagen"
        [alt]="planta.nombre"
        (error)="onImageError()"
        class="imagen-real"
        [class.rounded-circle]="circular"
        [class.rounded]="!circular"
      />
      
      <div 
        *ngIf="usarIcono"
        class="icono-fallback d-flex align-items-center justify-content-center"
        [style.background-color]="iconosService.getColorPlanta(planta.tipo)"
        [style.width.px]="size"
        [style.height.px]="size"
        [class.rounded-circle]="circular"
        [class.rounded]="!circular">
        <i [class]="iconosService.getIconoPlanta(planta.tipo)" 
           class="text-white"
           [style.font-size.px]="size * 0.5"></i>
      </div>
      
    </div>
  `,
  styles: [`
    .imagen-wrapper {
      position: relative;
      overflow: hidden;
      display: inline-block;
    }
    
    .imagen-real {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .icono-fallback {
      width: 100%;
      height: 100%;
    }
  `]
})
export class ImagenPlantaComponent implements OnInit, OnChanges {
  
  @Input() planta!: Planta;
  @Input() size: number = 100;
  @Input() circular: boolean = false;
  
  usarIcono: boolean = false;

  constructor(public iconosService: IconosService) {}

  ngOnInit(): void {
    this.verificarImagen();
  }

  // AGREGAR ngOnChanges para detectar cambios en @Input
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['planta']) {
      this.verificarImagen();
    }
  }

  private verificarImagen(): void {
    if (!this.planta?.imagen || this.planta.imagen.trim() === '') {
      this.usarIcono = true;
    } else {
      // RESETEAR a false cuando hay imagen nueva
      this.usarIcono = false;
    }
  }

  onImageError(): void {
    console.warn(`Imagen no cargó para ${this.planta.nombre}, usando icono fallback`);
    this.usarIcono = true;
  }
}