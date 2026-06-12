import { useEffect, useRef, useState } from "react";
import { FunnelX } from "lucide-react";

import DropdownCheckbox from "./DropdownCheckbox.jsx";

import "./StickyFilters.css";

function StickyFilters({
  sedes,
  tipos,
  tematicas,

  sedesSeleccionadas,
  setSedesSeleccionadas,

  tiposSeleccionados,
  setTiposSeleccionados,

  tematicasSeleccionadas,
  setTematicasSeleccionadas,

  busqueda,
  setBusqueda,

  onLimpiarFiltros,
  mostrarSeleccionRestaurada,
  onStickyChange,
}) {
  const sentinelRef = useRef(null);
  const [modoSticky, setModoSticky] = useState(false);

  useEffect(() => {
    let ticking = false;

    function actualizarModoSticky() {
      const sentinel = sentinelRef.current;

      if (!sentinel) {
        ticking = false;
        return;
      }

      const topSentinel = sentinel.getBoundingClientRect().top;

      setModoSticky((modoActual) => {
        /*
        Activa sticky solo cuando el sentinel ya pasó
        un poco hacia arriba.
      */
        if (!modoActual && topSentinel <= -12) {
          return true;
        }

        /*
        Desactiva sticky solo cuando el sentinel volvió
        claramente hacia abajo.
      */
        if (modoActual && topSentinel >= 24) {
          return false;
        }

        return modoActual;
      });

      ticking = false;
    }

    function manejarScroll() {
      if (ticking) return;

      ticking = true;
      requestAnimationFrame(actualizarModoSticky);
    }

    window.addEventListener("scroll", manejarScroll, { passive: true });
    window.addEventListener("resize", manejarScroll);

    actualizarModoSticky();

    return () => {
      window.removeEventListener("scroll", manejarScroll);
      window.removeEventListener("resize", manejarScroll);
    };
  }, []);

  useEffect(() => {
    onStickyChange?.(modoSticky);
  }, [modoSticky, onStickyChange]);

  return (
    <div
      className={`event-filters-wrapper ${
        modoSticky ? "event-filters-wrapper-sticky" : ""
      }`}
    >
      <div ref={sentinelRef} className="filters-sentinel"></div>

      <section
        className={`event-filters ${modoSticky ? "event-filters-sticky" : ""}`}
        aria-label="Filtros de eventos"
      >
        {modoSticky && (
          <form
            className="event-filters-search"
            role="search"
            onSubmit={(event) => event.preventDefault()}
          >
            <input
              type="search"
              placeholder="Buscar por nombre, temática, campus o modalidad"
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
            />
          </form>
        )}

        <div className="event-filters-row">
          <DropdownCheckbox
            titulo="Ubicación"
            etiquetaCantidad="ubicaciones"
            etiquetaTodos="Todos los emplazamientos"
            opciones={sedes}
            seleccionados={sedesSeleccionadas}
            setSeleccionados={setSedesSeleccionadas}
            mostrarSeleccionRestaurada={mostrarSeleccionRestaurada}
          />

          <DropdownCheckbox
            titulo="Modalidad"
            etiquetaCantidad="modalidades"
            etiquetaTodos="Todas las modalidades"
            opciones={tipos}
            seleccionados={tiposSeleccionados}
            setSeleccionados={setTiposSeleccionados}
            mostrarSeleccionRestaurada={mostrarSeleccionRestaurada}
          />

          <DropdownCheckbox
            titulo="Temática"
            etiquetaCantidad="temáticas"
            etiquetaTodos="Todas las temáticas"
            opciones={tematicas}
            seleccionados={tematicasSeleccionadas}
            setSeleccionados={setTematicasSeleccionadas}
            mostrarSeleccionRestaurada={mostrarSeleccionRestaurada}
          />

          <button
            type="button"
            className="clear-filters-button"
            onClick={onLimpiarFiltros}
            aria-label="Limpiar filtros"
          >
            <FunnelX size={20} />
          </button>
        </div>
      </section>
    </div>
  );
}

export default StickyFilters;
