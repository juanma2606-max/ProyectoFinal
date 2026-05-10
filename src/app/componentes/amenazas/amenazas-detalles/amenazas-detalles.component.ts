import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Amenaza } from '../../../modelos/amenaza.model';
import { AmenazasService } from '../../../servicios/amenazas.service';
import { ImagenAmenazaComponent } from '../../imagen-amenaza/imagen-amenaza.component';  // IMPORTAR

@Component({
  selector: 'app-amenaza-detalle',
  standalone: true,
  imports: [CommonModule, ImagenAmenazaComponent],  // AGREGAR
  templateUrl: './amenazas-detalles.component.html'
})
export class AmenazaDetalleComponent implements OnInit {

  amenaza?: Amenaza | null;
  cargando: boolean = false;
  error: string | null = null;

  Array = Array;

  constructor(
    private route: ActivatedRoute,
    private amenazasService: AmenazasService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(async params => {
      const id = params.get('id');
      
      if (!id) {
        this.error = 'ID de amenaza no válido';
        this.amenaza = null;
        return;
      }

      this.cargando = true;
      this.error = null;

      try {
        this.amenaza = await this.amenazasService.getAmenazaById(id);
        
        if (!this.amenaza) {
          this.error = 'Amenaza no encontrada';
        }
      } catch (err) {
        console.error('Error cargando amenaza:', err);
        this.error = 'Error al cargar los datos';
      } finally {
        this.cargando = false;
      }
    });
  }
}