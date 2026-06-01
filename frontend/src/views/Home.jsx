import { useState } from "react";
//import DropdownCheckbox from "../components/DropdownCheckbox.jsx";
import EventCard from "../components/EventCard.jsx";
import Header from "../components/Header.jsx";
import MiniCalendar from "../components/MiniCalendar.jsx";
import StickyFilters from "../components/StickyFilters.jsx";

import "./Home.css";

import bannerEventos from "../assets/banner-eventos.jpg";

import PAES from "../assets/Ensayo-PAES-agosto.jpg";
import vivienda from "../assets/Operativo-vivienda-USM-viña.jpg";
import data from "../assets/datafrontiers-2026-scaled.jpg";
import conciertoPatrimonio from "../assets/concierto-dia-patrimonio.jpg";

function Home() {
  const [busqueda, setBusqueda] = useState("");

  const sedes = [
    "Casa Central Valparaíso",
    "Campus San Joaquín",
    "Campus Vitacura",
    "Sede Viña del Mar",
    "Sede Concepción",
    "Externo",
  ];
  const tipos = ["Presencial", "Online", "Híbrido"];
  const tematicas = [
    "Musica",
    "Congreso",
    "Operativos",
    "Educacion",
    "Charlas",
  ];

  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);

  const [sedesSeleccionadas, setSedesSeleccionadas] = useState(sedes);
  const [tiposSeleccionados, setTiposSeleccionados] = useState(tipos);
  const [tematicaSeleccionados, setTematicaSeleccionados] = useState(tematicas);
  return (
    <>
      <Header />
      <section className="banner-eventos">
        <img src={bannerEventos} alt="Banner" className="banner-eventos-img" />
        <div className="banner-tools">
          <form className="banner-search" role="search">
            <div className="search-box">
              <input
                id="buscar-eventos"
                type="search"
                placeholder="Buscar por nombre, temática, campus o modalidad"
              />

              <button type="submit">Buscar</button>
            </div>
          </form>

          <div className="mini-calendar">
            <MiniCalendar
              fechaSeleccionada={fechaSeleccionada}
              setFechaSeleccionada={setFechaSeleccionada}
            />
          </div>
        </div>
      </section>

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
      />

      <main className="eventos-main">
        <section className="eventos-grid">
          <EventCard
            img={PAES}
            title="Ciclo Ensayo PAES 2026"
            date="26-05-2026"
            hora=""
            ubication="Todos los emplazamientos"
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
