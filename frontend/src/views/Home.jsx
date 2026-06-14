import { useEffect, useMemo, useRef, useState } from "react";
import { API_URL } from "../config/api.js";

import { BadgeAlert, BadgeX } from "lucide-react";

import EventCard from "../components/EventCard.jsx";
import Header from "../components/Header.jsx";
import MiniCalendar from "../components/MiniCalendar.jsx";
import StickyFilters from "../components/StickyFilters.jsx";
import Footer from "../components/Footer.jsx";

import "./Home.css";

import bannerEventos from "../assets/banner-eventos.jpg";

function obtenerUnicos(lista) {
  return [...new Set(lista.filter(Boolean))].sort();
}

function normalizarTexto(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function fechaEstaEnRango(fechaSeleccionada, fechaInicio, fechaTermino) {
  if (!fechaSeleccionada) {
    return true;
  }

  const termino = fechaTermino || fechaInicio;

  return fechaSeleccionada >= fechaInicio && fechaSeleccionada <= termino;
}

function Home() {
  const snapEnCursoRef = useRef(false);

  const gestoRef = useRef({
    yInicial: null,
    indiceInicial: 0,
    direccion: 0,
    activo: false,
  });

  const [eventos, setEventos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const [busqueda, setBusqueda] = useState("");
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);

  const [sedesSeleccionadas, setSedesSeleccionadas] = useState([]);
  const [tiposSeleccionados, setTiposSeleccionados] = useState([]);
  const [tematicaSeleccionados, setTematicaSeleccionados] = useState([]);

  const [homeStateListo, setHomeStateListo] = useState(false);
  const [homeRestaurado, setHomeRestaurado] = useState(false);

  const sedes = useMemo(
    () =>
      obtenerUnicos(
        eventos
          .flatMap((evento) => evento.ubicaciones ?? [])
          .filter((ubicacion) => ubicacion !== "Todos"),
      ),
    [eventos],
  );

  const tipos = useMemo(
    () => obtenerUnicos(eventos.map((evento) => evento.modalidad)),
    [eventos],
  );

  const tematicas = useMemo(
    () => obtenerUnicos(eventos.flatMap((evento) => evento.tematicas ?? [])),
    [eventos],
  );

  useEffect(() => {
    async function cargarEventos() {
      try {
        const respuesta = await fetch(`${API_URL}/eventos`);

        if (!respuesta.ok) {
          throw new Error("No se pudieron cargar los eventos.");
        }

        const data = await respuesta.json();
        setEventos(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setCargando(false);
      }
    }

    cargarEventos();
  }, []);

  /*
    Restaura los filtros y la posición del scroll cuando el usuario
    vuelve desde el detalle de un evento.
  */
  useEffect(() => {
    if (eventos.length === 0) {
      return;
    }

    let cancelado = false;

    requestAnimationFrame(() => {
      if (cancelado) {
        return;
      }

      const debeRestaurar =
        sessionStorage.getItem("restaurarHomeEventos") === "true";

      const estadoGuardado = sessionStorage.getItem("homeEventosState");

      if (debeRestaurar && estadoGuardado) {
        try {
          const estado = JSON.parse(estadoGuardado);

          setBusqueda(estado.busqueda ?? "");
          setFechaSeleccionada(estado.fechaSeleccionada ?? null);

          setSedesSeleccionadas(estado.sedesSeleccionadas ?? sedes);
          setTiposSeleccionados(estado.tiposSeleccionados ?? tipos);
          setTematicaSeleccionados(estado.tematicaSeleccionados ?? tematicas);

          setHomeRestaurado(true);

          requestAnimationFrame(() => {
            window.scrollTo(0, estado.scrollY ?? 0);
          });
        } catch {
          sessionStorage.removeItem("homeEventosState");
        }

        sessionStorage.removeItem("restaurarHomeEventos");
      } else {
        setSedesSeleccionadas(sedes);
        setTiposSeleccionados(tipos);
        setTematicaSeleccionados(tematicas);
      }

      setHomeStateListo(true);
    });

    return () => {
      cancelado = true;
    };
  }, [eventos.length, sedes, tipos, tematicas]);

  /*
    Guarda automáticamente el estado actual mientras el usuario
    permanece en la página.
  */
  useEffect(() => {
    if (!homeStateListo) {
      return;
    }

    function guardarEstado() {
      sessionStorage.setItem(
        "homeEventosState",
        JSON.stringify({
          busqueda,
          fechaSeleccionada,
          sedesSeleccionadas,
          tiposSeleccionados,
          tematicaSeleccionados,
          scrollY: window.scrollY,
        }),
      );
    }

    window.addEventListener("scroll", guardarEstado);

    guardarEstado();

    return () => {
      window.removeEventListener("scroll", guardarEstado);
    };
  }, [
    homeStateListo,
    busqueda,
    fechaSeleccionada,
    sedesSeleccionadas,
    tiposSeleccionados,
    tematicaSeleccionados,
  ]);

  const eventosParaCalendario = eventos.filter((evento) => {
    const textoEvento = normalizarTexto(`
    ${evento.nombre}
    ${evento.descripcion}
    ${evento.lugar ?? ""}
    ${evento.modalidad}
    ${(evento.ubicaciones ?? []).join(" ")}
    ${(evento.tematicas ?? []).join(" ")}
  `);

    const coincideBusqueda = textoEvento.includes(normalizarTexto(busqueda));

    const coincideSede =
      (evento.ubicaciones ?? []).includes("Todos") ||
      (evento.ubicaciones ?? []).some((ubicacion) =>
        sedesSeleccionadas.includes(ubicacion),
      );

    const coincideModalidad = tiposSeleccionados.includes(evento.modalidad);

    const coincideTematica = (evento.tematicas ?? []).some((tematica) =>
      tematicaSeleccionados.includes(tematica),
    );

    return (
      coincideBusqueda && coincideSede && coincideModalidad && coincideTematica
    );
  });

  const eventosFiltrados = eventosParaCalendario.filter((evento) =>
    fechaEstaEnRango(
      fechaSeleccionada,
      evento.fechaInicio,
      evento.fechaTermino,
    ),
  );

  useEffect(() => {
    const esMobile = window.matchMedia("(max-width: 600px)").matches;

    if (!esMobile) {
      return;
    }

    function obtenerAlturaSticky() {
      const valor = getComputedStyle(document.documentElement)
        .getPropertyValue("--mobile-sticky-height")
        .replace("px", "")
        .trim();

      return Number(valor) || 136;
    }

    function obtenerPaneles() {
      return Array.from(document.querySelectorAll(".event-snap-panel"));
    }

    function esElementoInteractivo(target) {
      return Boolean(
        target.closest(
          "button, input, textarea, select, a, .dropdown-menu, .dropdown-button, .event-filters-sticky",
        ),
      );
    }

    function obtenerIndiceMasCercano() {
      const alturaSticky = obtenerAlturaSticky();
      const paneles = obtenerPaneles();

      let indiceMasCercano = 0;
      let menorDistancia = Infinity;

      paneles.forEach((panel, index) => {
        const distancia = Math.abs(
          panel.getBoundingClientRect().top - alturaSticky,
        );

        if (distancia < menorDistancia) {
          menorDistancia = distancia;
          indiceMasCercano = index;
        }
      });

      return indiceMasCercano;
    }

    function moverATarjeta(indice) {
      const alturaSticky = obtenerAlturaSticky();
      const paneles = obtenerPaneles();

      if (!paneles[indice]) {
        return;
      }

      const destino =
        window.scrollY +
        paneles[indice].getBoundingClientRect().top -
        alturaSticky;

      snapEnCursoRef.current = true;

      window.scrollTo({
        top: destino,
        behavior: "smooth",
      });

      window.setTimeout(() => {
        snapEnCursoRef.current = false;
      }, 420);
    }

    function manejarTouchStart(event) {
      if (snapEnCursoRef.current) {
        return;
      }

      if (esElementoInteractivo(event.target)) {
        gestoRef.current = {
          yInicial: null,
          indiceInicial: 0,
          direccion: 0,
          activo: false,
        };

        return;
      }

      const paneles = obtenerPaneles();

      if (paneles.length === 0) {
        return;
      }

      const alturaSticky = obtenerAlturaSticky();
      const primerPanelTop = paneles[0].getBoundingClientRect().top;

      /*
      Si todavía estás en header/banner, dejamos que el scroll normal
      baje la página y active el sticky. No intervenimos todavía.
    */
      if (primerPanelTop > alturaSticky + 80) {
        gestoRef.current = {
          yInicial: null,
          indiceInicial: 0,
          direccion: 0,
          activo: false,
        };

        return;
      }

      gestoRef.current = {
        yInicial: event.touches[0].clientY,
        indiceInicial: obtenerIndiceMasCercano(),
        direccion: 0,
        activo: true,
      };
    }

    function manejarTouchMove(event) {
      if (!gestoRef.current.activo || gestoRef.current.yInicial === null) {
        return;
      }

      const paneles = obtenerPaneles();

      if (paneles.length === 0) {
        return;
      }

      const yActual = event.touches[0].clientY;
      const diferencia = gestoRef.current.yInicial - yActual;

      if (Math.abs(diferencia) < 14) {
        return;
      }

      const direccion = diferencia > 0 ? 1 : -1;
      const indiceInicial = gestoRef.current.indiceInicial;

      /*
      Si estás en la primera tarjeta y haces gesto hacia arriba,
      dejamos volver naturalmente al banner/header.
    */
      if (indiceInicial === 0 && direccion === -1) {
        gestoRef.current.activo = false;
        return;
      }

      /*
      Si estás en la última tarjeta y haces gesto hacia abajo,
      dejamos continuar hacia el footer.
    */
      if (indiceInicial === paneles.length - 1 && direccion === 1) {
        gestoRef.current.activo = false;
        return;
      }

      /*
      Esta línea es la importante:
      elimina la inercia nativa del navegador, para que un gesto fuerte
      no pueda saltarse varias tarjetas.
    */
      event.preventDefault();

      gestoRef.current.direccion = direccion;
    }

    function manejarTouchEnd() {
      if (!gestoRef.current.activo) {
        return;
      }

      const paneles = obtenerPaneles();

      if (paneles.length === 0) {
        return;
      }

      const { indiceInicial, direccion } = gestoRef.current;

      gestoRef.current = {
        yInicial: null,
        indiceInicial: 0,
        direccion: 0,
        activo: false,
      };

      if (direccion === 0) {
        return;
      }

      let indiceDestino = indiceInicial + direccion;

      if (indiceDestino < 0) {
        indiceDestino = 0;
      }

      if (indiceDestino >= paneles.length) {
        indiceDestino = paneles.length - 1;
      }

      moverATarjeta(indiceDestino);
    }

    window.addEventListener("touchstart", manejarTouchStart, {
      passive: true,
    });

    /*
    Este NO puede ser passive:true.
    Si es passive:true, preventDefault() no funciona y vuelve
    la inercia que hace saltar varias tarjetas.
  */
    window.addEventListener("touchmove", manejarTouchMove, {
      passive: false,
    });

    window.addEventListener("touchend", manejarTouchEnd, {
      passive: true,
    });

    return () => {
      window.removeEventListener("touchstart", manejarTouchStart);
      window.removeEventListener("touchmove", manejarTouchMove);
      window.removeEventListener("touchend", manejarTouchEnd);
    };
  }, [eventosFiltrados.length]);

  function limpiarFiltros() {
    setBusqueda("");
    setFechaSeleccionada(null);

    setSedesSeleccionadas(sedes);
    setTiposSeleccionados(tipos);
    setTematicaSeleccionados(tematicas);
  }

  function guardarEstadoHome() {
    sessionStorage.setItem("restaurarHomeEventos", "true");

    sessionStorage.setItem(
      "homeEventosState",
      JSON.stringify({
        busqueda,
        fechaSeleccionada,
        sedesSeleccionadas,
        tiposSeleccionados,
        tematicaSeleccionados,
        scrollY: window.scrollY,
      }),
    );
  }

  return (
    <>
      <Header />

      <section className="banner-eventos">
        <img src={bannerEventos} alt="Banner" className="banner-eventos-img" />

        <div className="banner-tools">
          <div className="banner-left-tools">
            <form
              className="banner-search"
              role="search"
              onSubmit={(event) => event.preventDefault()}
            >
              <div className="search-box">
                <input
                  id="buscar-eventos"
                  type="search"
                  placeholder="Buscar por nombre, temática, campus o modalidad"
                  value={busqueda}
                  onChange={(event) => setBusqueda(event.target.value)}
                />

                <button type="submit">Buscar</button>
              </div>
            </form>

            <StickyFilters
              sedes={sedes}
              tipos={tipos}
              tematicas={tematicas}
              sedesSeleccionadas={sedesSeleccionadas}
              setSedesSeleccionadas={setSedesSeleccionadas}
              tiposSeleccionados={tiposSeleccionados}
              setTiposSeleccionados={setTiposSeleccionados}
              tematicasSeleccionadas={tematicaSeleccionados}
              setTematicasSeleccionadas={setTematicaSeleccionados}
              busqueda={busqueda}
              setBusqueda={setBusqueda}
              fechaSeleccionada={fechaSeleccionada}
              setFechaSeleccionada={setFechaSeleccionada}
              onLimpiarFiltros={limpiarFiltros}
              mostrarSeleccionRestaurada={homeRestaurado}
            />
          </div>

          <div className="mini-calendar">
            <MiniCalendar
              fechaSeleccionada={fechaSeleccionada}
              setFechaSeleccionada={setFechaSeleccionada}
              eventos={eventosParaCalendario}
            />
          </div>
        </div>
      </section>

      <main className="eventos-main">
        {cargando && (
          <section className="event-status">
            <p>Cargando eventos...</p>
          </section>
        )}

        {error && (
          <section className="event-status event-status-error">
            <BadgeX size={42} strokeWidth={2.2} />
            <h2>No se pudieron cargar los eventos</h2>
            <p>{error}</p>
          </section>
        )}

        {!cargando && !error && eventosFiltrados.length === 0 && (
          <section className="event-status event-status-empty">
            <BadgeAlert size={42} strokeWidth={2.2} />
            <h2>No hay eventos disponibles</h2>
            <p>
              No existen eventos que coincidan con los filtros seleccionados.
            </p>
          </section>
        )}

        {!cargando && !error && eventosFiltrados.length > 0 && (
          <>
            <section className="eventos-grid">
              {eventosFiltrados.map((evento) => (
                <div key={evento.id} className="event-snap-panel">
                  <EventCard
                    evento={evento}
                    onAntesAbrirDetalle={guardarEstadoHome}
                  />
                </div>
              ))}
            </section>

            <div className="home-footer-snap">
              <Footer />
            </div>
          </>
        )}
      </main>
    </>
  );
}

export default Home;
