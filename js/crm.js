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
    
    // Al iniciar sesión, mostramos las recomendaciones
    showRecommended();
}

// Decodificador del Token de Google
function parseJwt(token) {
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

    // Si no hay historial o el contenedor no existe, salir
    if (!history || history.length === 0 || !recommendedContainer) {
        return;
    }

    // Lógica para encontrar el producto más repetido
    let mostOrdered = history.reduce((a, b) =>
        history.filter(v => v === a).length >= history.filter(v => v === b).length ? a : b
    );

    // Dibujar la tarjeta de recomendación
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
        // Lógica futura: Eliminar de la base de datos de correos en Firebase
        localStorage.setItem("promoSubscribed", "false");
        alert("Te has dado de baja de las promociones. 😔");
    } else {
        // Lógica futura: Agregar correo a Firebase Mailchimp/SendGrid
        localStorage.setItem("promoSubscribed", "true");
        alert("¡Genial! Recibirás nuestras mejores taquizas en: " + email);
    }
}