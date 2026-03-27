// ==========================================
// MÓDULO CRM - SISTEMA DE LOGIN MANUAL AVANZADO
// ==========================================
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBN39V3BfL29_jh8SnGD43xdJzwm_2FolM",
    authDomain: "taquiza-web.firebaseapp.com",
    projectId: "taquiza-web",
    storageBucket: "taquiza-web.firebasestorage.app",
    messagingSenderId: "475601236604",
    appId: "1:475601236604:web:775b368768e9822789cff9"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

window.addEventListener('DOMContentLoaded', () => {
    verificarSesionActiva();
});

// Función para revisar si hay alguien logueado
function verificarSesionActiva() {
    const currentName = localStorage.getItem("customerName");
    const isVerified = localStorage.getItem("emailVerified") === "true";

    const btnLogin = document.getElementById('userLoginBtn');
    const btnLogout = document.getElementById('userLogoutBtn');

    if (currentName && isVerified) {
        // CORRECCIÓN: Agregamos para evitar el error de las comas en el menú superior
        const primerNombre = currentName.trim().split(' ');
        
        if (btnLogin) {
            btnLogin.innerText = `👤 Hola, ${primerNombre}`;
            btnLogin.style.background = "#f0ad4e";
            btnLogin.style.color = "#333";
            btnLogin.setAttribute('onclick', "window.location.href='perfil.html'");
        }
        if (btnLogout) {
            btnLogout.style.display = "inline-block";
        }
        window.showRecommended();
    } else {
        if (btnLogin) {
            btnLogin.innerText = `👤 Acceder`;
            btnLogin.style.background = "#267d46";
            btnLogin.style.color = "white";
            btnLogin.setAttribute('onclick', "openLoginModal()");
        }
        if (btnLogout) {
            btnLogout.style.display = "none";
        }
    }
}

// ------------------------------------------
// 1. GESTIÓN DE ACCESO (LOGIN / REGISTRO)
// ------------------------------------------
window.openLoginModal = function() {
    Swal.fire({
        title: 'Acceso a La Rana 🐸',
        html: `
            <div style="display: flex; justify-content: center; gap: 10px; margin-bottom: 20px;">
                <button id="tab-login" style="padding: 8px 15px; border:none; background:#267d46; color:white; border-radius:5px; cursor:pointer;">Iniciar Sesión</button>
                <button id="tab-register" style="padding: 8px 15px; border:1px solid #ccc; background:white; color:#333; border-radius:5px; cursor:pointer;">Crear Cuenta</button>
            </div>

            <div id="form-register" style="display:none; text-align:left;">
                <label style="font-weight: bold; color: #333;">Nombre completo:</label>
                <input type="text" id="reg-name" class="swal2-input" placeholder="Ej: Juan Pérez" style="margin-top: 5px; width: 85%;">
                
                <label style="font-weight: bold; color: #333; margin-top: 15px; display:block;">Correo electrónico:</label>
                <input type="email" id="reg-email" class="swal2-input" placeholder="Ej: juan@correo.com" style="margin-top: 5px; width: 85%;">

                <label style="font-weight: bold; color: #333; margin-top: 15px; display:block;">Contraseña (Opcional):</label>
                <input type="password" id="reg-pass" class="swal2-input" placeholder="Para acceso rápido" style="margin-top: 5px; width: 85%;">
                <small style="color:#666; display:block; margin-top:5px;">Si dejas esto en blanco, accederás mediante códigos a tu correo.</small>

                <div style="margin-top: 20px;">
                    <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                        <input type="checkbox" id="reg-promo" style="width: 20px; height: 20px;" checked>
                        <span style="font-size: 0.9em; color: #555;">Unirme a <b>Taqui-Puntos</b> y recibir cupones.</span>
                    </label>
                </div>
            </div>

            <div id="form-login" style="text-align:left;">
                <label style="font-weight: bold; color: #333;">Correo electrónico:</label>
                <input type="email" id="login-email" class="swal2-input" placeholder="Ej: juan@correo.com" style="margin-top: 5px; width: 85%;">
                
                <label style="font-weight: bold; color: #333; margin-top: 15px; display:block;">Contraseña:</label>
                <input type="password" id="login-pass" class="swal2-input" placeholder="Déjalo en blanco para usar código de correo" style="margin-top: 5px; width: 85%;">
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
                const pass = document.getElementById('login-pass').value;
                if (!/\S+@\S+\.\S+/.test(email)) {
                    Swal.showValidationMessage('Ingresa un correo válido.'); return false;
                }
                return { mode: 'login', email: email, pass: pass };
            } else {
                const name = document.getElementById('reg-name').value;
                const email = document.getElementById('reg-email').value;
                const pass = document.getElementById('reg-pass').value;
                const promo = document.getElementById('reg-promo').checked;
                
                if (!name || !email) {
                    Swal.showValidationMessage('Nombre y correo son obligatorios.'); return false;
                }
                if (!/\S+@\S+\.\S+/.test(email)) {
                    Swal.showValidationMessage('Ingresa un correo válido.'); return false;
                }
                return { mode: 'register', name: name, email: email, pass: pass, promo: promo };
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const data = result.value;
            const codigoAleatorio = Math.floor(100000 + Math.random() * 900000).toString();

            if (data.mode === 'register') {
                procesarRegistro(data, codigoAleatorio);
            } else {
                procesarLogin(data, codigoAleatorio);
            }
        }
    });
};

async function procesarRegistro(data, codigo) {
    const email = data.email;

    Swal.fire({
        title: 'Verificando datos...',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
    });

    try {
        const clienteRef = doc(db, "clientes", email);
        const clienteSnap = await getDoc(clienteRef);

        if (clienteSnap.exists()) {
            Swal.fire({
                title: 'Correo ya registrado',
                text: `El correo ${email} ya tiene una cuenta con nosotros. Por favor, inicia sesión.`,
                icon: 'warning',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#267d46'
            });
            return; 
        }

        Swal.close(); 

        const primerNombre = data.name.trim().split(' '); // CORRECCIÓN AQUÍ TAMBIÉN
        
        localStorage.setItem("customerName", data.name);
        localStorage.setItem("customerEmail", email);
        if(data.pass) localStorage.setItem("customerPass", data.pass);
        localStorage.setItem("promoSubscribed", data.promo ? "true" : "false");
        
        localStorage.setItem("emailVerified", "false"); 
        localStorage.setItem("verifyCode", codigo); 

        enviarCodigoPorCorreo(primerNombre, email, codigo);

        Swal.fire({
            title: 'Verifica tu cuenta 📧',
            text: `Hola ${primerNombre}, hemos enviado un código a ${email}. Ingrésalo para finalizar tu registro.`,
            input: 'text',
            inputPlaceholder: '123456',
            confirmButtonText: 'Verificar y Continuar',
            confirmButtonColor: '#267d46',
            allowOutsideClick: false,
            inputValidator: (value) => {
                if (!value) return 'Necesitas ingresar el código';
            }
        }).then(async (result) => {
            if (result.isConfirmed && result.value === codigo) {
                localStorage.setItem("emailVerified", "true");
                
                try {
                    await setDoc(clienteRef, {
                        nombre: data.name,
                        email: email,
                        correoVerificado: true,
                        suscrito_promos: data.promo ? true : false,
                        puntos: 0,
                        historial: []
                    });
                } catch (e) {
                    console.error("Error al registrar en Firebase:", e);
                }

                verificarSesionActiva();
                pedirTelefonoObligatorio(primerNombre, email); 
            } else {
                Swal.fire('Error', 'Código incorrecto. Intenta registrarte nuevamente.', 'error');
            }
        });

    } catch (error) {
        console.error("Error al verificar correo:", error);
        Swal.fire('Error', 'Hubo un problema de conexión. Inténtalo de nuevo.', 'error');
    }
}

async function procesarLogin(data, codigoTemporal) {
    const email = data.email;
    let savedName = localStorage.getItem("customerName");
    let primerNombre = "Usuario";

    Swal.fire({
        title: 'Buscando cuenta...',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
    });

    try {
        const clienteRef = doc(db, "clientes", email);
        const clienteSnap = await getDoc(clienteRef);

        if (clienteSnap.exists()) {
            const dbData = clienteSnap.data();
            savedName = dbData.nombre; 
            primerNombre = savedName.trim().split(' '); // CORRECCIÓN AQUÍ TAMBIÉN
            
            localStorage.setItem("customerName", savedName);
            localStorage.setItem("customerEmail", email);
            if (dbData.telefono) localStorage.setItem("customerPhone", dbData.telefono);

            Swal.close(); 
            
            if (data.pass) {
                const savedPass = localStorage.getItem("customerPass");
                if (data.pass === savedPass) {
                    localStorage.setItem("emailVerified", "true");
                    verificarSesionActiva();
                    mostrarToastExito('¡Acceso concedido!', `Bienvenido de vuelta, ${primerNombre}.`);
                } else {
                    Swal.fire('Error', 'Contraseña incorrecta.', 'error');
                }
            } 
            else {
                localStorage.setItem("verifyCode", codigoTemporal); 
                enviarCodigoPorCorreo(primerNombre, email, codigoTemporal);

                Swal.fire({
                    title: 'Código Enviado 📧',
                    text: 'Revisa tu correo e ingresa el código de acceso.',
                    input: 'text',
                    inputPlaceholder: '123456',
                    confirmButtonText: 'Verificar',
                    confirmButtonColor: '#267d46',
                    showCancelButton: true
                }).then((result) => {
                    if (result.isConfirmed && result.value === codigoTemporal) {
                        localStorage.setItem("emailVerified", "true");
                        verificarSesionActiva();
                        mostrarToastExito('¡Acceso concedido!', `Bienvenido de vuelta, ${primerNombre}.`);
                    } else {
                        Swal.fire('Error', 'Código incorrecto.', 'error');
                    }
                });
            }

        } else {
            Swal.fire('Cuenta no encontrada', `El correo ${email} no está registrado. Por favor crea una cuenta nueva.`, 'warning');
        }
    } catch (error) {
        console.error("Error al buscar cuenta:", error);
        Swal.fire('Error', 'Hubo un problema al buscar tu cuenta.', 'error');
    }
}

function pedirTelefonoObligatorio(primerNombre, email) {
    Swal.fire({
        title: `¡Felicidades, ${primerNombre}! 🎉`,
        text: 'Para entregar tus pedidos a domicilio necesitamos un número de WhatsApp. ¿Quieres agregarlo ahora?',
        icon: 'info',
        input: 'tel',
        inputPlaceholder: 'Ej: 9611234567',
        confirmButtonText: 'Guardar Número',
        confirmButtonColor: '#267d46',
        showCancelButton: true,
        cancelButtonText: 'Omitir por ahora', 
        cancelButtonColor: '#666',
        allowOutsideClick: false,
        inputValidator: (value) => {
            return new Promise((resolve) => {
                if (!value) {
                    resolve('¡Escribe tu número o presiona "Omitir"!');
                } else {
                    resolve();
                }
            });
        }
    }).then(async (phoneResult) => {
        if (phoneResult.isConfirmed && phoneResult.value) {
            localStorage.setItem("customerPhone", phoneResult.value);
            
            try {
                const clienteRef = doc(db, "clientes", email);
                await updateDoc(clienteRef, { telefono: phoneResult.value });
            } catch (e) {
                console.error("Error guardando teléfono:", e);
            }

            mostrarToastExito('¡Perfil completado!', 'Ya puedes pedir y ganar Taqui-Puntos.');
        } else if (phoneResult.dismiss === Swal.DismissReason.cancel) {
            mostrarToastExito('¡Registro exitoso!', 'Puedes agregar tu teléfono después en tu Perfil.');
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

// ESTA FUNCIÓN SE QUEDA AQUÍ POR SI AÚN HAY ALGÚN BOTÓN QUE LA LLAME (COMO EL DE ADMIN)
window.cerrarSesion = function() {
    Swal.fire({
        title: '¿Cerrar Sesión?',
        text: "Tendrás que volver a ingresar para hacer pedidos o usar puntos.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, salir'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem("customerName");
            localStorage.removeItem("customerEmail");
            localStorage.removeItem("customerPhone");
            localStorage.removeItem("promoSubscribed");
            localStorage.removeItem("emailVerified");
            localStorage.removeItem("verifyCode");
            localStorage.removeItem("customerPass");
            
            verificarSesionActiva(); 
            
            // USAMOS EL TOAST ESTILO INDEX AQUÍ TAMBIÉN
            Swal.fire({
                toast: true,
                position: 'bottom-start',
                icon: 'success',
                title: 'Sesión cerrada',
                text: 'Vuelve pronto.',
                showConfirmButton: false,
                timer: 4000,
                timerProgressBar: true
            }).then(() => {
                if(window.location.pathname.includes("perfil.html") || window.location.pathname.includes("admin.html")) {
                    window.location.href = "index.html";
                }
            });
        }
    });
};

function mostrarToastExito(titulo, texto) {
    Swal.fire({
        toast: true,
        position: 'bottom-start',
        icon: 'success',
        title: titulo,
        text: texto,
        showConfirmButton: false,
        timer: 4000,
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