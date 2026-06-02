import { useEffect, useRef, useState } from "react";
import { FunnelX } from "lucide-react";

import DropdownCheckbox from "./DropdownCheckbox.jsx";
import DateFilter from "./DateFilter.jsx";

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

  fechaSeleccionada,
  setFechaSeleccionada,

  busqueda,
  setBusqueda,

  onLimpiarFiltros,
}) {
  const sentinelRef = useRef(null);
  const [modoSticky, setModoSticky] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setModoSticky(!entry.isIntersecting);
      },
      { threshold: 0 },
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
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
          />

          <DropdownCheckbox
            titulo="Modalidad"
            etiquetaCantidad="modalidades"
            etiquetaTodos="Todas las modalidades"
            opciones={tipos}
            seleccionados={tiposSeleccionados}
            setSeleccionados={setTiposSeleccionados}
          />

          <DropdownCheckbox
            titulo="Temática"
            etiquetaCantidad="temáticas"
            etiquetaTodos="Todas las temáticas"
            opciones={tematicas}
            seleccionados={tematicasSeleccionadas}
            setSeleccionados={setTematicasSeleccionadas}
          />

          {modoSticky && (
            <DateFilter
              fechaSeleccionada={fechaSeleccionada}
              setFechaSeleccionada={setFechaSeleccionada}
            />
          )}

          <button
            type="button"
            className="clear-filters-button"
            onClick={onLimpiarFiltros}
          >
            <FunnelX />
          </button>
        </div>
      </section>
    </>
  );
}

export default StickyFilters;
