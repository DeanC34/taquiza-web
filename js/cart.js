// ================================
// SISTEMA DE CARRITO
// ================================

let cart = [];

// Agregar producto al carrito
function addToCart(name, price){

const existingItem = cart.find(item => item.name === name);

if(existingItem){
existingItem.quantity++;
}else{
cart.push({
name:name,
price:price,
quantity:1
});
}

updateCart();
saveCustomerData(name);

}

// Eliminar producto del carrito
function removeFromCart(index){

cart.splice(index,1);
updateCart();

}

// Actualizar interfaz del carrito
function updateCart(){

const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");

const totalItems = cart.reduce((sum,item)=>sum+item.quantity,0);

cartCount.textContent = totalItems;

let total = 0;
let html = "";

cart.forEach((item,index)=>{

const subtotal = item.price * item.quantity;
total += subtotal;

html += `
<div class="cart-item">

<h4>${item.name}</h4>

<p>Cantidad: ${item.quantity}</p>

<p>$${subtotal}</p>

<button onclick="removeFromCart(${index})">
Eliminar
</button>

</div>
`;

});

cartItems.innerHTML = html;
cartTotal.textContent = "Total: $" + total;

saveCart();

}

// ================================
// GUARDAR CARRITO EN EL NAVEGADOR
// ================================

function saveCart(){

localStorage.setItem("cart",JSON.stringify(cart));

}

// ================================
// MOSTRAR / OCULTAR CARRITO
// ================================

function toggleCart(){

const modal = document.getElementById("cartModal");

modal.classList.toggle("active");

}

// ================================
// ENVIAR PEDIDO A WHATSAPP
// ================================

function sendToWhatsApp(){

if(cart.length === 0){
alert("Tu carrito está vacío");
return;
}

saveCustomer();

let message = "🌮 Nuevo Pedido - Taquiza La Rana 🌮\n\n";

let total = 0;

cart.forEach(item => {

const subtotal = item.price * item.quantity;

total += subtotal;

message += `${item.name}\n`;
message += `Cantidad: ${item.quantity}\n`;
message += `Subtotal: $${subtotal}\n\n`;

});

message += `Total: $${total}`;

const phone = "5219613591178";

const url =
`https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

window.open(url,"_blank");

}

// ================================
// CRM - HISTORIAL DE PRODUCTOS
// ================================

function saveCustomerData(product){

let history = JSON.parse(localStorage.getItem("customerData")) || [];

history.push(product);

localStorage.setItem(
"customerData",
JSON.stringify(history)
);

}

// ================================
// CRM - RECOMENDADOR DE PLATILLOS
// ================================

function recommendProducts(){

let history = JSON.parse(localStorage.getItem("customerData"));

if(!history) return;

let mostOrdered = history.reduce((a,b)=>
history.filter(v=>v===a).length >=
history.filter(v=>v===b).length ? a:b
);

console.log("Producto recomendado:", mostOrdered);

}

// ================================
// CRM - GUARDAR CLIENTE
// ================================

function saveCustomer(){

let name = prompt("Ingresa tu nombre");

localStorage.setItem("customerName",name);

}