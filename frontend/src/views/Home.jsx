import bannerEventos from "../assets/banner-eventos.jpg";
import "./Home.css"

function Home() {
    return(
        <>
        <section className="banner-eventos">
            <img
                src={bannerEventos}
                alt="Banner"
                className="banner-eventos-img"
            />
        <div className="banner-eventos-content">
            <span className="barra-amarilla"></span>
            <h1>Eventos</h1>
        </div>
        </section>
        
        </>
    );
}

export default Home;