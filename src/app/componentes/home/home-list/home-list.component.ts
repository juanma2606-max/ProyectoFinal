import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { Huerto } from '../../../modelos/huerto.model';
import { HuertosService } from '../../../servicios/huertos.service';
import { HomeResumeComponent } from '../home-resume/home-resume.component';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-home-list',
  standalone: true,
  imports: [CommonModule, HomeResumeComponent],
  templateUrl: './home-list.component.html',
  styleUrl: './home-list.component.scss'
})
export class HomeListComponent implements OnInit {

  huertos$!: Observable<Huerto[]>;
  huertoAEliminar: Huerto | null = null;

  @ViewChild('deleteModal') deleteModal!: ElementRef;

  constructor(
    private huertoService: HuertosService,
    private router: Router,
    private auth: Auth  // ← añadir
  ) {}

  ngOnInit(): void {
    // Esperamos a que Firebase confirme el usuario antes de cargar huertos
    this.huertos$ = authState(this.auth).pipe(
      switchMap(user => {
        if (!user) return [];
        return this.huertoService.getAllHuertosFirebase();
      })
    );
  }

  onEditHuerto(huerto: Huerto): void {
    this.router.navigate(['/app/huertoform', huerto.id]);
  }

  irACrear(): void {
    this.router.navigate(['/app/huertoform']);
  }

  onDeleteHuerto(huerto: Huerto): void {
    this.huertoAEliminar = huerto;
    const modal = new Modal(this.deleteModal.nativeElement);
    modal.show();
  }

  confirmarEliminacion(): void {
    if (!this.huertoAEliminar) return;

    const modalInstance = Modal.getInstance(this.deleteModal.nativeElement);

    this.deleteModal.nativeElement.addEventListener('hidden.bs.modal', () => {
      document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
      document.body.classList.remove('modal-open');
      document.body.style.removeProperty('overflow');
      document.body.style.removeProperty('padding-right');
    }, { once: true });

    this.huertoService.removeObject(this.huertoAEliminar.id)
      .then(() => {
        this.huertoAEliminar = null;
        modalInstance?.hide();
      })
      .catch(error => console.error('Error al eliminar:', error));
  }
}