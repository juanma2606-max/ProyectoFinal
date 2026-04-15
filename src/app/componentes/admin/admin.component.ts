import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../modelos/user.model';
import { Planta } from '../../modelos/planta.model';
import { Amenaza } from '../../modelos/amenaza.model';
import { UserService } from '../../servicios/user.service';
import { PlantasService } from '../../servicios/plantas.service';
import { AmenazasService } from '../../servicios/amenazas.service';

type Tab = 'usuarios' | 'plantas' | 'amenazas';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {

  tabActiva: Tab = 'usuarios';

  // UGH! Datos
  usuarios: User[] = [];
  plantas: Planta[] = [];
  amenazas: Amenaza[] = [];

  // UGH! Búsqueda
  busquedaUsuario: string = '';
  busquedaPlanta: string = '';
  busquedaAmenaza: string = '';

  constructor(
    private userService: UserService,
    private plantasService: PlantasService,
    private amenazasService: AmenazasService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // UGH! Cargar usuarios
    this.userService.getAllPersons().subscribe(usuarios => {
      this.usuarios = usuarios;
    });

    // UGH! Cargar plantas
    this.plantasService.getAllPlantasFirebase().subscribe(plantas => {
      this.plantas = plantas;
    });

    // UGH! Cargar amenazas
    this.amenazasService.getAllAmenazasFirebase().subscribe(amenazas => {
      this.amenazas = amenazas;
    });
  }

  cambiarTab(tab: Tab): void {
    this.tabActiva = tab;
  }

  // UGH! Filtros de búsqueda
  get usuariosFiltrados(): User[] {
    const q = this.busquedaUsuario.toLowerCase();
    return this.usuarios
      .filter(u => u.email !== 'admin@huerting.com') // Excluir admin
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

  // UGH! Navegación usuarios
  verUsuario(uid: string): void {
    this.router.navigate(['/app/admin/usuario', uid]);
  }

  eliminarUsuario(uid: string): void {
    if (confirm('¿Banear este usuario? No podrá volver a iniciar sesión.')) {
      this.userService.removePerson(uid)
        .then(() => console.log('✅ Usuario baneado'))
        .catch(err => console.error('❌ Error:', err));
    }
  }

  // UGH! Navegación plantas
  nuevaPlanta(): void {
    this.router.navigate(['/app/plantasform'], { queryParams: { from: 'admin' } });
  }

  editarPlanta(id: string | undefined): void {
    if (!id) return;
    this.router.navigate(['/app/plantasform', id], { queryParams: { from: 'admin' } });
  }

  eliminarPlanta(id: string | undefined): void {
    if (!id) return;
    if (confirm('¿Eliminar esta planta?')) {
      this.plantasService.removePlanta(id)
        .then(() => console.log('✅ Planta eliminada'))
        .catch(err => console.error('❌ Error:', err));
    }
  }

  // UGH! Navegación amenazas
  nuevaAmenaza(): void {
    this.router.navigate(['/app/amenazasform'], { queryParams: { from: 'admin' } });
  }

  editarAmenaza(id: string | undefined): void {
    if (!id) return;
    this.router.navigate(['/app/amenazasform', id], { queryParams: { from: 'admin' } });
  }

  eliminarAmenaza(id: string | undefined): void {
    if (!id) return;
    if (confirm('¿Eliminar esta amenaza?')) {
      this.amenazasService.removeAmenaza(id)
        .then(() => console.log('✅ Amenaza eliminada'))
        .catch(err => console.error('❌ Error:', err));
    }
  }
}