import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { Copy } from "lucide-react";
import {
  FaEnvelope,
  FaLinkedinIn,
  FaInstagram,
  FaWhatsapp,
  FaFacebook,
} from "react-icons/fa";

import { FaXTwitter } from "react-icons/fa6";

import "./ShareModal.css";

function ShareModal({ abierto, onCerrar, titulo, texto, url }) {
  const urlRef = useRef(null);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    if (!abierto) return;

    function cerrarConEscape(event) {
      if (event.key === "Escape") {
        onCerrar();
      }
    }

    document.addEventListener("keydown", cerrarConEscape);
    return () => document.removeEventListener("keydown", cerrarConEscape);
  }, [abierto, onCerrar]);

  if (!abierto) return null;

  /*prepara el texto para WhatsApp, LinkedIn y el menú nativo.*/
  const textoCompartir = texto || `Revisa este evento: ${titulo}`;
  const textoConUrl = `${textoCompartir}\n${url}`;

  const textoCodificado = encodeURIComponent(textoConUrl);
  const urlCodificada = encodeURIComponent(url);

  async function copiarLink() {
    try {
      await navigator.clipboard.writeText(url);

      const selection = window.getSelection();
      const range = document.createRange();

      range.selectNodeContents(urlRef.current);
      selection.removeAllRanges();
      selection.addRange(range);

      setCopiado(true);

      setTimeout(() => {
        setCopiado(false);
        selection.removeAllRanges();
      }, 2000);
    } catch {
      console.log("No se pudo copiar el enlace");
    }
  }

  function abrirVentanaCompartir(urlCompartir) {
    window.open(urlCompartir, "_blank", "noopener,noreferrer");
  }

  function compartirPorCorreo() {
    const asunto = encodeURIComponent(`Evento: ${titulo}`);
    const cuerpo = encodeURIComponent(textoConUrl);

    window.location.href = `mailto:?subject=${asunto}&body=${cuerpo}`;
  }

  function compartirPorLinkedIn() {
    abrirVentanaCompartir(
      `https://www.linkedin.com/sharing/share-offsite/?url=${urlCodificada}`,
    );
  }

  function compartirPorX() {
    abrirVentanaCompartir(
      `https://x.com/intent/tweet?text=${encodeURIComponent(
        textoCompartir,
      )}&url=${urlCodificada}`,
    );
  }

  function compartirPorWhatsapp() {
    abrirVentanaCompartir(`https://wa.me/?text=${textoCodificado}`);
  }

  function compartirPorFacebook() {
    abrirVentanaCompartir(
      `https://www.facebook.com/sharer/sharer.php?u=${urlCodificada}`,
    );
  }

  async function compartirPorInstagram() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: titulo,
          text: textoCompartir,
          url,
        });

        return;
      } catch {
        /*
        Puede fallar si el usuario cancela el menú de compartir.
        En ese caso usamos copiarLink como respaldo.
      */
      }
    }

    await copiarLink();
  }

  return createPortal(
    <div className="share-modal-backdrop" onClick={onCerrar}>
      <section
        className="share-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="share-modal-close"
          onClick={onCerrar}
          aria-label="Cerrar modal"
        >
          ×
        </button>

        <header className="share-modal-header">
          <h2 id="share-modal-title">Compartir evento</h2>
          <p>{titulo}</p>
        </header>

        <div className="share-modal-options">
          <button
            type="button"
            onClick={compartirPorCorreo}
            aria-label="Compartir por correo"
            title="Correo"
          >
            <FaEnvelope size={21} />
          </button>

          <button
            type="button"
            onClick={compartirPorLinkedIn}
            aria-label="Compartir en LinkedIn"
            title="LinkedIn"
          >
            <FaLinkedinIn size={22} />
          </button>

          <button
            type="button"
            onClick={compartirPorX}
            aria-label="Compartir en X"
            title="X"
          >
            <FaXTwitter size={22} />
          </button>

          <button
            type="button"
            onClick={compartirPorWhatsapp}
            aria-label="Compartir por WhatsApp"
            title="WhatsApp"
          >
            <FaWhatsapp size={25} />
          </button>

          <button
            type="button"
            onClick={compartirPorInstagram}
            aria-label="Compartir en Instagram"
            title="Instagram"
          >
            <FaInstagram size={25} />
          </button>

          <button
            type="button"
            onClick={compartirPorFacebook}
            aria-label="Compartir en Facebook"
            title="Facebook"
          >
            <FaFacebook size={23} />
          </button>
        </div>
        <div className="share-modal-link">
          <span ref={urlRef}>{url}</span>
          <button type="button" onClick={copiarLink}>
            <Copy size={18} strokeWidth={2.2} />
          </button>
        </div>
      </section>
      {copiado && (
        <div className="copy-toast" role="status">
          Se copió en el portapapeles
        </div>
      )}
    </div>,
    document.body,
  );
}

export default ShareModal;
