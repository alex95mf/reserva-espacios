import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToolbarModule } from 'primeng/toolbar';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService, ConfirmationService } from 'primeng/api';
import { EspacioService } from '../../services/espacio.service';
import { Espacio } from '../../models/espacio.model';

@Component({
  selector: 'app-abm-espacios',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputTextareaModule,
    InputNumberModule,
    DropdownModule,
    CheckboxModule,
    ToastModule,
    ConfirmDialogModule,
    ToolbarModule,
    TagModule,
    TooltipModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './abm-espacios.component.html',
  styleUrl: './abm-espacios.component.css'
})
export class AbmEspaciosComponent implements OnInit {
  espacios: Espacio[] = [];
  displayDialog = false;
  espacioForm!: FormGroup;
  esEdicion = false;
  espacioSeleccionado: Espacio | null = null;
  cargando = false;
  
  tiposEspacio = [
    { label: 'Sala de Conferencias', value: 'Sala de Conferencias' },
    { label: 'Auditorio', value: 'Auditorio' },
    { label: 'Sala de Reuniones', value: 'Sala de Reuniones' },
    { label: 'Sala Ejecutiva', value: 'Sala Ejecutiva' },
    { label: 'Espacio Coworking', value: 'Espacio Coworking' }
  ];

  constructor(
    private espacioService: EspacioService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.inicializarFormulario();
  }

  ngOnInit(): void {
    this.cargarEspacios();
  }

  inicializarFormulario(): void {
    this.espacioForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      tipo: ['', Validators.required],
      capacidad: [0, [Validators.required, Validators.min(1)]],
      imagen_url: ['', Validators.required],
      disponible: [true]
    });
  }

  cargarEspacios(): void {
    this.cargando = true;
    this.espacioService.listar().subscribe({
      next: (data) => {
        this.espacios = data;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar espacios:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los espacios'
        });
        this.cargando = false;
      }
    });
  }

  abrirDialogoNuevo(): void {
    this.esEdicion = false;
    this.espacioSeleccionado = null;
    this.espacioForm.reset({ disponible: true, capacidad: 0 });
    this.displayDialog = true;
  }

  abrirDialogoEditar(espacio: Espacio): void {
    this.esEdicion = true;
    this.espacioSeleccionado = espacio;
    this.espacioForm.patchValue({
      nombre: espacio.nombre,
      descripcion: espacio.descripcion,
      tipo: espacio.tipo,
      capacidad: espacio.capacidad,
      imagen_url: espacio.imagen_url,
      disponible: espacio.disponible
    });
    this.displayDialog = true;
  }

  cerrarDialogo(): void {
    this.displayDialog = false;
    this.espacioForm.reset();
    this.espacioSeleccionado = null;
  }

  guardarEspacio(): void {
    if (this.espacioForm.invalid) {
      Object.keys(this.espacioForm.controls).forEach(key => {
        this.espacioForm.get(key)?.markAsTouched();
      });
      return;
    }

    const espacioData = this.espacioForm.value;

    if (this.esEdicion && this.espacioSeleccionado && this.espacioSeleccionado.id) {
      this.espacioService.actualizar(this.espacioSeleccionado.id, espacioData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Espacio actualizado correctamente'
          });
          this.cargarEspacios();
          this.cerrarDialogo();
        },
        error: (error) => {
          console.error('Error al actualizar espacio:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar el espacio'
          });
        }
      });
    } else {
      this.espacioService.crear(espacioData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Espacio creado correctamente'
          });
          this.cargarEspacios();
          this.cerrarDialogo();
        },
        error: (error) => {
          console.error('Error al crear espacio:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo crear el espacio'
          });
        }
      });
    }
  }

  eliminarEspacio(espacio: Espacio): void {
    if (!espacio.id) {
      return;
    }

    this.confirmationService.confirm({
      message: `¿Está seguro que desea eliminar el espacio "${espacio.nombre}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.espacioService.eliminar(espacio.id!).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Espacio eliminado correctamente'
            });
            this.cargarEspacios();
          },
          error: (error) => {
            console.error('Error al eliminar espacio:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar el espacio'
            });
          }
        });
      }
    });
  }

  obtenerSeveridadDisponibilidad(disponible: boolean): 'success' | 'danger' {
    return disponible ? 'success' : 'danger';
  }
}