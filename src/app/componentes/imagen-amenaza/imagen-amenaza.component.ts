import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Amenaza } from '../../modelos/amenaza.model';
import { IconosService } from '../../servicios/iconos.service';

@Component({
  selector: 'app-imagen-amenaza',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="imagen-wrapper" [style.width.px]="size" [style.height.px]="size">
      
      <img 
        *ngIf="!usarIcono && amenaza?.imagen"
        [src]="amenaza.imagen"
        [alt]="amenaza.nombre"
        (error)="onImageError()"
        class="imagen-real"
        [class.rounded-circle]="circular"
        [class.rounded]="!circular"
      />
      
      <div 
        *ngIf="usarIcono"
        class="icono-fallback d-flex align-items-center justify-content-center"
        [style.background-color]="iconosService.getColorAmenaza(amenaza.tipo)"
        [style.width.px]="size"
        [style.height.px]="size"
        [class.rounded-circle]="circular"
        [class.rounded]="!circular">
        <i [class]="iconosService.getIconoAmenaza(amenaza.tipo)" 
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
export class ImagenAmenazaComponent implements OnInit {
  
  @Input() amenaza!: Amenaza;
  @Input() size: number = 100;
  @Input() circular: boolean = false;
  
  usarIcono: boolean = false;

  constructor(public iconosService: IconosService) {}

  ngOnInit(): void {
    if (!this.amenaza?.imagen || this.amenaza.imagen.trim() === '') {
      this.usarIcono = true;
    }
  }

  onImageError(): void {
    console.warn(`Imagen no cargó para ${this.amenaza.nombre}, usando icono fallback`);
    this.usarIcono = true;
  }
}