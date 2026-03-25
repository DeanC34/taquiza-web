// ==========================================
// MÓDULO CRM - SISTEMA DE LOGIN MANUAL
// ==========================================

window.addEventListener('DOMContentLoaded', () => {
    const currentName = localStorage.getItem("customerName");
    if (currentName) {
        // Extraemos solo el primer nombre sin comas ni espacios
        const primerNombre = currentName.trim().split(' ');
        const btn = document.getElementById('userLoginBtn');
        if(btn) {
            btn.innerText = `👤 Hola, ${primerNombre}`;
            btn.style.background = "#f0ad4e";
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
    
    if (currentEmail) {
        window.location.href = 'perfil.html';
        return;
    }

    Swal.fire({
        title: '¡Bienvenido a La Rana! 🐸',
        html: `
            <div style="text-align: left; margin-bottom: 15px;">
                <label style="font-weight: bold; color: #333;">Nombre de usuario:</label>
                <input type="text" id="swal-input-name" class="swal2-input" placeholder="Ej: Juan Pérez" style="margin-top: 5px; width: 85%;">
            </div>
            <div style="text-align: left; margin-bottom: 15px;">
                <label style="font-weight: bold; color: #333;">Correo electrónico:</label>
                <input type="email" id="swal-input-email" class="swal2-input" placeholder="Ej: juan@correo.com" style="margin-top: 5px; width: 85%;">
            </div>
            <div style="text-align: left; margin-top: 20px; padding: 0 10px;">
                <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                    <input type="checkbox" id="swal-input-promo" style="width: 20px; height: 20px;" checked>
                    <span style="font-size: 0.9em; color: #555;">Quiero unirme a <b>Taqui-Puntos</b> y recibir cupones.</span>
                </label>
            </div>
        `,
        confirmButtonText: 'Siguiente 🚀',
        confirmButtonColor: '#f5576c',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            const name = document.getElementById('swal-input-name').value;
            const email = document.getElementById('swal-input-email').value;
            const promo = document.getElementById('swal-input-promo').checked;

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
            const primerNombre = data.name.trim().split(' ');
            
            const codigoVerificacion = Math.floor(100000 + Math.random() * 900000).toString();
            
            localStorage.setItem("customerName", data.name);
            localStorage.setItem("customerEmail", data.email);
            localStorage.setItem("promoSubscribed", data.promo ? "true" : "false");
            localStorage.setItem("emailVerified", "false"); 
            localStorage.setItem("verifyCode", codigoVerificacion); 

            const btn = document.getElementById('userLoginBtn');
            if(btn) {
                btn.innerText = `👤 Hola, ${primerNombre}`;
                btn.style.background = "#f0ad4e";
                btn.style.color = "#333";
            }

            // Enviar Correo con EmailJS
            if(window.emailjs) {
                emailjs.send("TU_SERVICE_ID_AQUI", "TU_TEMPLATE_ID_VERIFICACION_AQUI", {
                    to_name: primerNombre,
                    to_email: data.email,
                    verification_code: codigoVerificacion
                }).then(function() {
                    console.log('Correo de verificación enviado!');
                }, function(error) {
                    console.error('Error enviando correo:', error);
                });
            }

            // Pedir Teléfono después
            Swal.fire({
                title: `¡Casi listo, ${primerNombre}!`,
                text: 'Para entregar tus pedidos a domicilio necesitamos un número de WhatsApp.',
                icon: 'info',
                input: 'tel',
                inputPlaceholder: 'Ej: 9611234567',
                confirmButtonText: 'Guardar y Finalizar',
                confirmButtonColor: '#267d46',
                allowOutsideClick: false,
                inputValidator: (value) => {
                    if (!value) return '¡Necesitamos tu número!';
                }
            }).then((phoneResult) => {
                if (phoneResult.isConfirmed) {
                    localStorage.setItem("customerPhone", phoneResult.value);
                    
                    Swal.fire({
                        toast: true,
                        position: 'bottom-start',
                        icon: 'success',
                        title: '¡Registro exitoso!',
                        text: 'Revisa tu correo para verificar tu cuenta y ganar puntos.',
                        showConfirmButton: false,
                        timer: 6000,
                        timerProgressBar: true
                    });
                    
                    window.showRecommended();
                }
            });
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