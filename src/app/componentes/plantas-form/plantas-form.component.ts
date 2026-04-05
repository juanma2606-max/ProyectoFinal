import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PlantasService } from '../../servicios/plantas.service';
import { Planta } from '../../modelos/planta.model';

@Component({
  selector: 'app-plantas-form',
  templateUrl: './plantas-form.component.html',
  styleUrls: ['./plantas-form.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class PlantasFormComponent implements OnInit {

  vieneDeAdmin: boolean = false;

  plantaForm: FormGroup;

  readonly imagenesPorTipo: Record<string, string> = {
    hortaliza: 'images/plantas/hortaliza.png',
    fruta:     'images/plantas/fruta.png',
    hierba:    'images/plantas/hierba.png',
    flor:      'images/plantas/flor.png',
    arbol:     'images/plantas/arbol.png'
  };

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private plantasService: PlantasService,
    private router: Router
  ) {
    this.plantaForm = this.formBuilder.group({
      nombre:             ['', [Validators.required, Validators.maxLength(100)]],
      descripcion:        ['', [Validators.required, Validators.maxLength(500)]],
      tipo:               ['', [Validators.required]],
      estacion:           ['', [Validators.required, Validators.maxLength(100)]],
      abono:              ['', [Validators.required, Validators.maxLength(200)]],
      riego:              ['', [Validators.required, Validators.maxLength(200)]],
      tiempoCrecimiento:  ['', [Validators.required, Validators.maxLength(100)]],
      incompatibilidades: this.formBuilder.array([]),
      plagas:             this.formBuilder.array([])
    });
  }

  get incompatibilidades(): FormArray {
    return this.plantaForm.get('incompatibilidades') as FormArray;
  }

  get plagas(): FormArray {
    return this.plantaForm.get('plagas') as FormArray;
  }

  addIncompatibilidad(): void {
    this.incompatibilidades.push(this.formBuilder.control('', Validators.required));
  }

  removeIncompatibilidad(index: number): void {
    this.incompatibilidades.removeAt(index);
  }

  addPlaga(): void {
    this.plagas.push(this.formBuilder.control('', Validators.required));
  }

  removePlaga(index: number): void {
    this.plagas.removeAt(index);
  }

  ngOnInit(): void {
    // Leer queryParam de forma reactiva
    this.route.queryParamMap.subscribe(queryParams => {
      this.vieneDeAdmin = queryParams.get('from') === 'admin';
    });

    this.route.paramMap.subscribe(async params => {
      const id = params.get('id');
      if (!id) return;

      const planta = await this.plantasService.getPlantaById(id);
      if (!planta) return;

      (planta.incompatibilidades ?? []).forEach(i => {
        this.incompatibilidades.push(this.formBuilder.control(i, Validators.required));
      });

      (planta.plagas ?? []).forEach(p => {
        this.plagas.push(this.formBuilder.control(p, Validators.required));
      });

      this.plantaForm.setValue({
        nombre:             planta.nombre,
        descripcion:        planta.descripcion,
        tipo:               planta.tipo,
        estacion:           planta.estacion ?? '',
        abono:              planta.abono ?? '',
        riego:              planta.riego ?? '',
        tiempoCrecimiento:  planta.tiempoCrecimiento ?? '',
        incompatibilidades: planta.incompatibilidades ?? [],
        plagas:             planta.plagas ?? []
      });
    });
  }

  onSubmit(): void {
    if (this.plantaForm.invalid) {
      this.plantaForm.markAllAsTouched();
      return;
    }

    const {
      nombre, descripcion, tipo,
      estacion, abono, riego, tiempoCrecimiento,
      incompatibilidades, plagas
    } = this.plantaForm.value;

    const imagen = this.imagenesPorTipo[tipo];

    const plantaData = {
      nombre, descripcion, tipo, imagen, estacion, abono, riego, tiempoCrecimiento,
      incompatibilidades: (incompatibilidades as string[]).filter(i => i.trim() !== ''),
      plagas: (plagas as string[]).filter(p => p.trim() !== '')
    };

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.plantasService.updatePlanta({ id, ...plantaData } as Planta)
        .then(() => this.vieneDeAdmin
          ? this.router.navigate(['/app/admin'])
          : this.router.navigate(['/app/plantas']))
        .catch(error => alert(error.message));
    } else {
      this.plantasService.createPlanta(plantaData as Omit<Planta, 'id'>)
        .then(() => this.vieneDeAdmin
          ? this.router.navigate(['/app/admin'])
          : this.router.navigate(['/app/plantas']))
        .catch(error => alert(error.message));
    }
  }
}