const cargar = document.getElementById('cargar')
const seleccionar = document.getElementById('seleccionar')
const archivo = document.getElementById('archivo')
const mostrarCaracteres = document.getElementById('mostrarCaracteres')
const flujo = document.getElementById('flujo')

cargar.addEventListener('click', () => {
    archivo.click()
})

seleccionar.addEventListener('click', () => {
    if (window.jar.toString().trim() === '') return alert('No es posible seleccionar archivos si no se ha seleccionado ninguno anterior mente')
    archivo.click()
})

archivo.addEventListener('change', function () {
    var fr = new FileReader()
    fr.onload = function () {
        if (fr.result.trim() === '') return alert('El archivo está vacío')
        const codigoNuevo = `${window.jar.toString() == '' ? '' : window.jar.toString() + '\n'}${fr.result}`
        console.log(codigoNuevo)
        window.jar.updateCode(codigoNuevo)
        archivo.value = ''
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
    caracteresEspeciales = ['\n', '\t', ' ']
    for (var i = 0; i < texto.length; i++) {
        const caracter = texto.charAt(i)
        if (!caracteresEspeciales.includes(caracter)) {
            if (confirm(caracter)) continue
            break
        }
        if (caracter != '\n') {
            if (confirm(obtenerNombreCaracter(caracter))) continue
            break
        }
        alert(`Fin de línea, ASCII Code: ${'\r'.charCodeAt()}`)
        if (confirm(`Salto de línea, ASCII Code: ${caracter.charCodeAt()}`)) break
    }
}

function limpiar(ventana) {
    if (ventana) window.jar.updateCode('')
    else window.visualizacionJar.updateCode('')
}
