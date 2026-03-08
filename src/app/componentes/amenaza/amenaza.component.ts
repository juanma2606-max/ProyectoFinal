import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AmenazasService } from '../../servicios/amenazas.service';
import { Amenaza } from '../../modelos/amenaza';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-amenazas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './amenaza.component.html'
})
export class AmenazasComponent implements OnInit, OnDestroy {

  tipoActivo: 'plaga' | 'enfermedad' = 'plaga';
  amenazas: Amenaza[] = [];
  private subscription?: Subscription;

  constructor(private service: AmenazasService) {}

  ngOnInit(): void {
    // Suscribirse al Observable de Firebase
    this.subscription = this.service.getAllAmenazasFirebase().subscribe(data => {
      this.amenazas = data;
    });
  }

  ngOnDestroy(): void {
    // Importante: limpiar suscripción para evitar memory leaks
    this.subscription?.unsubscribe();
  }

  get amenazasFiltradas(): Amenaza[] {
    return this.amenazas.filter(a => a.tipo === this.tipoActivo);
  }

  cambiarTipo(tipo: 'plaga' | 'enfermedad'): void {
    this.tipoActivo = tipo;
  }
}