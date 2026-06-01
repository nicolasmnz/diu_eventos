import "./Header.css";

import logoUSM from "../assets/logo-horizontal.png";

function Header() {
  return (
    <header className="site-header">
      <section className="top-bar">
        <a href="/" className="top-logo">
          USM.cl
        </a>
      </section>

      <section className="main-header">
        <a href="/" className="brand">
          <span className="brand-logo-crop">
            <img src={logoUSM} alt="Universidad Técnica Federico Santa María" />
          </span>
        </a>

        <span className="header-divider"></span>

        <section className="header-section-title" aria-label="Seccion actual">
          <h1>EVENTOS</h1>
        </section>
      </section>
    </header>
  );
}

export default Header;
