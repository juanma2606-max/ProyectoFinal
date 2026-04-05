import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Person } from '../../modelos/person.model';
import { Planta } from '../../modelos/planta.model';
import { Amenaza } from '../../modelos/amenaza.model';
import { PersonService } from '../../servicios/person.service';
import { PlantasService } from '../../servicios/plantas.service';
import { AmenazasService } from '../../servicios/amenazas.service';

type Tab = 'usuarios' | 'plantas' | 'amenazas';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss'
})
export class AdminPanelComponent implements OnInit {

  tabActiva: Tab = 'usuarios';

  // Datos
  usuarios: Person[] = [];
  plantas: Planta[] = [];
  amenazas: Amenaza[] = [];

  // Búsqueda
  busquedaUsuario: string = '';
  busquedaPlanta: string = '';
  busquedaAmenaza: string = '';

  constructor(
    private personService: PersonService,
    private plantasService: PlantasService,
    private amenazasService: AmenazasService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Usuarios
    this.personService.getAllPersons().subscribe(usuarios => {
      this.usuarios = usuarios;
    });

    // Plantas
    this.plantasService.getAllPlantasFirebase().subscribe(plantas => {
      this.plantas = plantas;
    });

    // Amenazas
    this.amenazasService.getAllAmenazasFirebase().subscribe(amenazas => {
      this.amenazas = amenazas;
    });
  }

  cambiarTab(tab: Tab): void {
    this.tabActiva = tab;
  }

  // Filtros de búsqueda
get usuariosFiltrados(): Person[] {
  const q = this.busquedaUsuario.toLowerCase();
  return this.usuarios
    .filter(u => u.email !== 'admin@huerting.com')
    .filter(u =>
      u.username?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q)
    );
}

  get plantasFiltradas(): Planta[] {
    const q = this.busquedaPlanta.toLowerCase();
    return this.plantas.filter(p => p.nombre?.toLowerCase().includes(q));
  }

  get amenazasFiltradas(): Amenaza[] {
    const q = this.busquedaAmenaza.toLowerCase();
    return this.amenazas.filter(a => a.nombre?.toLowerCase().includes(q));
  }

  // Navegación
  verUsuario(uid: string): void {
    this.router.navigate(['/app/admin/usuario', uid]);
  }

  nuevaPlanta(): void {
  this.router.navigate(['/app/plantasform'], { queryParams: { from: 'admin' } });
}

editarPlanta(id: string): void {
  this.router.navigate(['/app/plantasform', id], { queryParams: { from: 'admin' } });
}

  eliminarPlanta(id: string): void {
    this.plantasService.removePlanta(id);
  }

editarAmenaza(id: string): void {
  this.router.navigate(['/app/amenazaform', id], { queryParams: { from: 'admin' } });
}

  eliminarAmenaza(id: string): void {
    this.amenazasService.removeAmenaza(id);
  }

  nuevaAmenaza(): void {
  this.router.navigate(['/app/amenazaform'], { queryParams: { from: 'admin' } });
}
  eliminarUsuario(uid: string): void {
  this.personService.removePerson(uid);
}
}
