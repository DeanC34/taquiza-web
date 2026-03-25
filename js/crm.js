// ==========================================
// MÓDULO CRM - SISTEMA DE LOGIN MANUAL
// ==========================================

window.addEventListener('DOMContentLoaded', () => {
    const currentName = localStorage.getItem("customerName");
    if (currentName) {
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
// 1. GESTIÓN DE ACCESO (LOGIN / REGISTRO)
// ------------------------------------------
window.openLoginModal = function() {
    const currentEmail = localStorage.getItem("customerEmail");
    
    if (currentEmail) {
        window.location.href = 'perfil.html';
        return;
    }

    Swal.fire({
        title: 'Acceso a La Rana 🐸',
        html: `
            <div style="display: flex; justify-content: center; gap: 10px; margin-bottom: 20px;">
                <button id="tab-login" style="padding: 8px 15px; border:none; background:#267d46; color:white; border-radius:5px; cursor:pointer;">Iniciar Sesión</button>
                <button id="tab-register" style="padding: 8px 15px; border:1px solid #ccc; background:white; color:#333; border-radius:5px; cursor:pointer;">Crear Cuenta</button>
            </div>

            <div id="form-register" style="display:none;">
                <div style="text-align: left; margin-bottom: 15px;">
                    <label style="font-weight: bold; color: #333;">Nombre de usuario:</label>
                    <input type="text" id="reg-name" class="swal2-input" placeholder="Ej: Juan Pérez" style="margin-top: 5px; width: 85%;">
                </div>
                <div style="text-align: left; margin-bottom: 15px;">
                    <label style="font-weight: bold; color: #333;">Correo electrónico:</label>
                    <input type="email" id="reg-email" class="swal2-input" placeholder="Ej: juan@correo.com" style="margin-top: 5px; width: 85%;">
                </div>
                <div style="text-align: left; margin-top: 20px; padding: 0 10px;">
                    <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                        <input type="checkbox" id="reg-promo" style="width: 20px; height: 20px;" checked>
                        <span style="font-size: 0.9em; color: #555;">Quiero unirme a <b>Taqui-Puntos</b> y recibir cupones.</span>
                    </label>
                </div>
            </div>

            <div id="form-login">
                <p style="font-size:0.9em; color:#666; margin-bottom:15px;">Ingresa tu correo para recibir un código de acceso.</p>
                <div style="text-align: left; margin-bottom: 15px;">
                    <label style="font-weight: bold; color: #333;">Correo electrónico:</label>
                    <input type="email" id="login-email" class="swal2-input" placeholder="Ej: juan@correo.com" style="margin-top: 5px; width: 85%;">
                </div>
            </div>
        `,
        confirmButtonText: 'Continuar 🚀',
        confirmButtonColor: '#f5576c',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        didOpen: () => {
            const tabLogin = document.getElementById('tab-login');
            const tabRegister = document.getElementById('tab-register');
            const formLogin = document.getElementById('form-login');
            const formRegister = document.getElementById('form-register');

            // Lógica de pestañas
            tabLogin.onclick = () => {
                tabLogin.style.background = "#267d46"; tabLogin.style.color = "white"; tabLogin.style.border = "none";
                tabRegister.style.background = "white"; tabRegister.style.color = "#333"; tabRegister.style.border = "1px solid #ccc";
                formLogin.style.display = "block";
                formRegister.style.display = "none";
            };
            tabRegister.onclick = () => {
                tabRegister.style.background = "#267d46"; tabRegister.style.color = "white"; tabRegister.style.border = "none";
                tabLogin.style.background = "white"; tabLogin.style.color = "#333"; tabLogin.style.border = "1px solid #ccc";
                formRegister.style.display = "block";
                formLogin.style.display = "none";
            };
        },
        preConfirm: () => {
            const isLogin = document.getElementById('form-login').style.display !== 'none';
            
            if (isLogin) {
                const email = document.getElementById('login-email').value;
                if (!/\S+@\S+\.\S+/.test(email)) {
                    Swal.showValidationMessage('Por favor ingresa un correo válido.');
                    return false;
                }
                return { mode: 'login', email: email };
            } else {
                const name = document.getElementById('reg-name').value;
                const email = document.getElementById('reg-email').value;
                const promo = document.getElementById('reg-promo').checked;
                if (!name || !email) {
                    Swal.showValidationMessage('Por favor completa todos los campos.');
                    return false;
                }
                if (!/\S+@\S+\.\S+/.test(email)) {
                    Swal.showValidationMessage('Por favor ingresa un correo válido.');
                    return false;
                }
                return { mode: 'register', name: name, email: email, promo: promo };
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const data = result.value;
            const codigoAcceso = Math.floor(100000 + Math.random() * 900000).toString();

            if (data.mode === 'register') {
                procesarRegistro(data, codigoAcceso);
            } else {
                procesarLogin(data.email, codigoAcceso);
            }
        }
    });
};

function procesarRegistro(data, codigo) {
    const primerNombre = data.name.trim().split(' ');
    
    localStorage.setItem("customerName", data.name);
    localStorage.setItem("customerEmail", data.email);
    localStorage.setItem("promoSubscribed", data.promo ? "true" : "false");
    localStorage.setItem("emailVerified", "false"); 
    localStorage.setItem("verifyCode", codigo); 

    actualizarBotonMenu(primerNombre);
    enviarCodigoPorCorreo(primerNombre, data.email, codigo);

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
            mostrarToastExito('¡Registro exitoso!', 'Revisa tu correo para verificar tu cuenta.');
            window.showRecommended();
        }
    });
}

function procesarLogin(email, codigo) {
    // Nota: Como no tenemos Backend, asumimos que si sabe su correo, le enviamos un código.
    // El "customerName" lo recuperaremos cuando entre a su perfil y lea de Firebase (o usaremos el email como fallback)
    
    localStorage.setItem("verifyCode", codigo); 
    enviarCodigoPorCorreo("Usuario", email, codigo);

    Swal.fire({
        title: 'Código Enviado 📧',
        text: 'Hemos enviado un código de acceso a tu correo. Ingresalo para entrar.',
        input: 'text',
        inputPlaceholder: '123456',
        confirmButtonText: 'Verificar',
        confirmButtonColor: '#267d46',
        showCancelButton: true,
        inputValidator: (value) => {
            if (!value) return 'Necesitas ingresar el código';
        }
    }).then((result) => {
        if (result.isConfirmed) {
            if (result.value === codigo) {
                // Login Exitoso
                localStorage.setItem("customerEmail", email);
                localStorage.setItem("emailVerified", "true");
                
                // Si ya tenía nombre guardado localmente lo usamos, si no, ponemos un genérico
                let nombre = localStorage.getItem("customerName") || email.split('@');
                localStorage.setItem("customerName", nombre);

                actualizarBotonMenu(nombre.split(' '));
                mostrarToastExito('¡Bienvenido de vuelta!', 'Has iniciado sesión correctamente.');
                window.showRecommended();
            } else {
                Swal.fire('Error', 'Código incorrecto. Intenta de nuevo.', 'error');
            }
        }
    });
}

function enviarCodigoPorCorreo(nombre, correo, codigo) {
    if(window.emailjs) {
        emailjs.send("service_taquizalarana", "template_kp9868k", {
            to_name: nombre,
            to_email: correo,
            verification_code: codigo
        }).then(() => console.log('Correo enviado!'), (e) => console.error('Error:', e));
    }
}

function actualizarBotonMenu(nombre) {
    const btn = document.getElementById('userLoginBtn');
    if(btn) {
        btn.innerText = `👤 Hola, ${nombre}`;
        btn.style.background = "#f0ad4e";
        btn.style.color = "#333";
    }
}

function mostrarToastExito(titulo, texto) {
    Swal.fire({
        toast: true,
        position: 'bottom-start',
        icon: 'success',
        title: titulo,
        text: texto,
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true
    });
}

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