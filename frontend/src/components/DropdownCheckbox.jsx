import { useState } from "react";
import "./DropdownCheckbox.css";

function DropdownCheckbox({
  titulo,
  etiquetaCantidad,
  etiquetaTodos,
  opciones,
  seleccionados,
  setSeleccionados,
}) {
  const [abierto, setAbierto] = useState(false);
  const [interactuado, setInteractuado] = useState(false);

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

  return (
    <fieldset className="dropdown">
      <legend className="dropdown-legend">{titulo}</legend>
      <button
        type="button"
        className="dropdown-button"
        onClick={() => setAbierto(!abierto)}
      >
        <span className="dropdown-button-text">{obtenerTextoBoton()}</span>
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
