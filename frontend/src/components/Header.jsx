import "./Header.css";

import logoUsm from "../assets/logo-usm_blanco.svg";

function Header() {
  return (
    <header
      className="site-header"
    >

      <div className="site-header-container">
        <a href="/" className="site-header-logo">
          <img
            src={logoUsm}
            alt="Universidad Técnica Federico Santa María"
          />
        </a>

        <nav className="site-header-nav" aria-label="Navegación principal">
          <a href="/">Inicio</a>

          <a href="/universidad" className="nav-item-dropdown">
            Universidad
            <span className="nav-arrow">⌄</span>
          </a>

          <a href="/admision" className="nav-item-dropdown">
            Admisión
            <span className="nav-arrow">⌄</span>
          </a>

          <a href="/investigacion" className="nav-item-dropdown">
            Investigación
            <span className="nav-arrow">⌄</span>
          </a>

          <a href="/extension" className="nav-item-dropdown">
            Extensión y Cultura
            <span className="nav-arrow">⌄</span>
          </a>

          <button
            type="button"
            className="site-header-search"
            aria-label="Buscar"
          >
            🔍
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;