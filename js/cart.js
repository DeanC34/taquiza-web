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

if(cart.length === 0){

cartItems.innerHTML =
'<div class="empty-cart">🛒<br><br>Tu carrito está vacío</div>';

cartTotal.textContent = "Total: $0";

return;

}

cart.forEach((item,index)=>{

const subtotal = item.price * item.quantity;
total += subtotal;

html += `
<div class="cart-item">

<div class="cart-item-info">
<h4>${item.name}</h4>
<p>Cantidad: ${item.quantity} x $${item.price}</p>
<div class="cart-item-price">$${subtotal}</div>
</div>

<button class="remove-btn"
onclick="removeFromCart(${index})">
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

// ================================
// LOGIN GOOGLE (CRM)
// ================================

function handleCredentialResponse(response){

const data = parseJwt(response.credential);

localStorage.setItem("customerName", data.name);
localStorage.setItem("customerEmail", data.email);

document.getElementById("userInfo").innerHTML =
"👤 " + data.name;

}

function parseJwt (token) {
var base64Url = token.split('.')[1];
var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
}).join(''));

return JSON.parse(jsonPayload);
}

// ================================
// BUSQUEDA DE PRODUCTOS
// ================================

function searchProducts(){

let input = document.getElementById("searchInput").value.toLowerCase();

let products = document.querySelectorAll(".product-card");

products.forEach(product=>{

let name = product.querySelector(".product-name").innerText.toLowerCase();

if(name.includes(input)){
product.style.display="block";
}else{
product.style.display="none";
}

});

}

// ================================
// MOSTRAR RECOMENDADOS
// ================================

function showRecommended(){

let history = JSON.parse(localStorage.getItem("customerData"));

if(!history || history.length === 0){
return;
}

let mostOrdered = history.reduce((a,b)=>
history.filter(v=>v===a).length >=
history.filter(v=>v===b).length ? a:b
);

document.getElementById("recommendedProducts").innerHTML =
`<div class="product-card">
<div class="product-name">${mostOrdered}</div>
<p>Basado en tus pedidos anteriores</p>
</div>`;

}