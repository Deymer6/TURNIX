import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NegocioService, Negocio, Servicio, Profesional, Galeria, Resena, CitaRequestDTO } from '../../services/negocio.service';

@Component({
  selector: 'app-negocio-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './negocio-detail.html',
  styleUrls: ['./negocio-detail.css']
})
export class NegocioDetail implements OnInit {
  
  negocio: Negocio | null = null;
  servicios: Servicio[] = [];
  profesionales: Profesional[] = [];
  galeria: Galeria[] = [];
  resenas: Resena[] = [];
  loading = true;

  modalAbierto = false;
  pasoActual = 1;
  serviciosSeleccionados: Servicio[] = [];
  profesionalSeleccionado: Profesional | null = null;
  fechaSeleccionada: string = ''; 
  horaSeleccionada: string = '';
  totalPagar = 0;
  horariosDisponibles = ['09:00', '10:00', '11:00', '12:00', '13:00', '15:00', '16:00', '17:00', '18:00'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private negocioService: NegocioService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.cargarDatos(+idParam);
    }
  }

  cargarDatos(id: number) {
    this.loading = true;

    // 1. Negocio
    this.negocioService.obtenerNegocioPorId(id).subscribe({
      next: (data) => {
        this.negocio = data;

        // === CORRECCIÓN IMAGEN PORTADA ===
        if (this.negocio.imagenUrl && this.negocio.imagenUrl.startsWith('/images')) {
            this.negocio.imagenUrl = '/assets' + this.negocio.imagenUrl;
        } else if (!this.negocio.imagenUrl) {
            const nombre = (this.negocio.nombreNegocio || '').toLowerCase();
            if (nombre.includes('barber') || this.negocio.id === 1) {
                this.negocio.imagenUrl = '/assets/images/barberia-fachada.jpg';
            } else {
                this.negocio.imagenUrl = '/assets/images/salon-fachada.webp';
            }
        }
        
        if (!this.negocio.calificacionPromedio) {
            this.negocio.calificacionPromedio = 4.8;
            this.negocio.numeroResenas = 15;
        }
        this.loading = false;
      },
      error: (err) => { console.error(err); this.loading = false; }
    });

    this.negocioService.obtenerServicios(id).subscribe(data => this.servicios = data);
    
    // === CORRECCIÓN GALERÍA ===
    this.negocioService.obtenerGaleria(id).subscribe(data => {
        this.galeria = data.map(img => {
            if(img.urlImagen && img.urlImagen.startsWith('/images')) {
                img.urlImagen = '/assets' + img.urlImagen;
            }
            return img;
        });
    });

    this.negocioService.obtenerProfesionales(id).subscribe(data => this.profesionales = data);
    this.negocioService.obtenerResenas(id).subscribe(data => this.resenas = data);
  }

  // --- WIZARD ---
  abrirReserva() { this.modalAbierto = true; this.pasoActual = 1; this.resetFormulario(); }
  cerrarReserva() { this.modalAbierto = false; }
  resetFormulario() {
    this.serviciosSeleccionados = []; this.profesionalSeleccionado = null;
    this.fechaSeleccionada = ''; this.horaSeleccionada = ''; this.totalPagar = 0;
    this.servicios.forEach(s => s.selected = false);
  }
  toggleServicio(servicio: Servicio) {
    servicio.selected = !servicio.selected;
    if (servicio.selected) this.serviciosSeleccionados.push(servicio);
    else this.serviciosSeleccionados = this.serviciosSeleccionados.filter(s => s.id !== servicio.id);
    this.calcularTotal();
  }
  calcularTotal() { this.totalPagar = this.serviciosSeleccionados.reduce((sum, item) => sum + item.precio, 0); }
  seleccionarProfesional(prof: Profesional) { this.profesionalSeleccionado = prof; }
  seleccionarHora(hora: string) { this.horaSeleccionada = hora; }
  siguiente() {
    if (this.pasoActual === 1 && this.serviciosSeleccionados.length === 0) return;
    if (this.pasoActual === 2 && !this.profesionalSeleccionado) return;
    if (this.pasoActual === 3 && (!this.fechaSeleccionada || !this.horaSeleccionada)) return;
    this.pasoActual++;
  }
  atras() { if (this.pasoActual > 1) this.pasoActual--; }

  confirmarReserva() {
    if (!this.negocio || !this.profesionalSeleccionado) return;
    const CLIENTE_ID_MOCK = 2; 
    const peticiones: CitaRequestDTO[] = this.serviciosSeleccionados.map(servicio => {
      const fechaInicioStr = `${this.fechaSeleccionada}T${this.horaSeleccionada}:00`;
      const fechaInicioObj = new Date(this.fechaSeleccionada + 'T' + this.horaSeleccionada);
      const fechaFinObj = new Date(fechaInicioObj.getTime() + servicio.duracionEstimada * 60000);
      const fechaFinStr = this.formatDateISO(fechaFinObj);

      return {
        clienteId: CLIENTE_ID_MOCK,
        negocioId: this.negocio!.id,
        profesionalId: this.profesionalSeleccionado!.id,
        servicioId: servicio.id,
        fechaHoraInicio: fechaInicioStr,
        fechaHoraFin: fechaFinStr,
        estado: 'PROGRAMADA',
        precioFinal: servicio.precio,
        notasPromocion: 'Reserva Web'
      };
    });

    this.negocioService.guardarCitas(peticiones).subscribe({
      next: () => {
        alert('¡Cita Confirmada Exitosamente!');
        this.cerrarReserva();
        this.router.navigate(['/home']);
      },
      error: (err) => { console.error(err); alert('Hubo un error al reservar.'); }
    });
  }

  formatDateISO(date: Date): string {
    const pad = (n: number) => n < 10 ? '0' + n : n;
    return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + 'T' + pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds());
  }

  cargarImagenDefault(event: any) {
    event.target.src = '/assets/images/barberia-fachada.jpg'; 
  }
}