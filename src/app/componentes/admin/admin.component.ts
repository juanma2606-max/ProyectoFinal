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
import { ImagenAmenazaComponent } from '../imagen-amenaza/imagen-amenaza.component';
import { ImagenPlantaComponent } from '../imagen-planta/imagen-planta.component';

type Tab = 'usuarios' | 'plantas' | 'amenazas';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, ImagenAmenazaComponent, ImagenPlantaComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {

  tabActiva: Tab = (localStorage.getItem('adminTab') as Tab) ?? 'usuarios';

  usuarios: User[] = [];
  plantas: Planta[] = [];
  amenazas: Amenaza[] = [];

  busquedaUsuario: string = '';
  busquedaPlanta: string = '';
  busquedaAmenaza: string = '';

  usuarioExpandido: string | null = null;
  huertosUsuario: { [uid: string]: Huerto[] } = {};
  cargandoHuertos: { [uid: string]: boolean } = {};

  procesandoBaneo: { [uid: string]: boolean } = {};

  modalBaneo = {
    mostrar: false,
    usuario: null as User | null,
    motivo: 'Violación de términos de uso'
  };

  modalDesbaneo = {
    mostrar: false,
    usuario: null as User | null
  };

  modalEliminar = {
    mostrar: false,
    usuario: null as User | null,
    confirmacion: ''
  };

  modalEliminarPlanta = {
    mostrar: false,
    planta: null as Planta | null
  };

  modalEliminarAmenaza = {
    mostrar: false,
    amenaza: null as Amenaza | null
  };

  isAdmin$: Observable<boolean>;

  constructor(
    public userService: UserService,
    private plantasService: PlantasService,
    private amenazasService: AmenazasService,
    public huertosService: HuertosService,
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
    localStorage.setItem('adminTab', tab);
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

  estaUsuarioBaneado(usuario: User): boolean {
    return usuario.baneado === true;
  }

  /**
   * ==================== MODAL BANEAR ====================
   */
  abrirModalBaneo(usuario: User): void {
    this.modalBaneo.usuario = usuario;
    this.modalBaneo.motivo = 'Violación de términos de uso';
    this.modalBaneo.mostrar = true;
  }

  cerrarModalBaneo(): void {
    this.modalBaneo.mostrar = false;
    this.modalBaneo.usuario = null;
    this.modalBaneo.motivo = 'Violación de términos de uso';
  }

  async confirmarBaneo(): Promise<void> {
    if (!this.modalBaneo.usuario || !this.modalBaneo.motivo.trim()) return;
    
    const usuario = this.modalBaneo.usuario;
    const motivo = this.modalBaneo.motivo.trim();
    
    this.cerrarModalBaneo();
    
    try {
      this.procesandoBaneo[usuario.uid] = true;
      
      await this.userService.banUser(usuario.uid, motivo);
      
      const index = this.usuarios.findIndex(u => u.uid === usuario.uid);
      if (index !== -1) {
        this.usuarios[index].baneado = true;
        this.usuarios[index].motivoBaneo = motivo;
      }
      
      console.log('✅ Usuario baneado exitosamente');
      
    } catch (error) {
      console.error('❌ Error al banear usuario:', error);
      alert('Error al banear el usuario. Intenta de nuevo.');
    } finally {
      this.procesandoBaneo[usuario.uid] = false;
    }
  }

  /**
   * ==================== MODAL DESBANEAR ====================
   */
  abrirModalDesbaneo(usuario: User): void {
    this.modalDesbaneo.usuario = usuario;
    this.modalDesbaneo.mostrar = true;
  }

  cerrarModalDesbaneo(): void {
    this.modalDesbaneo.mostrar = false;
    this.modalDesbaneo.usuario = null;
  }

  async confirmarDesbaneo(): Promise<void> {
    if (!this.modalDesbaneo.usuario) return;
    
    const usuario = this.modalDesbaneo.usuario;
    
    this.cerrarModalDesbaneo();
    
    try {
      this.procesandoBaneo[usuario.uid] = true;
      
      await this.userService.unbanUser(usuario.uid);
      
      const index = this.usuarios.findIndex(u => u.uid === usuario.uid);
      if (index !== -1) {
        this.usuarios[index].baneado = false;
        this.usuarios[index].motivoBaneo = undefined;
      }
      
      console.log('✅ Usuario desbaneado exitosamente');
      
    } catch (error) {
      console.error('❌ Error al desbanear usuario:', error);
      alert('Error al desbanear el usuario. Intenta de nuevo.');
    } finally {
      this.procesandoBaneo[usuario.uid] = false;
    }
  }

  /**
   * ==================== MODAL ELIMINAR USUARIO ====================
   */
  abrirModalEliminar(usuario: User): void {
    this.modalEliminar.usuario = usuario;
    this.modalEliminar.confirmacion = '';
    this.modalEliminar.mostrar = true;
  }

  cerrarModalEliminar(): void {
    this.modalEliminar.mostrar = false;
    this.modalEliminar.usuario = null;
    this.modalEliminar.confirmacion = '';
  }

  async confirmarEliminar(): Promise<void> {
    if (!this.modalEliminar.usuario) return;
    
    const usuario = this.modalEliminar.usuario;
    
    this.cerrarModalEliminar();
    
    try {
      this.procesandoBaneo[usuario.uid] = true;
      
      await this.userService.removePerson(usuario.uid);
      
      console.log('✅ Usuario eliminado completamente');
      
    } catch (error) {
      console.error('❌ Error al eliminar usuario:', error);
      alert('Error al eliminar el usuario. Intenta de nuevo.');
    } finally {
      this.procesandoBaneo[usuario.uid] = false;
    }
  }

  /**
   * ==================== MODAL ELIMINAR PLANTA ====================
   */
  abrirModalEliminarPlanta(planta: Planta): void {
    this.modalEliminarPlanta.planta = planta;
    this.modalEliminarPlanta.mostrar = true;
  }

  cerrarModalEliminarPlanta(): void {
    this.modalEliminarPlanta.mostrar = false;
    this.modalEliminarPlanta.planta = null;
  }

  async confirmarEliminarPlanta(): Promise<void> {
    if (!this.modalEliminarPlanta.planta?.id) return;
    
    const plantaId = this.modalEliminarPlanta.planta.id;
    
    this.cerrarModalEliminarPlanta();
    
    try {
      await this.plantasService.removePlanta(plantaId);
      console.log('✅ Planta eliminada');
    } catch (error) {
      console.error('❌ Error eliminando planta:', error);
      alert('Error al eliminar la planta');
    }
  }

  /**
   * ==================== MODAL ELIMINAR AMENAZA ====================
   */
  abrirModalEliminarAmenaza(amenaza: Amenaza): void {
    this.modalEliminarAmenaza.amenaza = amenaza;
    this.modalEliminarAmenaza.mostrar = true;
  }

  cerrarModalEliminarAmenaza(): void {
    this.modalEliminarAmenaza.mostrar = false;
    this.modalEliminarAmenaza.amenaza = null;
  }

  async confirmarEliminarAmenaza(): Promise<void> {
    if (!this.modalEliminarAmenaza.amenaza?.id) return;
    
    const amenazaId = this.modalEliminarAmenaza.amenaza.id;
    
    this.cerrarModalEliminarAmenaza();
    
    try {
      await this.amenazasService.removeAmenaza(amenazaId);
      console.log('✅ Amenaza eliminada');
    } catch (error) {
      console.error('❌ Error eliminando amenaza:', error);
      alert('Error al eliminar la amenaza');
    }
  }

  /**
   * ==================== PLANTAS ====================
   */
nuevaPlanta(): void {
  localStorage.setItem('adminTab', 'plantas');
  this.router.navigate(['/app/plantasform'], { queryParams: { from: 'admin' } });
}

editarPlanta(id: string | undefined): void {
  if (!id) return;
  localStorage.setItem('adminTab', 'plantas');
  this.router.navigate(['/app/plantasform', id], { queryParams: { from: 'admin' } });
}

nuevaAmenaza(): void {
  localStorage.setItem('adminTab', 'amenazas');
  this.router.navigate(['/app/amenazasform'], { queryParams: { from: 'admin' } });
}

editarAmenaza(id: string | undefined): void {
  if (!id) return;
  localStorage.setItem('adminTab', 'amenazas');
  this.router.navigate(['/app/amenazasform', id], { queryParams: { from: 'admin' } });
}

onAvatarError(event: Event): void {
  const img = event.target as HTMLImageElement;
  img.src = '/images/avatars/avatar2.webp';
}

onHuertoImgError(event: Event): void {
  const img = event.target as HTMLImageElement;
  img.src = '/images/huerto1.jpg';
}
}