// ==========================================
// MÓDULO CARRITO DE COMPRAS
// ==========================================

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// 1. GESTIÓN DEL CARRITO

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }

    updateCart();
    
    // Llamamos a la función del crm.js para guardar el historial
    if (typeof saveCustomerData === "function") {
        saveCustomerData(name);
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function updateCart() {
    const cartCount = document.getElementById("cartCount");
    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    let total = 0;
    let html = "";

    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">🛒<br><br>Tu carrito está vacío</div>';
        cartTotal.textContent = "Total: $0";
        saveCart();
        return;
    }

    cart.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        total += subtotal;

        html += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>Cantidad: ${item.quantity} x $${item.price}</p>
                    <div class="cart-item-price">$${subtotal}</div>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${index})">
                    Eliminar
                </button>
            </div>
        `;
    });

    cartItems.innerHTML = html;
    cartTotal.textContent = "Total: $" + total;
    saveCart();
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Inicializar el carrito visualmente al cargar la página
window.onload = function() {
    updateCart();
};

// ------------------------------------------
// 2. INTERFAZ Y ENVÍO
// ------------------------------------------
function toggleCart() {
    const modal = document.getElementById("cartModal");
    modal.classList.toggle("active");
}

function sendToWhatsApp() {
    if (cart.length === 0) {
        alert("Tu carrito está vacío");
        return;
    }

    let customerName = localStorage.getItem("customerName") || prompt("Ingresa tu nombre para el pedido:");
    if (!customerName) return; 

    let message = `🌮 Nuevo Pedido de *${customerName}* - Taquiza La Rana 🌮\n\n`;
    let total = 0;

    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        message += `▪️ ${item.quantity}x ${item.name} ($${subtotal})\n`;
    });

    message += `\n*Total a pagar: $${total}*`;

    const phone = "5219613591178";
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
}

// ------------------------------------------
// 3. BÚSQUEDA Y NAVEGACIÓN GENERAL
// ------------------------------------------
function searchProducts() {
    let input = document.getElementById("searchInput").value.toLowerCase();
    let products = document.querySelectorAll(".product-card");

    products.forEach(product => {
        let name = product.querySelector(".product-name").innerText.toLowerCase();
        if (name.includes(input)) {
            product.style.display = "block";
        } else {
            product.style.display = "none";
        }
    });
}

function toggleMenu() {
    const menu = document.getElementById("dropdownMenu");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
}

window.onclick = function(event) {
    if (!event.target.matches('.menu-btn')) {
        const dropdowns = document.getElementsByClassName("dropdown-content");
        for (let i = 0; i < dropdowns.length; i++) {
            let openDropdown = dropdowns[i];
            if (openDropdown.style.display === "block") {
                openDropdown.style.display = "none";
            }
        }
    }
}

function goToProfile() {
    const userName = localStorage.getItem("customerName");
    if (userName) {
        window.location.href = "perfil.html";
    } else {
        alert("Por favor, inicia sesión con Google primero para acceder a tu perfil.");
    }
}

function goToSettings() {
    alert("⚙️ El panel de ajustes estará disponible próximamente.");
}

function goToAdmin() {
    window.location.href = "admin.html";
}

// ==========================================
// 4. SIMULADOR DE PAGO EN LÍNEA Y CRM
// ==========================================
function processWebOrder() {
    if (cart.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }

    const customerEmail = localStorage.getItem("customerEmail");
    if (!customerEmail) {
        alert("⚠️ Para pagar en línea y acumular Taqui-Puntos, por favor inicia sesión con Google primero.");
        return;
    }

    const statusDiv = document.getElementById("orderStatus");
    const btnWeb = document.querySelector(".web-order-btn");
    const btnWa = document.querySelector(".whatsapp-btn");
    const cartTotalDiv = document.getElementById("cartTotal");
    const closeBtn = document.querySelector(".close-btn");
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    statusDiv.style.display = "block";
    btnWeb.style.display = "none";
    btnWa.style.display = "none";
    closeBtn.style.display = "none";

    statusDiv.innerHTML = "⏳ Validando método de pago...";
    
    setTimeout(() => {
        statusDiv.innerHTML = "🍳 Recibido. ¡Preparando tu orden en cocina!";
        statusDiv.style.color = "#f0ad4e"; 
        
        setTimeout(() => {
            statusDiv.innerHTML = "✅ ¡Pago exitoso y orden lista!";
            statusDiv.style.color = "#267d46"; 
            
            // 3. ENVIAR A FIREBASE (CRM)
            if (window.guardarPedidoEnCRM) {
                window.guardarPedidoEnCRM([...cart], total);
            }

            // --- NUEVO: DESCONTAR DEL INVENTARIO (SCM) ---
            if (window.descontarInventario) {
                window.descontarInventario([...cart]);
            }
            
            // 4. Limpiar el carrito
            cart = [];
            updateCart();
            
            // 5. Restaurar interfaz
            setTimeout(() => {
                statusDiv.style.display = "none";
                btnWeb.style.display = "block";
                btnWa.style.display = "block";
                closeBtn.style.display = "block";
                toggleCart();
            }, 3500);

        }, 3000); 
    }, 2000);  
}