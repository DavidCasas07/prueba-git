"use strict";

/* =========================================
   CONFIGURACIÓN DEL NEGOCIO
========================================= */


const CONFIG = {
    whatsapp: "573106460648",

    // El resto de la configuración continúa aquí...



    // Precios en pesos colombianos.
    services: [
        {
            id: "manicure",
            name: "Manicure tradicional",
            category: "Cuidado de manos",
            price: 25000,
            duration: 60,
            description:
                "Cuidado de tus uñas, limpieza y un acabado clásico.",
            image:
                "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80"
        },

        {
            id: "pedicure",
            name: "Pedicure tradicional",
            category: "Cuidado de pies",
            price: 30000,
            duration: 60,
            description:
                "Un momento de cuidado para tus pies y uñas.",
            image:
                "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=800&q=80"
        },

        {
            id: "semi-manos",
            name: "Semipermanente en manos",
            category: "Color y duración",
            // Pendiente confirmar si el precio es $40.000 o $45.000.
            price: null,
            priceLabel: "Precio por confirmar",
            duration: 60,
            description:
                "Un acabado brillante y elegante para tus manos.",
            image:
                "https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=800&q=80"
        },

        {
            id: "semi-pies",
            name: "Semipermanente en pies",
            category: "Color y duración",
            price: 45000,
            duration: 60,
            description:
                "Color y cuidado para lucir tus pies impecables.",
            image:
                "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=800&q=80"
        },

        {
            id: "press-on",
            name: "Press On",
            category: "Diseños personalizados",
            price: 80000,
            priceFrom: true,
            duration: null,
            description:
                "Uñas personalizadas. El precio depende del diseño.",
            image:
                "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80"
        }
    ]
};


/* =========================================
   ELEMENTOS DEL DOM
========================================= */

const elements = {
    servicesGrid: document.getElementById("services-grid"),

    menuToggle: document.getElementById("menu-toggle"),
    navMenu: document.getElementById("nav-menu"),

    modal: document.getElementById("booking-modal"),
    openBooking: document.getElementById("open-booking"),
    closeBooking: document.getElementById("close-booking"),

    bookingForm: document.getElementById("booking-form"),
    bookingService: document.getElementById("booking-service"),
    bookingDate: document.getElementById("booking-date"),
    bookingTime: document.getElementById("booking-time"),
    bookingSummary: document.getElementById("booking-summary"),

    contactWhatsapp: document.getElementById("contact-whatsapp"),

    toast: document.getElementById("toast")
};

let toastTimeout = null;
let lastFocusedElement = null;


/* =========================================
   UTILIDADES
========================================= */

function formatPrice(price) {
    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0
    }).format(price);
}


function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];
    });
}


function showToast(message) {
    elements.toast.textContent = message;
    elements.toast.classList.add("visible");

    clearTimeout(toastTimeout);

    toastTimeout = setTimeout(() => {
        elements.toast.classList.remove("visible");
    }, 4000);
}


function getService(serviceId) {
    return CONFIG.services.find(service => service.id === serviceId);
}


function getServicePriceLabel(service) {
    if (service.price === null || service.price === undefined) {
        return service.priceLabel || "Precio por confirmar";
    }

    if (service.priceFrom) {
        return `Desde ${formatPrice(service.price)}`;
    }

    return formatPrice(service.price);
}


function getServiceDurationLabel(service) {
    if (!service.duration) {
        return "Duración por confirmar";
    }

    return `${service.duration} minutos`;
}


/* =========================================
   GENERAR CATÁLOGO
========================================= */

function renderServices() {
    elements.servicesGrid.innerHTML = CONFIG.services.map(
        (service, index) => `
            <article class="service-card">

                <div class="service-image-wrap">

                    <img
                        class="service-image"
                        src="${escapeHTML(service.image)}"
                        alt="${escapeHTML(service.name)}"
                        loading="lazy"
                    >

                    <span class="service-number">
                        ${String(index + 1).padStart(2, "0")}
                    </span>

                </div>

                <div class="service-content">

                    <span class="service-category">
                        ${escapeHTML(service.category)}
                    </span>

                    <h3>
                        ${escapeHTML(service.name)}
                    </h3>

                    <p class="service-description">
                        ${escapeHTML(service.description)}
                    </p>

                    <div class="service-meta">

                        <span class="service-price">
                            ${escapeHTML(getServicePriceLabel(service))}
                        </span>

                        <span class="service-duration">
                            ◷ ${escapeHTML(getServiceDurationLabel(service))}
                        </span>

                    </div>

                    <button
                        class="service-button"
                        type="button"
                        data-book-service="${escapeHTML(service.id)}"
                    >
                        Solicitar este servicio ↗
                    </button>

                </div>

            </article>
        `
    ).join("");

    elements.bookingService.innerHTML = `
        <option value="">Selecciona un servicio</option>
        ${CONFIG.services.map(service => `
            <option value="${escapeHTML(service.id)}">
                ${escapeHTML(service.name)}
            </option>
        `).join("")}
    `;
}


/* =========================================
   MENÚ MÓVIL
========================================= */

function closeMobileMenu() {
    elements.navMenu.classList.remove("open");
    elements.menuToggle.setAttribute("aria-expanded", "false");
    elements.menuToggle.setAttribute("aria-label", "Abrir menú");
    elements.menuToggle.textContent = "☰";
}


elements.menuToggle.addEventListener("click", () => {
    const isOpen = elements.navMenu.classList.toggle("open");

    elements.menuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
    );

    elements.menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Cerrar menú" : "Abrir menú"
    );

    elements.menuToggle.textContent = isOpen ? "×" : "☰";
});


elements.navMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMobileMenu);
});


document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeBookingModal();
        closeMobileMenu();
    }
});


/* =========================================
   MODAL DE RESERVAS
========================================= */

function openBookingModal(serviceId = "") {
    lastFocusedElement = document.activeElement;

    elements.modal.hidden = false;
    document.body.classList.add("modal-open");

    if (serviceId) {
        elements.bookingService.value = serviceId;
    }

    updateBookingSummary();

    elements.modal.querySelector("#client-name").focus();
}


function closeBookingModal() {
    if (elements.modal.hidden) {
        return;
    }

    elements.modal.hidden = true;
    document.body.classList.remove("modal-open");

    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
        lastFocusedElement.focus();
    }
}


elements.openBooking.addEventListener("click", () => {
    openBookingModal();
});


elements.closeBooking.addEventListener("click", closeBookingModal);


elements.modal.addEventListener("click", event => {
    if (event.target === elements.modal) {
        closeBookingModal();
    }
});


elements.servicesGrid.addEventListener("click", event => {
    const button = event.target.closest("[data-book-service]");

    if (!button) {
        return;
    }

    openBookingModal(button.dataset.bookService);
});


/* =========================================
   FECHAS Y HORAS
========================================= */

// Impide seleccionar fechas pasadas.
// Esto no comprueba todavía los horarios disponibles del negocio.

function getLocalDateString(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


elements.bookingDate.min = getLocalDateString();


// Horas provisionales para mostrar el formulario.
// Antes de aceptar reservas reales debemos configurar los horarios
// de apertura, los descansos y la disponibilidad de cada profesional.

function renderTimeOptions() {
    const times = [];

    for (let hour = 8; hour <= 18; hour++) {
        for (const minute of [0, 30]) {
            if (hour === 18 && minute === 30) {
                continue;
            }

            const value =
                `${String(hour).padStart(2, "0")}:` +
                `${String(minute).padStart(2, "0")}`;

            const displayDate = new Date();
            displayDate.setHours(hour, minute, 0, 0);

            const label = displayDate.toLocaleTimeString("es-CO", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true
            });

            times.push({ value, label });
        }
    }

    elements.bookingTime.innerHTML = `
        <option value="">Selecciona</option>
        ${times.map(time => `
            <option value="${time.value}">
                ${time.label}
            </option>
        `).join("")}
    `;
}


/* =========================================
   RESUMEN DEL SERVICIO
========================================= */

function updateBookingSummary() {
    const service = getService(elements.bookingService.value);

    if (!service) {
        elements.bookingSummary.textContent =
            "Selecciona un servicio para consultar su precio y duración.";

        return;
    }

    elements.bookingSummary.textContent =
        `Servicio: ${service.name}. ` +
        `Precio: ${getServicePriceLabel(service)}. ` +
        `Duración: ${getServiceDurationLabel(service)}.`;
}


elements.bookingService.addEventListener("change", updateBookingSummary);


/* =========================================
   SOLICITUD DE RESERVA
========================================= */

function buildWhatsAppMessage(booking) {
    const service = getService(booking.serviceId);

    return [
        "¡Hola, Awa Divina! 🌿",
        "",
        "Quisiera solicitar una cita.",
        "",
        `Nombre: ${booking.name}`,
        `Teléfono: ${booking.phone}`,
        `Servicio: ${service.name}`,
        `Precio: ${getServicePriceLabel(service)}`,
        `Duración: ${getServiceDurationLabel(service)}`,
        `Fecha solicitada: ${booking.date}`,
        `Hora preferida: ${booking.time}`,
        booking.notes ? `Detalles: ${booking.notes}` : "",
        "",
        "Entiendo que la cita debe ser confirmada por el spa."
    ].filter(Boolean).join("\n");
}


elements.bookingForm.addEventListener("submit", event => {
    event.preventDefault();

    if (!elements.bookingForm.reportValidity()) {
        return;
    }

    const formData = new FormData(elements.bookingForm);

    const booking = {
        name: String(formData.get("clientName") || "").trim(),
        phone: String(formData.get("clientPhone") || "").trim(),
        serviceId: String(formData.get("service") || ""),
        date: String(formData.get("date") || ""),
        time: String(formData.get("time") || ""),
        notes: String(formData.get("notes") || "").trim()
    };

    const service = getService(booking.serviceId);

    if (!service) {
        showToast("Por favor, selecciona un servicio válido.");
        return;
    }

    if (service.price === null || !service.duration) {
        showToast(
            "Este servicio aún tiene datos pendientes. " +
            "Contacta al spa para confirmar el precio o la duración."
        );

        return;
    }

    if (booking.date < getLocalDateString()) {
        showToast("Selecciona una fecha de hoy en adelante.");
        return;
    }

    const requestedDateTime = new Date(
        `${booking.date}T${booking.time}:00`
    );

    if (
        booking.date === getLocalDateString() &&
        requestedDateTime <= new Date()
    ) {
        showToast("Selecciona una hora futura.");
        return;
    }

    // Todavía no se guarda la cita en una base de datos.
    // Tampoco se ha comprobado si el horario está libre.

    if (/^\d+$/.test(CONFIG.whatsapp) && CONFIG.whatsapp.length >= 10) {
        const message = buildWhatsAppMessage(booking);

        const whatsappUrl =
            `https://wa.me/${CONFIG.whatsapp}?text=` +
            encodeURIComponent(message);

        window.open(whatsappUrl, "_blank", "noopener,noreferrer");

        closeBookingModal();

        showToast(
            "Se preparó tu solicitud en WhatsApp. " +
            "Recuerda enviarla para contactar al spa."
        );

        return;
    }

    showToast(
        "El formulario funciona, pero todavía falta configurar " +
        "WhatsApp y conectar el sistema de reservas. " +
        "Aún no se ha creado una cita."
    );
});


/* =========================================
   CONTACTO POR WHATSAPP
========================================= */

elements.contactWhatsapp.addEventListener("click", () => {
    if (!/^\d+$/.test(CONFIG.whatsapp) || CONFIG.whatsapp.length < 10) {
        showToast(
            "El número de WhatsApp se configurará más adelante."
        );

        return;
    }

    const message = encodeURIComponent(
        "¡Hola, Awa Divina! 🌿 Quisiera consultar sus servicios y horarios."
    );

    window.open(
        `https://wa.me/${CONFIG.whatsapp}?text=${message}`,
        "_blank",
        "noopener,noreferrer"
    );
});


/* =========================================
   ANIMACIONES AL DESPLAZARSE
========================================= */

function setupRevealAnimations() {
    const sections = document.querySelectorAll(
        ".section, .booking-banner, .values-strip"
    );

    if (!("IntersectionObserver" in window)) {
        return;
    }

    sections.forEach(section => {
        section.querySelectorAll(
            ".section-heading, .service-card, .about-content, " +
            ".about-visual, .contact-card, .contact-heading"
        ).forEach(element => {
            element.classList.add("reveal");
        });
    });

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08
    });

    document.querySelectorAll(".reveal").forEach(element => {
        observer.observe(element);
    });
}


/* =========================================
   INICIALIZACIÓN
========================================= */

function init() {
    renderServices();
    renderTimeOptions();
    setupRevealAnimations();

    document.getElementById("current-year").textContent =
        new Date().getFullYear();
}


init();