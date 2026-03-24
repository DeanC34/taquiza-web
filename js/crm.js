// ==========================================
// MÓDULO CRM - GESTIÓN DE CLIENTES Y DATOS
// ==========================================

// ------------------------------------------
// 1. LOGIN CON GOOGLE
// ------------------------------------------
function handleCredentialResponse(response) {
    const data = parseJwt(response.credential);

    // Guardar datos básicos en LocalStorage
    localStorage.setItem("customerName", data.name);
    localStorage.setItem("customerEmail", data.email);

    // Actualizar la UI
    document.getElementById("userInfo").innerHTML = "👤 " + data.name;
    document.querySelector(".g_id_signin").style.display = "none"; // Ocultar el botón de Google
    
    showRecommended();

    // LÓGICA DE BIENVENIDA Y TELÉFONO
    let phone = localStorage.getItem("customerPhone");
    
    if (!phone) {
        // Si no hay teléfono guardado, asumimos que es su primer inicio de sesión
        Swal.fire({
            title: `¡Bienvenido a La Rana, ${data.name.split(' ')}! 🐸`,
            text: 'Tu perfil ha sido creado automáticamente. Para poder realizar tus pedidos y pagos en línea, necesitamos un número de WhatsApp de contacto.',
            icon: 'info',
            input: 'tel',
            inputPlaceholder: 'Ej: 9611234567',
            confirmButtonText: 'Guardar Teléfono',
            confirmButtonColor: '#267d46',
            allowOutsideClick: false, // Obliga al usuario a poner el número
            inputValidator: (value) => {
                if (!value) {
                    return '¡Necesitamos tu número para entregar tus tacos!'
                }
            }
        }).then((result) => {
            if (result.isConfirmed && result.value) {
                localStorage.setItem("customerPhone", result.value);
                Swal.fire('¡Excelente!', 'Perfil completado. Ya puedes hacer tu pedido.', 'success');
            }
        });
    } else {
        // Si ya tiene teléfono, solo le damos una pequeña bienvenida discreta
        Swal.fire({
            title: `¡Hola de nuevo, ${data.name.split(' ')}!`,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            icon: 'success'
        });
    }
}

// Decodificador del Token de Google (CORREGIDO)
function parseJwt(token) {
    // EL ERROR ESTABA AQUÍ: Faltaba el al final
    var base64Url = token.split('.');
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

// ------------------------------------------
// 2. HISTORIAL DE PEDIDOS (Recomendador)
// ------------------------------------------
function saveCustomerData(productName) {
    let history = JSON.parse(localStorage.getItem("customerOrderHistory")) || [];
    history.push(productName);
    localStorage.setItem("customerOrderHistory", JSON.stringify(history));
}

function showRecommended() {
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
}

// ------------------------------------------
// 3. SUSCRIPCIÓN A CORREOS PROMOCIONALES
// ------------------------------------------
function togglePromoEmails() {
    const email = localStorage.getItem("customerEmail");
    
    if(!email) {
        alert("Primero debes iniciar sesión con Google para suscribirte.");
        return;
    }

    const isSubscribed = localStorage.getItem("promoSubscribed") === "true";

    if(isSubscribed) {
        localStorage.setItem("promoSubscribed", "false");
        alert("Te has dado de baja de las promociones. 😔");
    } else {
        localStorage.setItem("promoSubscribed", "true");
        alert("¡Genial! Recibirás nuestras mejores taquizas en: " + email);
    }
}