//ELECTOR DE CONSTANTES CON LAS CLASES ASIGNADAS EN HTML EN CHATBOT

const toggleBtn = document.querySelector(".chatbot-toggle")
const chatbotBox = document.getElementById("chatbot-box")
const closeBtn  = document.querySelector(".chatbot-close")
const mensajes  = document.getElementById("chatbot-messages")
const opciones  = document.getElementById("chatbot-options")
const inputField = document.getElementById("chatbot-input-field")
const sendBtn   = document.getElementById("chatbot-send")

toggleBtn.addEventListener("click", function(){
    chatbotBox.classList.toggle("active");
    if (chatbotBox.classList.contains("active")) {
        iniciarChat()
    }
});

closeBtn.addEventListener("click", function(){
    chatbotBox.classList.remove("active");
});

let datosCliente = {
  nombre: "",
  tipo: "",
  diseno: "",
  tamano: "",
  fecha: "",
  telefono: ""
}

let paso = 0  // controla en qué pregunta vamos

// ============================================
// 4. FUNCIONES PARA MOSTRAR MENSAJES
// ============================================
function mensajeBot(texto) {
  const div = document.createElement("div")
  div.classList.add("msg-bot")
  div.textContent = texto
  mensajes.appendChild(div)
  mensajes.scrollTop = mensajes.scrollHeight
}

function mensajeUsuario(texto) {
  const div = document.createElement("div")
  div.classList.add("msg-user")
  div.textContent = texto
  mensajes.appendChild(div)
  mensajes.scrollTop = mensajes.scrollHeight
}

function limpiarOpciones() {
  opciones.innerHTML = ""
}

function mostrarInput(visible) {
  document.querySelector(".chatbot-input").style.display = visible ? "flex" : "none"
}

// ============================================
// 5. EL FLUJO DEL CHAT
// ============================================
function iniciarChat() {
  if (paso !== 0) return  // si ya inició, no lo reinicia
  paso = 1
  mostrarInput(false)
  mensajeBot("¡Bienvenido a Muñecos XO! 🧸 ¿Con quién tengo el gusto?")
  mostrarInput(true)
}

function reiniciarChat() {
  mensajes.innerHTML = ""
  opciones.innerHTML = ""
  paso = 0
  datosCliente = {
    nombre: "",
    tipo: "",
    diseno: "",
    tamano: "",
    fecha: "",
    telefono: ""
  }
  iniciarChat() // ← agrega esta línea
}

function procesarRespuesta(respuesta) {

  mensajeUsuario(respuesta)
  limpiarOpciones()

  if (paso === 1) {
    // Guardamos el nombre
    datosCliente.nombre = respuesta
    paso = 2
    mostrarInput(false)
    mensajeBot("¡Hola " + respuesta + "! 💕 ¿Qué tipo de muñeco buscas?")
    // Mostramos botones
    crearBoton("📖 Catálogo", function() { procesarRespuesta("Catálogo") })
    crearBoton("✨ Personalizado", function() { procesarRespuesta("Personalizado") })

  } else if (paso === 2) {
    datosCliente.tipo = respuesta
    paso = 3
    if (respuesta === "Catálogo") {
      mensajeBot("¿Cuál diseño del catálogo te gustaría? Elige el número:")
      crearBoton("1-Ramo Girasol", function() { procesarRespuesta("1-Ramo Girasol") })
      crearBoton("2-Alegria", function() { procesarRespuesta("2-Alegria") })
      crearBoton("3-Ramo Oso", function() { procesarRespuesta("3-Ramo Oso") })
      crearBoton("4-Perrito", function() { procesarRespuesta("4-Perrito") })
      crearBoton("5-Llavero Girasol", function() { procesarRespuesta("5-Llavero Girasol") })
      crearBoton("6-Ramo Pumas", function() { procesarRespuesta("6-Ramo Pumas") })
      crearBoton("7-nezuko", function() { procesarRespuesta("7-nezuko") })
      crearBoton("8-Diablito", function() { procesarRespuesta("8-Diablito") })
      crearBoton("9-Yoshi", function() { procesarRespuesta("9-Yoshi") })
    } else {
      mensajeBot("¡Genial! 🎨 Descríbeme tu diseño personalizado o el que te gustaria que realice:")
      mostrarInput(true)
    }

  } else if (paso === 3) {
    datosCliente.diseno = respuesta
    paso = 4
    mostrarInput(false)
    mensajeBot("¿Qué tamaño necesitas?")
    crearBoton("8cm",  function() { procesarRespuesta("8cm") })
    crearBoton("15cm", function() { procesarRespuesta("15cm") })
    crearBoton("20cm", function() { procesarRespuesta("20cm") })
    crearBoton("30cm", function() { procesarRespuesta("30cm") })
    crearBoton("45cm", function() { procesarRespuesta("45cm") })
    crearBoton("80cm", function() { procesarRespuesta("80cm") })

  } else if (paso === 4) {
    datosCliente.tamano = respuesta
    paso = 5
    mensajeBot("¿Cuál es la fecha que deseas aproximada para tu entrega?")
    mostrarInput(true)

  } else if (paso === 5) {
    datosCliente.fecha = respuesta
    paso = 6
    mostrarInput(false)
    mensajeBot("¿Me compartes tu número de teléfono? 📱")
    mostrarInput(true)

  } else if (paso === 6) {
    datosCliente.telefono = respuesta
    paso = 7
    mostrarInput(false)
    // Confirmación final
    mensajeBot("¡Perfecto! Aquí tienes un resumen de tu pedido:")
    mensajeBot("👤 Tu nombre es: "   + datosCliente.nombre)
    mensajeBot("🧸 El Diseño que escogiste es: "   + datosCliente.diseno)
    mensajeBot("📏 Tamaño deseado es: "   + datosCliente.tamano)
    mensajeBot("📅 La fecha de entrega es para el dia: "  + datosCliente.fecha)
    mensajeBot("📱 Tu Teléfono que me proporcionaste es: " + datosCliente.telefono)
    mensajeBot("¡Listo! ya tengo tu pedido. Pronto me pondré en contacto contigo, gracias por escoger Muñecos XO! 💕")
    // Construimos el mensaje para WhatsApp
const mensaje = `Hola Muñecos XO!, he elegido mi diseño y quiero hacer mi pedido. Aquí están los detalles:
1.- Nombre del Cliente: ${datosCliente.nombre}
2.- Diseño seleccionado: ${datosCliente.diseno}
3.- Tamaño deseado: ${datosCliente.tamano}
4.- Entrega para el dia: ${datosCliente.fecha}
5.- El Teléfono proporcionado es: ${datosCliente.telefono}`

// Codificamos el mensaje para la URL
const mensajeCodificado = encodeURIComponent(mensaje)

// Número de WhatsApp de tu cliente (con código de México)
const numero = "527226769152"

// Creamos el botón de WhatsApp
setTimeout(function() {
  crearBoton("📲 Enviar por WhatsApp", function() {
    window.open("https://wa.me/" + numero + "?text=" + mensajeCodificado)
  }), crearBoton("🔄 Reiniciar chat", function() {
    reiniciarChat()
  })
})
  }
}

setTimeout(function() {
  reiniciarChat()
}, 1,500)

// ============================================
// 6. CREAR BOTONES DINÁMICOS
// ============================================
function crearBoton(texto, accion) {
  const btn = document.createElement("button")
  btn.textContent = texto
  btn.addEventListener("click", accion)
  opciones.appendChild(btn)
}

// ============================================
// 7. ENVIAR CON EL BOTÓN O CON ENTER
// ============================================
sendBtn.addEventListener("click", function() {
  const valor = inputField.value.trim()
  if (valor === "") return
  inputField.value = ""
  procesarRespuesta(valor)
})

inputField.addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    sendBtn.click()
  }
})