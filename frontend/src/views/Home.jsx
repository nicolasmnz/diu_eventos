import { useState } from "react";
import DropdownCheckbox from "../components/DropdownCheckbox";
import EventCard from "../components/EventCard";

import "./Home.css";

import bannerEventos from "../assets/banner-eventos.jpg";
import arch from "../assets/arch.webp";
import asamblea from "../assets/asamblea.jpeg";
import meado from "../assets/images.jpeg";

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
      <main className="eventos-main">
        <section className="eventos-grid">
          <EventCard
            img={asamblea}
            title="Asamblea Recurrente: Centro de Estudiantes Informatica"
            date={["26-05-2026"]}
            ubication="Campus San Joaquín"
            modalidad="Presencial"
          />
          <EventCard
            img={arch}
            title="Asamblea: Linux & OpenSource"
            date={["28-05-2026"]}
            ubication="Campus San Joaquín"
            modalidad="Presencial"
          />
          <EventCard
            img={meado}
            title="1ra convención de Meado Artístico"
            date={["30-05-2026"]}
            ubication="Campus Casa Central Valparaíso"
            modalidad="Presencial"
          />
        </section>
      </main>
    </>
  );
}

export default Home;
