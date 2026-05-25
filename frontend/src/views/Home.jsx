import { useState } from "react";
import DropdownCheckbox from "../components/DropdownCheckbox";

import "./Home.css";

import bannerEventos from "../assets/banner-eventos.jpg";

function Home() {
  const sedes = [
    "Casa Central Valparaíso",
    "Campus San Joaquín",
    "Campus Vitacura",
    "Sede Viña del Mar",
    "Sede Concepción",
    "Externo",
  ];
  const tipos = ["Presencial", "Online", "Híbrido"];
  const [sedesSeleccionadas, setSedesSeleccionadas] = useState(sedes);
  const [tiposSeleccionados, setTiposSeleccionados] = useState(tipos);
  return (
    <>
      <section className="banner-eventos">
        <img src={bannerEventos} alt="Banner" className="banner-eventos-img" />
        <div className="banner-eventos-content">
          <span className="barra-amarilla"></span>
          <h1>Eventos</h1>
        </div>
      </section>
      <main className="eventos-main">
        <section className="filtros-eventos" aria-label="Filtros de eventos">
          <DropdownCheckbox
            titulo="Ubicación"
            etiquetaCantidad="ubicaciones"
            etiquetaTodos="Todos los emplazamientos"
            opciones={sedes}
            seleccionados={sedesSeleccionadas}
            setSeleccionados={setSedesSeleccionadas}
          />

          <DropdownCheckbox
            titulo="Tipo de modalidad"
            etiquetaCantidad="modalidades"
            etiquetaTodos="Todas las modalidades"
            opciones={tipos}
            seleccionados={tiposSeleccionados}
            setSeleccionados={setTiposSeleccionados}
          />
        </section>
      </main>
    </>
  );
}

export default Home;
