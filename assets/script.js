const cargar = document.getElementById('cargar')
const archivo = document.getElementById('archivo')
const mostrarCaracteres = document.getElementById('mostrarCaracteres')
const flujo = document.getElementById('flujo')

cargar.addEventListener('click', () => {
    archivo.click()
})

archivo.addEventListener('change', function () {
    var fr = new FileReader()
    fr.onload = function () {
        window.jar.updateCode(fr.result)
    }
    fr.readAsText(this.files[0])
})

flujo.addEventListener('click', () => {
    const codigo = window.jar.toString()
    window.visualizacionJar.updateCode(obtenerFlujoCaracteres(codigo))
})

mostrarCaracteres.addEventListener('click', () => {
    const codigo = window.jar.toString()
    mostrarFlujoCaracteres(codigo)
})

function obtenerFlujoCaracteres(texto) {
    let flujo = ''
    caracteresEspeciales = ['\n', '\t', ' ']

    for (var i = 0; i < texto.length; i++) {
        flujo += `${caracteresEspeciales.includes(texto.charAt(i)) ? obtenerNombreCaracter(texto.charAt(i)) : texto.charAt(i)}\n`
    }
    return flujo
}

function obtenerNombreCaracter(caracter) {
    if (caracter == '\n') return `Fin de línea, ASCII Code: ${'\r'.charCodeAt()} \nSalto de línea, ASCII Code: ${caracter.charCodeAt()}`
    if (caracter == '\t') return `Tabulador, ASCII Code: ${caracter.charCodeAt()}`
    if (caracter == ' ') return `Espacio en blanco, ASCII Code: ${caracter.charCodeAt()}`
}

function mostrarFlujoCaracteres(texto) {
    let flujo = ''
    caracteresEspeciales = ['\n', '\t', ' ']
    for (var i = 0; i < texto.length; i++) {
        alert(`${caracteresEspeciales.includes(texto.charAt(i)) ? obtenerNombreCaracter(texto.charAt(i)) : texto.charAt(i)}\n`)
    }
}

function limpiar(ventana) {
    if (ventana) window.jar.updateCode('')
    else window.visualizacionJar.updateCode('')
}
