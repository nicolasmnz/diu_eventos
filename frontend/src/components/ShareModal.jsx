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

function ShareModal({ abierto, onCerrar, titulo, url }) {
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
          <button type="button">
            <FaEnvelope size={21} strokeWidth={2.2} />
          </button>
          <button type="button">
            <FaLinkedinIn size={22} strokeWidth={2.2} />
          </button>
          <button type="button">
            <FaXTwitter size={22} strokeWidth={2.2} />
          </button>
          <button type="button">
            <FaWhatsapp size={25} strokeWidth={2.2} />
          </button>
          <button type="button">
            <FaInstagram size={25} strokeWidth={2.2} />
          </button>
          <button type="button">
            <FaFacebook size={23} strokeWidth={2.2} />
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
