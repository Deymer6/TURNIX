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

  // Wizard Reserva
  modalAbierto = false;
  pasoActual = 1;
  serviciosSeleccionados: Servicio[] = [];
  profesionalSeleccionado: Profesional | null = null;
  fechaSeleccionada: string = ''; 
  horaSeleccionada: string = '';
  totalPagar = 0;
  duracionTotal = 0;
  horariosDisponibles = ['09:00', '10:00', '11:00', '12:00', '13:00', '15:00', '16:00', '17:00', '18:00'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private negocioService: NegocioService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    // Forzamos conversión a número para evitar errores de comparación estricta (===)
    if (idParam) {
      this.cargarDatosCompleto(+idParam);
    }
  }

  cargarDatosCompleto(id: number) {
    this.loading = true;
    
    // 1. Negocio
    this.negocioService.obtenerNegocioPorId(id).subscribe({
      next: (data) => {
        this.negocio = data;
        // Asignar imagen default si viene nula
        if (!this.negocio.imagenUrl) {
          const nombre = (this.negocio.nombreNegocio || '').toLowerCase();
          if (nombre.includes('barber')) this.negocio.imagenUrl = '/resources/static/images/barberia-fachada.jpg';
          else this.negocio.imagenUrl = '/resources/static/images/salon-fachada.webp';
        }
        this.loading = false;
      },
      error: (e) => {
        console.error('Error cargando negocio', e);
        this.loading = false;
      }
    });

    // 2. Servicios (Pasando ID)
    this.negocioService.obtenerServicios(id).subscribe(data => {
      console.log('Servicios filtrados:', data);
      this.servicios = data;
    });

    // 3. Galería (Pasando ID)
    this.negocioService.obtenerGaleria(id).subscribe(data => this.galeria = data);

    // 4. Profesionales
    this.negocioService.obtenerProfesionales().subscribe(data => this.profesionales = data);

    // 5. Reseñas (Pasando ID para filtrar)
    this.negocioService.obtenerResenas(id).subscribe(data => this.resenas = data);
  }

  cargarImagenDefault(event: any) {
    // Si falla la imagen del backend, usar placeholder
    event.target.src = 'https://via.placeholder.com/800x400?text=Turnix+Negocio';
  }

  // --- LÓGICA DEL WIZARD (Sin cambios funcionales, solo repaso) ---
  abrirReserva() {
    this.modalAbierto = true;
    this.pasoActual = 1;
    this.resetFormulario();
  }
  cerrarReserva() { this.modalAbierto = false; }
  
  resetFormulario() {
    this.serviciosSeleccionados = [];
    this.profesionalSeleccionado = null;
    this.fechaSeleccionada = '';
    this.horaSeleccionada = '';
    this.totalPagar = 0;
    this.duracionTotal = 0;
    this.servicios.forEach(s => s.selected = false);
  }

  toggleServicio(servicio: Servicio) {
    servicio.selected = !servicio.selected;
    if (servicio.selected) this.serviciosSeleccionados.push(servicio);
    else this.serviciosSeleccionados = this.serviciosSeleccionados.filter(s => s.id !== servicio.id);
    this.calcularTotales();
  }

  calcularTotales() {
    this.totalPagar = this.serviciosSeleccionados.reduce((acc, s) => acc + s.precio, 0);
    this.duracionTotal = this.serviciosSeleccionados.reduce((acc, s) => acc + s.duracionEstimada, 0);
  }

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
    const CLIENTE_ID_MOCK = 1;

    const peticiones: CitaRequestDTO[] = this.serviciosSeleccionados.map(servicio => {
      const inicio = `${this.fechaSeleccionada}T${this.horaSeleccionada}:00`;
      const fechaFinObj = new Date(`${this.fechaSeleccionada}T${this.horaSeleccionada}`);
      fechaFinObj.setMinutes(fechaFinObj.getMinutes() + servicio.duracionEstimada);
      const fin = this.formatDate(fechaFinObj);

      return {
        clienteId: CLIENTE_ID_MOCK,
        negocioId: this.negocio!.id,
        profesionalId: this.profesionalSeleccionado!.id,
        servicioId: servicio.id,
        fechaHoraInicio: inicio,
        fechaHoraFin: fin,
        estado: 'PENDIENTE',
        precioFinal: servicio.precio,
        notasPromocion: 'Reserva Web'
      };
    });

    this.negocioService.guardarCitas(peticiones).subscribe({
      next: () => {
        alert('¡Reserva Confirmada con Éxito!');
        this.cerrarReserva();
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error(err);
        alert('Hubo un error al guardar.');
      }
    });
  }

  formatDate(date: Date): string {
    const pad = (n: number) => n < 10 ? '0' + n : n;
    return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + 'T' + pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds());
  }
}