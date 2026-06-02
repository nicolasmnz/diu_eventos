import {
  FaEnvelope,
  FaLinkedinIn,
  FaInstagram,
  FaWhatsapp,
  FaFacebook,
} from "react-icons/fa";

import "./Footer.css";
import logo from "../assets/usm22.svg";

function Footer() {
  return (
    <footer className="site-footer">
      <section className="footer-main">
        <div className="footer-main-container">
          <div className="footer-column">
            <h3>
              <a href="#" className="footer-title-link">
                Conoce nuestra universidad
              </a>
            </h3>

            <h3>
              <a href="#" className="footer-title-link">
                Campus y sedes
              </a>
            </h3>
          </div>

          <div className="footer-column">
            <h3>
              <a href="#" className="footer-title-link">
                Cultura de nuestra universidad
              </a>
            </h3>

            <h3>
              <a href="#" className="footer-title-link">
                Nuestros servicios
              </a>
            </h3>

            <a href="#" className="footer-emergency">
              ☎ Números de emergencia
            </a>
          </div>

          <div className="footer-column footer-brand-column">
            <a href="#" className="footer-logo-link">
              <img
                src={logo}
                alt="Universidad Técnica Federico Santa María"
                className="footer-logo"
              />
            </a>

            <div className="footer-socials">
              <button type="button" aria-label="Facebook">
                <FaFacebook size={23} />
              </button>

              <button type="button" aria-label="Correo electrónico">
                <FaEnvelope size={23} />
              </button>

              <button type="button" aria-label="Instagram">
                <FaInstagram size={23} />
              </button>

              <button type="button" aria-label="LinkedIn">
                <FaLinkedinIn size={23} />
              </button>

              <button type="button" aria-label="WhatsApp">
                <FaWhatsapp size={23} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
}

export default Footer;