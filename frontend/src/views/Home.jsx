import { useState } from "react";
import DropdownCheckbox from "../components/DropdownCheckbox";
import EventCard from "../components/EventCard";

import "./Home.css";

import bannerEventos from "../assets/banner-eventos.jpg";

import PAES from "../assets/Ensayo-PAES-agosto.jpg";
import vivienda from "../assets/Operativo-vivienda-USM-viña.jpg";
import data from "../assets/datafrontiers-2026-scaled.jpg";
import conciertoPatrimonio from "../assets/concierto-dia-patrimonio.jpg";

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
            img={PAES}
            title="Ciclo Ensayo PAES 2026"
            date="26-05-2026"
            hora=""
            ubication="Todos"
            modalidad="Presencial"
            mainTheme="Educación"
          />
          <EventCard
            img={vivienda}
            title="Feria de la vivienda"
            date="02-06-2026"
            hora="11:00 AM"
            ubication="Sede Viña del Mar"
            modalidad="Presencial"
            mainTheme="Operativos"
          />
          <EventCard
            img={data}
            title="Data Science International Congress Data Frontiers"
            date="30-05-2026"
            hora="08:30 AM"
            ubication="Campus San Joaquín"
            modalidad="Presencial"
            mainTheme="Congreso"
          />
          <EventCard
            img={conciertoPatrimonio}
            title="Concierto Día del Patrimonio, músicas del mundo Congress Data Frontiers "
            date="31-05-2026"
            hora="12:30 PM"
            ubication="Externo"
            modalidad="Presencial"
            mainTheme="Música"
          />
        </section>
      </main>
    </>
  );
}

export default Home;
