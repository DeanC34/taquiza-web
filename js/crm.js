// ==========================================
// MÓDULO CRM - SISTEMA DE LOGIN MANUAL
// ==========================================

// Al cargar la página, verificamos si ya hay un usuario logueado
window.addEventListener('DOMContentLoaded', () => {
    const currentName = localStorage.getItem("customerName");
    if (currentName) {
        // Extraemos solo el primer nombre
        const primerNombre = currentName.split(' ');
        const btn = document.getElementById('userLoginBtn');
        if(btn) {
            btn.innerText = `👤 Hola, ${primerNombre}`;
            btn.style.background = "#f0ad4e"; // Lo ponemos naranja para indicar que ya inició
            btn.style.color = "#333";
        }
        window.showRecommended();
    }
});

// ------------------------------------------
// 1. FORMULARIO DE REGISTRO / LOGIN
// ------------------------------------------
window.openLoginModal = function() {
    const currentEmail = localStorage.getItem("customerEmail");
    
    // Si ya inició sesión, lo mandamos a su perfil directamente
    if (currentEmail) {
        window.location.href = 'perfil.html';
        return;
    }

    // Modal de Registro con SweetAlert2
    Swal.fire({
        title: '¡Bienvenido a La Rana! 🐸',
        html: `
            <div style="text-align: left; margin-bottom: 15px;">
                <label style="font-weight: bold; color: #333;">Nombre completo:</label>
                <input type="text" id="swal-input-name" class="swal2-input" placeholder="Ej: Juan Pérez" style="margin-top: 5px; width: 85%;">
            </div>
            <div style="text-align: left; margin-bottom: 15px;">
                <label style="font-weight: bold; color: #333;">Correo electrónico:</label>
                <input type="email" id="swal-input-email" class="swal2-input" placeholder="Ej: juan@correo.com" style="margin-top: 5px; width: 85%;">
            </div>
            <div style="text-align: left; margin-top: 20px; padding: 0 10px;">
                <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                    <input type="checkbox" id="swal-input-promo" style="width: 20px; height: 20px;" checked>
                    <span style="font-size: 0.9em; color: #555;">Quiero unirme a <b>Taqui-Puntos</b> y recibir cupones de descuento.</span>
                </label>
            </div>
        `,
        confirmButtonText: 'Registrarme 🚀',
        confirmButtonColor: '#f5576c', // Color naranja/rojizo de tu paleta
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            const name = document.getElementById('swal-input-name').value;
            const email = document.getElementById('swal-input-email').value;
            const promo = document.getElementById('swal-input-promo').checked;

            // Validaciones básicas
            if (!name || !email) {
                Swal.showValidationMessage('Por favor completa todos los campos.');
                return false;
            }
            if (!/\S+@\S+\.\S+/.test(email)) {
                Swal.showValidationMessage('Por favor ingresa un correo electrónico válido.');
                return false;
            }

            return { name: name, email: email, promo: promo };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const data = result.value;
            const primerNombre = data.name.split(' ');
            
            // Guardar en LocalStorage
            localStorage.setItem("customerName", data.name);
            localStorage.setItem("customerEmail", data.email);
            localStorage.setItem("promoSubscribed", data.promo ? "true" : "false");
            
            // Actualizar el botón superior
            const btn = document.getElementById('userLoginBtn');
            if(btn) {
                btn.innerText = `👤 Hola, ${primerNombre}`;
                btn.style.background = "#f0ad4e";
                btn.style.color = "#333";
            }

            // Notificación emergente (Toast) abajo a la izquierda
            Swal.fire({
                toast: true,
                position: 'bottom-start', // Esquina inferior izquierda
                icon: 'success',
                title: `¡Registro exitoso, ${primerNombre}!`,
                text: 'Te hemos enviado un código de confirmación a tu correo (Próximamente).',
                showConfirmButton: false,
                timer: 5000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer);
                    toast.addEventListener('mouseleave', Swal.resumeTimer);
                }
            });
            
            window.showRecommended();
        }
    });
};

// ------------------------------------------
// 2. HISTORIAL DE PEDIDOS (Recomendador)
// ------------------------------------------
window.saveCustomerData = function(productName) {
    let history = JSON.parse(localStorage.getItem("customerOrderHistory")) || [];
    history.push(productName);
    localStorage.setItem("customerOrderHistory", JSON.stringify(history));
};

window.showRecommended = function() {
    let history = JSON.parse(localStorage.getItem("customerOrderHistory"));
    const recommendedContainer = document.getElementById("recommendedProducts");

    if (!history || history.length === 0 || !recommendedContainer) return;

    let mostOrdered = history.reduce((a, b) =>
        history.filter(v => v === a).length >= history.filter(v => v === b).length ? a : b
    );

    recommendedContainer.innerHTML = `
        <div class="product-card" style="border-color: #f5576c; background-color: #fff9fa;">
            <div class="product-name">⭐ ${mostOrdered}</div>
            <p>Basado en tus pedidos anteriores. ¡Tu favorito!</p>
            <button class="add-btn" style="margin-top:10px;" 
                onclick="alert('Busca este producto abajo para agregarlo al carrito.')">
                ¡Lo quiero de nuevo!
            </button>
        </div>
    `;
};