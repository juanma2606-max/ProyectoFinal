// src/app/componentes/planta-detalle/planta-detalle.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Planta } from '../../../modelos/planta.model';
import { PlantasService } from '../../../servicios/plantas.service';
import { ImagenPlantaComponent } from '../../imagen-planta/imagen-planta.component';

@Component({
  selector: 'app-planta-detalle',
  standalone: true,
  imports: [CommonModule, ImagenPlantaComponent],
  templateUrl: './planta-detalles.component.html'
})
export class PlantaDetalleComponent implements OnInit {

  planta?: Planta | null;  //Permitir null explícitamente
  cargando: boolean = false;  //Estado de carga para UX
  error: string | null = null;
  todasLasPlantas: Planta[] = [];

  constructor(
    private route: ActivatedRoute,
    private plantasService: PlantasService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(async params => {
      const id = params.get('id');
      
      //Validación 1: El ID existe en la URL
      if (!id) {
        this.error = 'ID de planta no válido';
        this.planta = null;
        return;
      }

      this.cargando = true;
      this.error = null;

      try {
        //Validación 2: Esperar la Promesa antes de asignar
        this.planta = await this.plantasService.getPlantaById(id);
        this.plantasService.getAllPlantasFirebase().subscribe(plantas => {
  this.todasLasPlantas = plantas;
});
        
        // Si no se encontró la planta en Firebase
        if (!this.planta) {
          this.error = 'Planta no encontrada';
        }
      } catch (err) {
        console.error('Error cargando planta:', err);
        this.error = 'Error al cargar los datos';
      } finally {
        this.cargando = false;
      }
    });
  }
getNombrePlanta(id: string): string {
  for (const planta of this.todasLasPlantas) {
    if (planta.id === id) return planta.nombre;
  }
  return id;
}
}