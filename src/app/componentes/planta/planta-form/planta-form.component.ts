import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
  Validators,
  FormsModule
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PlantasService } from '../../../servicios/plantas.service';
import { Planta } from '../../../modelos/planta.model';
import { CloudinaryService } from '../../../servicios/cloudinary.service';

@Component({
  selector: 'app-plantas-form',
  standalone: true,
  templateUrl: './planta-form.component.html',
  styleUrls: ['./planta-form.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule]
})
export class PlantasFormComponent implements OnInit {

  vieneDeAdmin: boolean = false;
  todasLasPlantas: Planta[] = [];
  plantaSeleccionada: string = '';
  plantaActualId: string | null = null;
  subiendoImagen: boolean = false;
  plantaForm: FormGroup;

  atLeastOneEstacion(group: FormGroup): { [key: string]: boolean } | null {
    const hasOne = Object.keys(group.controls).some(key => group.controls[key].value === true);
    return hasOne ? null : { atLeastOne: true };
  }

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private plantasService: PlantasService,
    private router: Router,
    private cloudinaryService: CloudinaryService
  ) {
    this.plantaForm = this.formBuilder.group({
      nombre:             ['', [Validators.required, Validators.maxLength(100)]],
      descripcion:        ['', [Validators.required, Validators.maxLength(500)]],
      tipo:               ['', [Validators.required]],
      imagen:             ['', [Validators.maxLength(1000)]],
      nombre_cientifico:  ['', [Validators.maxLength(200)]],
      estaciones:         this.formBuilder.group({
        primavera: [false],
        verano:    [false],
        otono:     [false],
        invierno:  [false]
      }, { validators: this.atLeastOneEstacion }),
      abono:              ['', [Validators.required, Validators.maxLength(200)]],
      riego:              ['bajo', [Validators.required]],
      luz:                ['pleno-sol', [Validators.required]],
      tiempo_crecimiento: [0, [Validators.required, Validators.min(1)]],
      incompatibilidades: this.formBuilder.array([]),
      amenazas:           this.formBuilder.array([])
    });
  }

  get estaciones() {
    return this.plantaForm.get('estaciones') as FormGroup;
  }

  get incompatibilidades(): FormArray {
    return this.plantaForm.get('incompatibilidades') as FormArray;
  }

  get amenazas(): FormArray {
    return this.plantaForm.get('amenazas') as FormArray;
  }

addIncompatibilidad(): void {
  if (!this.plantaSeleccionada) return;
  const yaExiste = this.incompatibilidades.controls.some(c => c.value === this.plantaSeleccionada);
  if (yaExiste) return;
  this.incompatibilidades.push(this.formBuilder.control(this.plantaSeleccionada, Validators.required));
  this.plantaSeleccionada = '';
}
getNombrePlanta(id: string): string {
  return this.todasLasPlantas.find(p => p.id === id)?.nombre ?? id;
}

esIncompatibleYaSeleccionada(id: string): boolean {
  return this.incompatibilidades.controls.some(c => c.value === id);
}

  removeIncompatibilidad(index: number): void {
    this.incompatibilidades.removeAt(index);
  }

  addAmenaza(): void {
    this.amenazas.push(this.formBuilder.control('', Validators.required));
  }

  removeAmenaza(index: number): void {
    this.amenazas.removeAt(index);
  }

  // ← aquí, después de removeAmenaza y antes de ngOnInit
  async onImagenSeleccionada(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    this.subiendoImagen = true;
    try {
      const url = await this.cloudinaryService.subirImagen(input.files[0]);
      this.plantaForm.patchValue({ imagen: url });
    } catch (e) {
      console.error('Error subiendo imagen:', e);
      alert('Error al subir la imagen. Inténtalo de nuevo.');
    } finally {
      this.subiendoImagen = false;
      input.value = '';
    }
  }

  ngOnInit(): void {
    this.plantasService.getAllPlantasFirebase().subscribe(plantas => {
  this.todasLasPlantas = plantas;
});
    this.route.queryParamMap.subscribe(queryParams => {
      this.vieneDeAdmin = queryParams.get('from') === 'admin';
    });

    this.route.paramMap.subscribe(async params => {
      const id = params.get('id');
      this.plantaActualId = id;
      if (!id) return;

      const planta = await this.plantasService.getPlantaById(id);
      if (!planta) return;

      (planta.incompatibilidades ?? []).forEach(i => {
        this.incompatibilidades.push(this.formBuilder.control(i, Validators.required));
      });

      (planta.amenazas ?? []).forEach(a => {
        this.amenazas.push(this.formBuilder.control(a, Validators.required));
      });

      const estacionesArray = (planta.estacion || '').split(',').map(e => e.trim().toLowerCase());
      const estacionesObj = {
        primavera: estacionesArray.includes('primavera'),
        verano:    estacionesArray.includes('verano'),
        otono:     estacionesArray.includes('otoño') || estacionesArray.includes('otono'),
        invierno:  estacionesArray.includes('invierno')
      };

      this.plantaForm.patchValue({
        nombre:             planta.nombre,
        descripcion:        planta.descripcion,
        tipo:               planta.tipo,
        imagen:             planta.imagen || '',
        nombre_cientifico:  planta.nombre_cientifico || '',
        estaciones:         estacionesObj,
        abono:              planta.abono,
        riego:              planta.riego,
        luz:                planta.luz,
        tiempo_crecimiento: planta.tiempo_crecimiento
      });
    });
  }

  async onSubmit(): Promise<void> {
    if (this.plantaForm.invalid) {
      this.plantaForm.markAllAsTouched();
      return;
    }

    const formValue = this.plantaForm.value;

    const estacionesSeleccionadas: string[] = [];
    if (formValue.estaciones.primavera) estacionesSeleccionadas.push('primavera');
    if (formValue.estaciones.verano) estacionesSeleccionadas.push('verano');
    if (formValue.estaciones.otono) estacionesSeleccionadas.push('otoño');
    if (formValue.estaciones.invierno) estacionesSeleccionadas.push('invierno');

    const plantaData: any = {
      nombre:             formValue.nombre.trim(),
      descripcion:        formValue.descripcion.trim(),
      tipo:               formValue.tipo,
      imagen:             formValue.imagen?.trim() || '',
      estacion:           estacionesSeleccionadas.join(', '),
      abono:              formValue.abono.trim(),
      riego:              formValue.riego,
      luz:                formValue.luz,
      tiempo_crecimiento: Number(formValue.tiempo_crecimiento),
      incompatibilidades: (formValue.incompatibilidades as string[]).filter(i => i.trim() !== ''),
      amenazas:           (formValue.amenazas as string[]).filter(a => a.trim() !== '')
    };

    // Solo agregar nombre_cientifico si tiene valor
    const nombreCientifico = formValue.nombre_cientifico?.trim();
    if (nombreCientifico) {
      plantaData.nombre_cientifico = nombreCientifico;
    }

    // Limpiar cualquier undefined que quede
    Object.keys(plantaData).forEach(key => {
      if (plantaData[key] === undefined) {
        delete plantaData[key];
      }
    });

    const id = this.route.snapshot.paramMap.get('id');

    try {
      if (id) {
        await this.plantasService.updatePlanta({ id, ...plantaData });
      } else {
        await this.plantasService.createPlanta(plantaData);
      }
      
      await this.router.navigate(
        this.vieneDeAdmin ? ['/app/admin'] : ['/app/plantas']
      );
    } catch (error: any) {
      console.error('Error guardando planta:', error);
      alert('Error al guardar: ' + error.message);
    }
  }
}