import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../../modelos/user.model';
import { Planta } from '../../modelos/planta.model';
import { Amenaza } from '../../modelos/amenaza.model';
import { Huerto } from '../../modelos/huerto.model';
import { UserService } from '../../servicios/user.service';
import { PlantasService } from '../../servicios/plantas.service';
import { AmenazasService } from '../../servicios/amenazas.service';
import { HuertosService } from '../../servicios/huertos.service';
import { AuthService } from '../../servicios/auth.service';

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

  usuarios: User[] = [];
  plantas: Planta[] = [];
  amenazas: Amenaza[] = [];

  busquedaUsuario: string = '';
  busquedaPlanta: string = '';
  busquedaAmenaza: string = '';

  usuarioExpandido: string | null = null;
  huertosUsuario: { [uid: string]: Huerto[] } = {};
  cargandoHuertos: { [uid: string]: boolean } = {};

  isAdmin$: Observable<boolean>;

  constructor(
    private userService: UserService,
    private plantasService: PlantasService,
    private amenazasService: AmenazasService,
    private huertosService: HuertosService,
    private authService: AuthService,
    private router: Router
  ) {
    this.isAdmin$ = this.authService.isAdmin$();
  }

  ngOnInit(): void {
    this.userService.getAllPersons().subscribe(usuarios => {
      this.usuarios = usuarios;
    });

    this.plantasService.getAllPlantasFirebase().subscribe(plantas => {
      this.plantas = plantas;
    });

    this.amenazasService.getAllAmenazasFirebase().subscribe(amenazas => {
      this.amenazas = amenazas;
    });
  }

  cambiarTab(tab: Tab): void {
    this.tabActiva = tab;
  }

  get usuariosFiltrados(): User[] {
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

  toggleUsuario(uid: string): void {
    if (this.usuarioExpandido === uid) {
      this.usuarioExpandido = null;
    } else {
      this.usuarioExpandido = uid;
      this.cargarHuertosUsuario(uid);
    }
  }

  cargarHuertosUsuario(uid: string): void {
    if (!this.huertosUsuario[uid]) {
      this.cargandoHuertos[uid] = true;
      this.huertosService.getHuertosByUid(uid).subscribe({
        next: (huertos) => {
          this.huertosUsuario[uid] = huertos;
          this.cargandoHuertos[uid] = false;
        },
        error: (err) => {
          console.error('Error cargando huertos:', err);
          this.cargandoHuertos[uid] = false;
        }
      });
    }
  }

  verHuerto(uid: string, huertoId: string): void {
    this.router.navigate(['/app/admin/usuario', uid, 'huerto', huertoId]);
  }

  editarHuerto(uid: string, huertoId: string): void {
    this.router.navigate(['/app/admin/usuario', uid, 'huertoform', huertoId]);
  }

  nuevoHuerto(uid: string): void {
    this.router.navigate(['/app/admin/usuario', uid, 'huertoform']);
  }

  eliminarHuerto(uid: string, huertoId: string): void {
    if (confirm('¿Eliminar este huerto y todos sus cultivos?')) {
      this.huertosService.removeObject(huertoId)
        .then(() => {
          console.log('✅ Huerto eliminado');
          this.huertosUsuario[uid] = this.huertosUsuario[uid].filter(h => h.id !== huertoId);
        })
        .catch(err => console.error('❌ Error:', err));
    }
  }

  eliminarUsuario(uid: string): void {
    if (confirm('¿Banear este usuario? No podrá volver a iniciar sesión.')) {
      this.userService.removePerson(uid)
        .then(() => console.log('✅ Usuario baneado'))
        .catch(err => console.error('❌ Error:', err));
    }
  }

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