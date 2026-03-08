// src/app/componentes/planta-detalle/planta-detalle.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AmenazasService } from '../../servicios/amenazas.service';
import { Amenaza } from '../../modelos/amenaza';

@Component({
  selector: 'app-amenaza-detalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './amenaza-detalle.component.html'
})
export class AmenazaDetalleComponent implements OnInit {

  amenaza?: Amenaza | null;  //Permitir null explícitamente
  cargando: boolean = false;  //Estado de carga para UX
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private amenazasService: AmenazasService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(async params => {
      const id = params.get('id');
      
      //Validación 1: El ID existe en la URL
      if (!id) {
        this.error = 'ID de amenaza no válido';
        this.amenaza = null;
        return;
      }

      this.cargando = true;
      this.error = null;

      try {
        //Validación 2: Esperar la Promesa antes de asignar
        this.amenaza = await this.amenazasService.getAmenazaById(id);
        
        // Si no se encontró la amenaza en Firebase
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