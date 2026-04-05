import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Huerto } from '../../modelos/huerto.model';
import { Person } from '../../modelos/person.model';
import { HuertosService } from '../../servicios/huertos.service';
import { PersonService } from '../../servicios/person.service';

@Component({
  selector: 'app-admin-usuario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-usuario.component.html',
  styleUrl: './admin-usuario.component.scss'
})
export class AdminUsuarioComponent implements OnInit {

  uid!: string;
  usuario: Person | null = null;
  huertos$!: Observable<Huerto[]>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private huertosService: HuertosService,
    private personService: PersonService
  ) {}

  ngOnInit(): void {
    this.uid = this.route.snapshot.paramMap.get('uid')!;

    // Cargamos los datos del usuario
    this.personService.getPersonById(this.uid).then(persona => {
      this.usuario = persona;
    });

    // Cargamos sus huertos
    this.huertos$ = this.huertosService.getHuertosByUid(this.uid);
  }

  editarHuerto(huertoId: string): void {
  this.router.navigate(['/app/admin/usuario', this.uid, 'huertoform', huertoId]);
}

  verHuerto(huertoId: string): void {
    this.router.navigate(['/app/admin/usuario', this.uid, 'huerto', huertoId]);
  }

  volver(): void {
    this.router.navigate(['/app/admin']);
  }
}
