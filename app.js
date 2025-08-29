// === Configuración básica ===
// Reemplaza estos enlaces por los de tu clienta
const PHONE_WHATSAPP = "50377259636" // solo dígitos con código país (ej. El Salvador 503)
const LINK_FACEBOOK  = "https://www.facebook.com/share/1FDWvXpttZ/?mibextid=wwXIfr";
const LINK_INSTAGRAM = "https://www.instagram.com/tripeando_25?igsh=MWRkMG01bjc2dmJuaQ==";

// Utilidad: construir enlace de WhatsApp con texto
function buildWhatsAppURL(texto){
  const base = "https://wa.me/" + PHONE_WHATSAPP;
  const msg  = "?text=" + encodeURIComponent(texto);
  return base + msg;
}

// Año dinámico
document.getElementById("year").textContent = new Date().getFullYear();

// Inyectar redes
document.getElementById("facebookLink").href = LINK_FACEBOOK;
document.getElementById("instagramLink").href = LINK_INSTAGRAM;

// Botón header a WhatsApp sin viaje específico
const headerMsg = "Hola, vengo del sitio web. Quisiera información de próximos viajes grupales abiertos.";
document.getElementById("whatsappHeader").href = buildWhatsAppURL(headerMsg);
document.getElementById("whatsappFooter").href = buildWhatsAppURL(headerMsg);

// Menú responsive
const btnToggle = document.querySelector(".nav-toggle");
const menu = document.getElementById("menu");
btnToggle?.addEventListener("click", ()=>{
  const open = menu.style.display === "flex";
  menu.style.display = open ? "none" : "flex";
  btnToggle.setAttribute("aria-expanded", String(!open));
});

// Scroll suave
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener("click", e=>{
    const id = a.getAttribute("href");
    if(id && id.length>1){
      e.preventDefault();
      document.querySelector(id)?.scrollIntoView({behavior:"smooth"});
      menu.style.display = "none";
    }
  });
});


// Modal de detalles
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const modalCotizar = document.getElementById("modalCotizar");
document.getElementById("closeModal").addEventListener("click", ()=> modal.close());

document.querySelectorAll(".ver-detalle").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    const card = btn.closest(".card");
    const nombre = btn.dataset.trip || card.querySelector("h3").textContent.trim();
    const pais = card.dataset.pais;
    const days = card.dataset.days || "?";
    const nights = card.dataset.nights || "?";
    modalTitle.textContent = nombre;

    modalBody.innerHTML = `
      <p><strong>Tipo:</strong> Viaje grupal abierto al público</p>
      <p><strong>Duración:</strong> ${days} día(s) / ${nights} noche(s)</p>
      <p><strong>País:</strong> ${pais}</p>
      <ul>
        <li>Incluye transporte compartido según ruta del día.</li>
        <li>Entradas a todos los destinos turísticos</li>
        <li>1 noche de hospedaje en Airbnb.</li>
        <li>Traslados internos durante el tour</li>
        <li>Prechequeo migratorio</li>
        <li> Snack de bienvenida</li>
      </ul>
      <p><em>Escríbenos para precios, fechas y punto de salida.</em></p>
    `;

    modalCotizar.onclick = ()=>{
      const texto = `Hola , quiero cotizar el viaje: ${nombre}. ¿Fechas disponibles y precio por persona?`;
      window.open(buildWhatsAppURL(texto), "_blank");
    };

    modal.showModal();
  });
});

// Cotizar directo desde tarjeta
// Cotizar directo desde tarjeta (incluye fecha si existe)
document.querySelectorAll(".cotizar").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    const card   = btn.closest(".card");
    const nombre = btn.dataset.trip || card?.dataset.title || "viaje";
    // 1) Primero intenta leer data-date
    let fecha = card?.dataset.date || "";

    // 2) Plan B: si no hay data-date, intenta extraerla del texto en .meta (ej: "Fecha: ...")
    if(!fecha){
      const meta = card?.querySelector(".meta")?.innerText || "";
      const m = meta.match(/Fecha:\s*(.+)$/im);
      if(m && m[1]) fecha = m[1].trim();
    }

    const texto = `Hola , vengo de la página web y me gustaría más información sobre el viaje "${nombre}"${fecha ? ` del ${fecha}` : ""}.`;
    window.open(buildWhatsAppURL(texto), "_blank");
  });
});


// Formulario: enviar a WhatsApp
document.getElementById("contactForm").addEventListener("submit", (e)=>{
  e.preventDefault();
  const nombre = document.getElementById("nombre").value.trim();
  const mensaje = document.getElementById("mensaje").value.trim();
  if(!nombre || !mensaje) return;
  const texto = `Hola, soy ${nombre}. ${mensaje}`;
  window.open(buildWhatsAppURL(texto), "_blank");
});

// Accesibilidad: cerrar modal con Esc
window.addEventListener("keydown", (e)=>{ if(e.key==="Escape" && modal.open) modal.close(); });
