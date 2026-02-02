import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PlagasService } from '../../servicios/plagas.service';
import { Plaga } from '../../modelos/plagas';

@Component({
  selector: 'app-plaga-detalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './plaga-detalle.component.html'
})
export class PlagaDetalleComponent implements OnInit {

  plaga?: Plaga;

  constructor(
    private route: ActivatedRoute,
    private plagasService: PlagasService
  ) {}

  ngOnInit(): void {
    // Suscribirse a los cambios de parámetros
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      this.plaga = this.plagasService.getPorId(id);
    });
  }
}