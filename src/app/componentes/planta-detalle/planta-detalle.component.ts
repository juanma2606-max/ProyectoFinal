import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PlantasService } from '../../servicios/plantas.service';
import { Planta } from '../../modelos/planta';

@Component({
  selector: 'app-planta-detalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './planta-detalle.component.html'
})
export class PlantaDetalleComponent implements OnInit {

  planta?: Planta;

  constructor(
    private route: ActivatedRoute,
    private plantasService: PlantasService
  ) {}

  ngOnInit(): void {
    // Suscribirse a los cambios de parámetros
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      this.planta = this.plantasService.getPorId(id);
    });
  }
}