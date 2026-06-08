import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

import "./DropdownCheckbox.css";

function DropdownCheckbox({
  titulo,
  etiquetaCantidad,
  etiquetaTodos,
  opciones,
  seleccionados,
  setSeleccionados,
  mostrarSeleccionRestaurada = false,
}) {
  const [abierto, setAbierto] = useState(false);
  const [interactuado, setInteractuado] = useState(false);

  const dropdownRef = useRef(null);

  const todosSeleccionados = seleccionados.length === opciones.length;

  function manejarCambio(opcion) {
    setInteractuado(true);

    if (seleccionados.includes(opcion)) {
      setSeleccionados(seleccionados.filter((item) => item !== opcion));
    } else {
      setSeleccionados([...seleccionados, opcion]);
    }
  }

  function manejarTodos() {
    setInteractuado(true);

    if (todosSeleccionados) {
      setSeleccionados([]);
    } else {
      setSeleccionados(opciones);
    }
  }

  function obtenerTextoBoton() {
    if (!interactuado) {
      return titulo;
    }

    if (seleccionados.length === 0) {
      return titulo;
    }

    if (todosSeleccionados) {
      return etiquetaTodos;
    }

    if (seleccionados.length <= 2) {
      return seleccionados.join(", ");
    }

    return `${seleccionados.length} ${etiquetaCantidad} seleccionadas`;
  }

  /*
    Cierra el dropdown cuando el usuario hace clic
    fuera del componente.
  */
  useEffect(() => {
    function manejarClickFuera(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setAbierto(false);
      }
    }

    document.addEventListener("mousedown", manejarClickFuera);
    document.addEventListener("touchstart", manejarClickFuera);

    return () => {
      document.removeEventListener("mousedown", manejarClickFuera);
      document.removeEventListener("touchstart", manejarClickFuera);
    };
  }, []);

  /*
    También permite cerrar el menú presionando Escape.
  */
  useEffect(() => {
    function manejarEscape(event) {
      if (event.key === "Escape") {
        setAbierto(false);
      }
    }

    document.addEventListener("keydown", manejarEscape);

    return () => {
      document.removeEventListener("keydown", manejarEscape);
    };
  }, []);

  useEffect(() => {
    if (mostrarSeleccionRestaurada) {
      setInteractuado(true);
    }
  }, [mostrarSeleccionRestaurada]);

  return (
    <fieldset ref={dropdownRef} className="dropdown">
      <legend className="dropdown-legend">{titulo}</legend>

      <button
        type="button"
        className="dropdown-button"
        aria-expanded={abierto}
        onClick={() => setAbierto((estadoAnterior) => !estadoAnterior)}
      >
        <span className="dropdown-button-text">
          {obtenerTextoBoton()}
        </span>

        <ChevronDown
          size={18}
          strokeWidth={2.4}
          className={`dropdown-chevron ${abierto ? "open" : ""}`}
        />
      </button>

      {abierto && (
        <div className="dropdown-menu">
          <label className="dropdown-item dropdown-item-todos">
            <input
              type="checkbox"
              checked={todosSeleccionados}
              onChange={manejarTodos}
            />

            <span>{etiquetaTodos}</span>
          </label>

          <div className="dropdown-separador"></div>

          {opciones.map((opcion) => (
            <label key={opcion} className="dropdown-item">
              <input
                type="checkbox"
                checked={seleccionados.includes(opcion)}
                onChange={() => manejarCambio(opcion)}
              />

              <span>{opcion}</span>
            </label>
          ))}
        </div>
      )}
    </fieldset>
  );
}

export default DropdownCheckbox;