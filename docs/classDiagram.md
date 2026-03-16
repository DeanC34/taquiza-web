classDiagram
    class MenuDigital {
        -HTMLDocument document
        -Array~CartItem~ cart
        +inicializar()
        +renderizarMenu()
    }
    
    class Producto {
        -String name
        -Number price
        -String description
        -String imageUrl
        -String emoji
        +mostrarEnMenu()
    }
    
    class CartItem {
        -String name
        -Number price
        -Number quantity
        +calcularSubtotal() Number
    }
    
    class CarritoManager {
        -Array~CartItem~ items
        -Number totalItems
        -Number totalPrice
        +addToCart(name, price)
        +removeFromCart(index)
        +updateCart()
        +calcularTotal() Number
        +obtenerCantidadTotal() Number
        +estaVacio() Boolean
        +limpiarCarrito()
    }
    
    class UIController {
        -HTMLElement cartModal
        -HTMLElement cartCount
        -HTMLElement cartItems
        -HTMLElement cartTotal
        +toggleCart()
        +actualizarContador(cantidad)
        +renderizarCarrito(items)
        +mostrarCarritoVacio()
        +showNotification(mensaje)
        +animarBadge()
    }
    
    class WhatsAppService {
        -String phoneNumber
        -String businessName
        +sendToWhatsApp(cart)
        +generarMensaje(items, total) String
        +formatearProducto(item) String
        +construirURL(mensaje) String
        +abrirWhatsApp(url)
    }
    
    class Categoria {
        -String nombre
        -String emoji
        -Array~Producto~ productos
        +agregarProducto(producto)
        +renderizar()
    }
    
    class NotificationService {
        +mostrarExito(mensaje)
        +mostrarError(mensaje)
        +mostrarAlerta(mensaje)
    }
    
    MenuDigital "1" *-- "0..*" Categoria : contiene
    Categoria "1" *-- "1..*" Producto : contiene
    CarritoManager "1" *-- "0..*" CartItem : gestiona
    MenuDigital "1" -- "1" CarritoManager : usa
    MenuDigital "1" -- "1" UIController : usa
    MenuDigital "1" -- "1" WhatsAppService : usa
    MenuDigital "1" -- "1" NotificationService : usa
    UIController "1" -- "1" CarritoManager : consulta
    WhatsAppService "1" -- "1" CarritoManager : lee
    CartItem "1" -- "1" Producto : referencia
    
    note for CartItem "Representa un producto\nen el carrito con cantidad"
    note for WhatsAppService "Número: 5219613591178"
    note for CarritoManager "Implementado como\narray global 'cart'"