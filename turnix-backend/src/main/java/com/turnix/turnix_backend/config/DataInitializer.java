package com.turnix.turnix_backend.config;

import com.turnix.turnix_backend.model.*;
import com.turnix.turnix_backend.repository.*;
import lombok.AllArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.Set;

@Component
@AllArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final NegocioRepository negocioRepository;
    private final ProfesionalRepository profesionalRepository;
    private final ServicioRepository servicioRepository;
    private final ProfesionalServicioRepository profesionalServicioRepository;
    private final PromocionRepository promocionRepository;
    private final DisponibilidadSemanalRepository disponibilidadSemanalRepository;
    private final ExcepcionHorarioRepository excepcionHorarioRepository;
    private final CitaRepository citaRepository;
    private final ResenaRepository resenaRepository;
    private final GaleriaNegocioRepository galeriaNegocioRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;


    @Override
    public void run(String... args) throws Exception {
        if (usuarioRepository.count() == 0 && negocioRepository.count() == 0) {
            System.out.println("====================================================");
            System.out.println("Base de datos vacía. Inicializando datos de prueba...");
            System.out.println("====================================================");

            // --- 0. Crear Roles ---
            Role adminRole = new Role(null, "ROLE_ADMIN");
            Role userRole = new Role(null, "ROLE_USER");
            roleRepository.saveAll(List.of(adminRole, userRole));
            System.out.println("-> Roles creados.");

            // --- 1. Crear Usuarios (Dueños y Clientes) ---
            Usuario dueno1 = createUsuario("Admin", "Principal", "admin@turnix.com", "987654321", Set.of(adminRole));
           Usuario dueno2 = createUsuario("Lucia", "Fernandez", "lucia.f@example.com", "933333333", Set.of(adminRole));
            Usuario cliente2 = createUsuario("Marcos", "Polo", "marcos.p@example.com", "944444444", Set.of(userRole));
            Usuario cliente3 = createUsuario("Ana", "Guerra", "ana.g@example.com", "955555555", Set.of(userRole));
            Usuario cliente4 = createUsuario("Pedro", "Perez", "pedro.p@example.com", "966666666", Set.of(userRole));
            Usuario cliente5 = createUsuario("Sofia", "Reyes", "sofia.r@example.com", "977777777", Set.of(userRole));
            Usuario cliente6 = createUsuario("Carlos", "Santana", "carlos.s@example.com", "911223344", Set.of(userRole));
            Usuario cliente7 = createUsuario("Laura", "Vega", "laura.v@example.com", "922334455", Set.of(userRole));
            Usuario cliente8 = createUsuario("Javier", "Mora", "javier.m@example.com", "933445566", Set.of(userRole));
            Usuario cliente9 = createUsuario("Elena", "Nito", "elena.n@example.com", "944556677", Set.of(userRole));
            Usuario cliente10 = createUsuario("Mario", "Bros", "mario.b@example.com", "955667788", Set.of(userRole));

            List<Usuario> usuariosGuardados = usuarioRepository.saveAll(Arrays.asList(dueno1, dueno2, cliente2, cliente3, cliente4, cliente5, cliente6, cliente7, cliente8, cliente9, cliente10));
            Usuario duenoGuardado = usuariosGuardados.get(0);
            Usuario duenoGuardado2 = usuariosGuardados.get(1);
            Usuario clienteGuardado2 = usuariosGuardados.get(2);
            Usuario clienteGuardado3 = usuariosGuardados.get(3);
            Usuario clienteGuardado4 = usuariosGuardados.get(4);
            Usuario clienteGuardado5 = usuariosGuardados.get(5);
            System.out.println("-> Usuarios creados.");

            // --- 2. Crear Negocios ---
             Negocio negocio1 = createNegocio("Barbería Don Pepe", "Calle Falsa 123, Madrid", duenoGuardado, "912345678", "La barbería tradicional con un toque moderno.", "09:00", "20:00", "Madrid", TipoNegocio.BARBERIA);
             Negocio negocio3 = createNegocio("Salón de Belleza 'Estilo Divino'", "Paseo de la Castellana 100, Madrid", duenoGuardado2, "911223344", "Expertos en color, corte y maquillaje para realzar tu belleza.", "10:00", "20:00", "Madrid", TipoNegocio.SALON_BELLEZA);

            List<Negocio> negociosGuardados = negocioRepository.saveAll(Arrays.asList(negocio1, negocio3));
            Negocio negocioGuardado1 = negociosGuardados.get(0);
            Negocio negocioGuardado3 = negociosGuardados.get(1);
            System.out.println("-> Negocios creados.");

            // --- 3. Crear Profesionales ---
            Profesional prof1 = createProfesional("Carlos", "Gomez", "Barbero Principal", negocioGuardado1, true); // Barbería
            Profesional prof2 = createProfesional("Juan", "Perez", "Barbero Junior", negocioGuardado1, true); // Barbería
            Profesional prof6 = createProfesional("Isabel", "Reyes", "Estilista Senior y Colorista", negocioGuardado3, true);
            Profesional prof7 = createProfesional("Laura", "Campos", "Estilista Junior", negocioGuardado3, true);
            Profesional prof8 = createProfesional("Miguel", "Sanz", "Maquillador Profesional", negocioGuardado3, true);

            List<Profesional> profesionalesGuardados = profesionalRepository.saveAll(Arrays.asList(prof1, prof2, prof6, prof7, prof8));
            Profesional profGuardado1 = profesionalesGuardados.get(0);
            Profesional profGuardado2 = profesionalesGuardados.get(1);
            Profesional profGuardado6 = profesionalesGuardados.get(2);
            Profesional profGuardado7 = profesionalesGuardados.get(3);
            Profesional profGuardado8 = profesionalesGuardados.get(4);
            System.out.println("-> Profesionales creados.");

            // --- 4. Crear Servicios ---
            Servicio s1 = createServicio("Corte Clásico", "18.00", 30, negocioGuardado1);
            Servicio s2 = createServicio("Corte con Diseño y Perfilado de Barba", "25.00", 45, negocioGuardado1);
            Servicio s3 = createServicio("Afeitado Clásico con Navaja", "20.00", 30, negocioGuardado1);
            Servicio s7 = createServicio("Corte de Dama (Lavar y Peinar)", "45.00", 60, negocioGuardado3);
            Servicio s8 = createServicio("Tinte y Mechas (Balayage)", "120.00", 180, negocioGuardado3);
            Servicio s9 = createServicio("Maquillaje de Noche", "60.00", 75, negocioGuardado3);
            Servicio s10 = createServicio("Tratamiento Capilar de Keratina", "90.00", 120, negocioGuardado3);
            Servicio s12 = createServicio("Arreglo de cejas con hilo", "15.00", 20, negocioGuardado1);
            Servicio s13 = createServicio("Manicura Completa", "22.00", 40, negocioGuardado3); // Movido a Salón de Belleza
            Servicio s14 = createServicio("Pedicura Completa", "35.00", 50, negocioGuardado3); // Movido a Salón de Belleza

            servicioRepository.saveAll(Arrays.asList(s1, s2, s3, s7, s8, s9, s10, s12, s13, s14));
            System.out.println("-> Servicios creados.");

            // --- 5. Vincular Profesionales con Servicios ---
            vincularProfesionalServicio(profGuardado1, s1); vincularProfesionalServicio(profGuardado1, s2); vincularProfesionalServicio(profGuardado1, s3);
            vincularProfesionalServicio(profGuardado1, s12); // Carlos también hace cejas
            vincularProfesionalServicio(profGuardado2, s1);
            vincularProfesionalServicio(profGuardado6, s7); // Isabel hace corte
            vincularProfesionalServicio(profGuardado6, s8); // Isabel hace tinte
            vincularProfesionalServicio(profGuardado6, s10); // Isabel hace keratina
            vincularProfesionalServicio(profGuardado7, s13); // Laura hace manicura
            vincularProfesionalServicio(profGuardado7, s14); // Laura hace pedicura
            vincularProfesionalServicio(profGuardado7, s7); // Laura hace corte
            vincularProfesionalServicio(profGuardado8, s9); // Miguel hace maquillaje
            System.out.println("-> Profesionales vinculados a servicios.");

            // --- 6. Crear Promociones ---
            promocionRepository.saveAll(Arrays.asList(
                createPromocion("Miércoles de Corte y Barba", "Corte + Afeitado por 30€", negocioGuardado1, true),
                createPromocion("Jueves de Color", "20% de descuento en Tinte y Mechas", negocioGuardado3, true),
                createPromocion("Bienvenida", "10% de descuento en tu primer servicio", negocioGuardado1, true),
                createPromocion("Pack Belleza Completa", "Corte + Tratamiento de Keratina por 120€", negocioGuardado3, true),
                createPromocion("Fidelidad Barber", "5to corte gratis", negocioGuardado1, false) // Promoción inactiva
            ));
            System.out.println("-> Promociones creadas.");

            // --- 7. Crear Disponibilidad y Excepciones ---
            createDisponibilidad(profGuardado1, 1, "09:00", "13:00"); createDisponibilidad(profGuardado1, 1, "15:00", "19:00"); // Lunes
            createDisponibilidad(profGuardado1, 2, "09:00", "13:00"); createDisponibilidad(profGuardado1, 2, "15:00", "19:00"); // Martes
            createDisponibilidad(profGuardado6, 5, "10:00", "20:00"); // Viernes (Isabel)
            createDisponibilidad(profGuardado6, 6, "10:00", "15:00"); // Sábado (Isabel)
            createDisponibilidad(profGuardado8, 5, "15:00", "20:00"); // Viernes (Miguel)
            createDisponibilidad(profGuardado8, 6, "12:00", "20:00"); // Sábado (Miguel)

            createExcepcionDiaCompleto(profGuardado1, LocalDateTime.now().plusDays(10), "ASUNTOS_PERSONALES"); // Carlos no disponible
            createExcepcionDiaCompleto(profGuardado6, LocalDateTime.now().plusDays(15), "CURSO_FORMACION"); // Isabel no disponible

            createExcepcionBloqueHoras(profGuardado1, LocalDateTime.now().plusDays(3), "PAUSA_ALMUERZO", "14:00", "15:00");
            System.out.println("-> Horarios de disponibilidad y excepciones creados.");

            // --- 8. Crear Citas ---
           Cita cita1 = createCita(duenoGuardado2, negocioGuardado1, profGuardado1, s2, LocalDateTime.now().plusDays(2).withHour(10).withMinute(30), "PROGRAMADA", "Perfilado de barba para evento.");
            Cita citaCompletada1 = createCita(clienteGuardado3, negocioGuardado1, profGuardado2, s1, LocalDateTime.now().minusDays(1).withHour(11).withMinute(30), "COMPLETADA", "Corte clásico, todo perfecto.");
           Cita citaCancelada = createCita(duenoGuardado2, negocioGuardado1, profGuardado1, s1, LocalDateTime.now().plusDays(4).withHour(12).withMinute(30), "CANCELADA", "Cliente canceló por imprevisto.");
            Cita citaNoAsistio = createCita(clienteGuardado2, negocioGuardado1, profGuardado1, s3, LocalDateTime.now().minusDays(3).withHour(16).withMinute(0), "NO_ASISTIO", "El cliente no se presentó a la cita.");
            Cita citaCorteDama = createCita(clienteGuardado4, negocioGuardado3, profGuardado7, s7, LocalDateTime.now().plusDays(8).withHour(14).withMinute(0), "PROGRAMADA", "Corte de puntas y peinado para boda.");
            Cita citaMaquillaje = createCita(clienteGuardado5, negocioGuardado3, profGuardado8, s9, LocalDateTime.now().plusDays(5).withHour(18).withMinute(0), "PROGRAMADA", "Maquillaje para evento de noche.");
            Cita citaCompletada3 = createCita(clienteGuardado5, negocioGuardado3, profGuardado6, s8, LocalDateTime.now().minusDays(5).withHour(11).withMinute(0), "COMPLETADA", "Mechas balayage, resultado increíble.");

            List<Cita> citasGuardadas = citaRepository.saveAll(Arrays.asList(cita1, citaCompletada1, citaCancelada, citaNoAsistio, citaCorteDama, citaMaquillaje, citaCompletada3));
            System.out.println("-> Citas creadas.");

            // --- 9. Crear Reseñas (asociadas a una cita completada) ---
            createResena(clienteGuardado3, citasGuardadas.get(1), 5, "¡Excelente corte! Juan es muy detallista y profesional.");
            createResena(clienteGuardado5, citasGuardadas.get(6), 5, "Isabel es una artista con el color. ¡Amo mis nuevas mechas!");

            System.out.println("-> Reseñas creadas.");

            // --- 10. Crear Galería de Negocios ---

            galeriaNegocioRepository.saveAll(Arrays.asList(
                createGaleria(negocioGuardado1, "/images/barberia-interior.jpg", "Interior de nuestra barbería."),
                createGaleria(negocioGuardado1, "/images/barberia-fachada.jpg", "Fachada de Barbería Don Pepe."),
                createGaleria(negocioGuardado1, "/images/barberia-afeitado.jpg", "Servicio de afeitado clásico con navaja."),
                createGaleria(negocioGuardado1, "/images/barberia-perfilado-barba.jpg", "Perfilado de barba profesional."),
                createGaleria(negocioGuardado1, "/images/barberia-corte-clasico.jpg", "Servicio de corte clásico para caballero."),
                createGaleria(negocioGuardado3, "/images/salon-interior.jpg", "Nuestro moderno salón de belleza."),
                createGaleria(negocioGuardado3, "/images/salon-interior-2.jpg", "Área de recepción y espera."),
                createGaleria(negocioGuardado3, "/images/salon-fachada.jpg", "Entrada a Estilo Divino."),
                createGaleria(negocioGuardado3, "/images/salon-color.jpg", "Resultados de coloración profesional."),
                createGaleria(negocioGuardado3, "/images/salon-maquillaje.jpg", "Maquillaje profesional para eventos."),
                createGaleria(negocioGuardado3, "/images/salon-manicura.jpg", "Servicio de manicura completa."),
                createGaleria(negocioGuardado3, "/images/salon-keratina.jpg", "Tratamiento de keratina para un cabello radiante.")
            ));
            System.out.println("-> Galería de imágenes creada.");

            System.out.println("====================================================");
            System.out.println("¡Inicialización de datos completada!");
            System.out.println("====================================================");

        } else {
            System.out.println("La base de datos ya contiene datos. No se requiere inicialización.");
        }
    }

    private Usuario createUsuario(String nombre, String apellido, String email, String telefono, Set<Role> roles) {
        Usuario usuario = new Usuario();
        usuario.setNombre(nombre);
        usuario.setApellido(apellido);
        usuario.setEmail(email);
        usuario.setTelefono(telefono);
        usuario.setPasswordHash(passwordEncoder.encode("password123"));
        usuario.setRoles(roles);
        return usuario;
    }

    private Negocio createNegocio(String nombre, String direccion, Usuario dueno, String telefono, String descripcion, String apertura, String cierre, String ciudad, TipoNegocio tipo) {
        Negocio negocio = new Negocio();
        negocio.setNombreNegocio(nombre);
        negocio.setDireccion(direccion);
        negocio.setDueno(dueno);
        negocio.setTelefonoNegocio(telefono);
        negocio.setDescripcion(descripcion);
        negocio.setHorarioApertura(LocalTime.parse(apertura));
        negocio.setHorarioCierre(LocalTime.parse(cierre));
        negocio.setCiudad(ciudad);
        negocio.setTipo(tipo);
        return negocio;
    }

    private Profesional createProfesional(String nombre, String apellido, String especialidad, Negocio negocio, boolean activo) {
        Profesional profesional = new Profesional();
        profesional.setNombre(nombre);
        profesional.setApellido(apellido);
        profesional.setEspecialidad(especialidad);
        profesional.setNegocio(negocio);
        profesional.setActivo(activo);
        return profesional;
    }

    private Servicio createServicio(String nombre, String precio, int duracion, Negocio negocio) {
        Servicio servicio = new Servicio();
        servicio.setNombreServicio(nombre);
        servicio.setPrecio(new BigDecimal(precio));
        servicio.setDuracionEstimada(duracion);
        servicio.setNegocio(negocio);
        return servicio;
    }

    private void vincularProfesionalServicio(Profesional profesional, Servicio servicio) {
        ProfesionalServicio profesionalServicio = new ProfesionalServicio();
        profesionalServicio.setProfesional(profesional);
        profesionalServicio.setServicio(servicio);
        profesionalServicioRepository.save(profesionalServicio);
    }

    private Promocion createPromocion(String titulo, String descripcion, Negocio negocio, boolean activa) {
        Promocion promocion = new Promocion();
        promocion.setTitulo(titulo);
        promocion.setDescripcion(descripcion);
        promocion.setFechaInicio(LocalDate.now());
        promocion.setFechaFin(LocalDate.now().plusMonths(1));
        promocion.setNegocio(negocio);
        promocion.setActiva(activa);
        return promocion;
    }

    private void createDisponibilidad(Profesional profesional, Integer dia, String horaInicio, String horaFin) {
        DisponibilidadSemanal disponibilidad = new DisponibilidadSemanal();
        disponibilidad.setProfesional(profesional);
        disponibilidad.setDiaSemana(dia);
        disponibilidad.setHoraInicio(LocalTime.parse(horaInicio));
        disponibilidad.setHoraFin(LocalTime.parse(horaFin));
        disponibilidadSemanalRepository.save(disponibilidad);
    }

    private void createExcepcionDiaCompleto(Profesional profesional, LocalDateTime fecha, String tipo) {
        ExcepcionHorario excepcion = new ExcepcionHorario();
        excepcion.setProfesional(profesional);
        excepcion.setFechaEspecifica(fecha.toLocalDate());
        excepcion.setTipo(tipo);
        excepcion.setHoraInicio(LocalTime.MIN);
        excepcion.setHoraFin(LocalTime.MAX);
        excepcionHorarioRepository.save(excepcion);
    }

    private void createExcepcionBloqueHoras(Profesional profesional, LocalDateTime fecha, String tipo, String horaInicio, String horaFin) {
        ExcepcionHorario excepcion = new ExcepcionHorario();
        excepcion.setProfesional(profesional);
        excepcion.setFechaEspecifica(fecha.toLocalDate());
        excepcion.setTipo(tipo);
        excepcion.setHoraInicio(LocalTime.parse(horaInicio));
        excepcion.setHoraFin(LocalTime.parse(horaFin));
        excepcionHorarioRepository.save(excepcion);
    }

    private void createResena(Usuario cliente, Cita cita, int calificacion, String comentario) {
        Resena resena = new Resena();
        resena.setCliente(cliente);
        resena.setCita(cita);
        resena.setCalificacion(calificacion);
        resena.setComentario(comentario);
        resena.setFechaCreacion(LocalDateTime.now());
        resenaRepository.save(resena);
    }

    private Cita createCita(Usuario cliente, Negocio negocio, Profesional profesional, Servicio servicio, LocalDateTime fechaHoraInicio, String estado, String notas) {
        Cita cita = new Cita();
        cita.setCliente(cliente);
        cita.setNegocio(negocio);
        cita.setProfesional(profesional);
        cita.setServicio(servicio);
        cita.setFechaHoraInicio(fechaHoraInicio.withSecond(0).withNano(0));
        cita.setFechaHoraFin(fechaHoraInicio.plusMinutes(servicio.getDuracionEstimada()).withSecond(0).withNano(0));
        cita.setEstado(estado);
        cita.setPrecioFinal(servicio.getPrecio());
        cita.setNotasPromocion(notas);
        return cita;
    }

    private GaleriaNegocio createGaleria(Negocio negocio, String url, String descripcion) {
        GaleriaNegocio foto = new GaleriaNegocio();
        foto.setNegocio(negocio);
        foto.setUrlImagen(url);
        foto.setDescripcion(descripcion);
        return foto;
    }
}
