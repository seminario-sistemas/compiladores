const cargar = document.getElementById('cargar')
const seleccionar = document.getElementById('seleccionar')
const archivo = document.getElementById('archivo')
const mostrarCaracteres = document.getElementById('mostrarCaracteres')
const flujo = document.getElementById('flujo')
const lineaColumnas = document.getElementById('lineaColumnas')
const gridContainer = document.getElementById('gridContainer')
const paginationContainer = document.getElementById('paginationContainer')
const editarPalabra = document.getElementById('editarPalabra')
const agregarPalabra = document.getElementById('agregarPalabra')

const base_url = 'http://localhost:3000'
const grid = {
    obtenerDatos: async function (offset, limit) {
        const params = {
            offset,
            limit,
            order: 'id_palabra_reservada',
            orderType: 'asc',
        }
        const res = await llamarApi('POST', `${base_url}/obtenerPalabras`, params)
        this.cantidadRegistros = res.totalCount
        return res.data
    },
    init: async function () {
        this.datos = await this.obtenerDatos(this.offset, this.limit)
        this.renderizar(this.datos)
        this.renderizarPaginacion()
    },
    renderizar: function (palabras) {
        let tablaPalabras = `<table class="table table-hover">
        <thead>
            <tr>
                <th>#</th>
                <th width="80%">Palabra</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>`
        for (const palabra of palabras) {
            tablaPalabras += `<tr>
                <th scope="row">${palabra.id_palabra_reservada}</th>
                <td width="80%">${palabra.palabra_reservada}</td>
                <td>
                    <button class="btn btn-light" onclick="mostrarEdicion(${palabra.id_palabra_reservada}, '${palabra.palabra_reservada}')"><i class="bi bi-pencil-square" tooltip="Editar"></i></button>
                    <button class="btn btn-light" onclick="confirmarEliminacion(${palabra.id_palabra_reservada})"><i class="bi bi-trash" tooltip="Eliminar"></i></button>
                </td>
            </tr>`
        }
        tablaPalabras += '</tbody></table>'
        gridContainer.innerHTML = tablaPalabras
    },
    renderizarPaginacion: function () {
        let html = ``
        const paginasDecimal = this.cantidadRegistros / this.limit
        if (Number.isInteger(paginasDecimal)) this.paginas = paginasDecimal
        this.paginas = paginasDecimal != 1 ? parseInt(paginasDecimal) + 1 : paginasDecimal

        const anterior = this.paginaActual !== 1
        const siguiente = this.paginaActual !== this.paginas

        html += anterior
            ? `<button type="button" class="btn btn-light" onclick="grid.anterior()">Anterior</button>`
            : `<button type="button" class="btn btn-light">Anterior</button>`

        for (let i = 1; i <= this.paginas; i++) {
            html += `<button type="button" class="btn btn-light ${this.paginaActual == i ? 'active' : ''}" onclick="grid.paginar(${i})">${i}</button>`
        }

        html += siguiente
            ? `<button type="button" class="btn btn-light" onclick="grid.siguiente()">Siguiente</button>`
            : `<button type="button" class="btn btn-light">Siguiente</button>`

        paginationContainer.innerHTML = html
    },
    anterior: async function () {
        if (this.paginaActual == 1) return
        this.paginaActual = this.paginaActual - 1
        this.offset = this.offset - this.limit
        this.renderizar(await this.obtenerDatos(this.offset, this.limit))
        this.renderizarPaginacion()
    },
    siguiente: async function () {
        if (this.paginaActual == this.paginas) return
        this.paginaActual = this.paginaActual + 1
        this.offset = this.offset + this.limit
        this.renderizar(await this.obtenerDatos(this.offset, this.limit))
        this.renderizarPaginacion()
    },
    paginar: async function (pagina) {
        if (pagina == this.paginaActual || pagina > this.paginas || pagina < 1) return
        this.paginaActual = pagina
        this.offset = (pagina - 1) * this.limit
        this.renderizar(await this.obtenerDatos(this.offset, this.limit))
        this.renderizarPaginacion()
    },
    agregar: async function (palabra) {
        const res = await llamarApi('POST', `${base_url}/palabras`, { palabra })
        this.paginar(this.paginas)
    },
    eliminar: async function (id) {
        const res = await llamarApi('DELETE', `${base_url}/palabras/${id}`)
        alert(res.message)
        this.renderizar(await this.obtenerDatos(this.offset, this.limit))
        this.renderizarPaginacion()
    },
    editar: async function (id, palabra) {
        const res = await llamarApi('PUT', `${base_url}/palabras/${id}`, { palabra })
        alert(res.message)
        this.renderizar(await this.obtenerDatos(this.offset, this.limit))
        this.renderizarPaginacion()
    },
    cantidadRegistros: 0,
    datos: [],
    paginaActual: 1,
    paginas: 1,
    limit: 10,
    offset: 0,
}

cargar.addEventListener('click', () => {
    if (window.jar.toString().trim() !== '') {
        if (confirm('¿Desea sobreescribir el código actual?')) {
            window.jar.updateCode('')
            return archivo.click()
        }
        return
    }
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
        const codigoNuevo = `${window.jar.toString() == '' ? '' : window.jar.toString().trim() + '\n'}${fr.result}`
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

lineaColumnas.addEventListener('click', () => {
    const codigo = window.jar.toString()
    window.visualizacionJar.updateCode(obtenerFlujoCaracteresLineaColumna(codigo))
})

mostrarCaracteres.addEventListener('click', () => {
    const codigo = window.jar.toString()
    mostrarFlujoCaracteres(codigo)
})

editarPalabra.addEventListener('click', () => {
    const palabra = document.getElementById('palabraEdicion')
    const palabraId = document.getElementById('idPalabra')
    grid.editar(palabraId.value, palabra.value)
    obtenerModal('edicion').hide()
    obtenerModal('mantenimientoPalabras').show()
    grid.init()
})

agregarPalabra.addEventListener('click', () => {
    const palabra = document.getElementById('palabra')
    grid.agregar(palabra.value)
    obtenerModal('creacion').hide()
    obtenerModal('mantenimientoPalabras').show()
    grid.init()
})

function obtenerFlujoCaracteres(texto) {
    let flujo = ''
    caracteresEspeciales = ['\n', '\t', ' ', '.', '(', ')', '{', '}', "'", '"', '[', ']', ',']

    for (var i = 0; i < texto.length; i++) {
        flujo += `${caracteresEspeciales.includes(texto.charAt(i)) ? obtenerNombreCaracter(texto.charAt(i)) : texto.charAt(i)}\n`
    }
    return flujo
}

function obtenerFlujoCaracteresLineaColumna(texto) {
    let flujo = ''
    caracteresEspeciales = ['\n', '\t', ' ', '.', '(', ')', '{', '}', "'", '"', '[', ']', ',']
    const lineas = texto.split('\n')
    lineas.forEach((linea, indice) => {
        const numeroLinea = indice + 1
        let numeroColumna = 0
        let tabs = 0
        for (var i = 0; i < linea.length; i++) {
            numeroColumna = i + 1
            const caracter = linea.charAt(i)
            if (caracter == '\t') {
                tabs++
            }
            if (caracter !== '\n') {
                flujo += `${caracteresEspeciales.includes(caracter) ? obtenerNombreCaracter(caracter) : caracter}  Línea: ${numeroLinea} Columna: ${
                    tabs != 0 ? numeroColumna + 4 * tabs : numeroColumna
                }\n`
                continue
            }
        }
        flujo += `Fin de línea, ASCII Code: ${'\r'.charCodeAt()}  Línea: ${numeroLinea} Columna: ${
            linea.length + 1 + 4 * tabs
        } \nSalto de línea, ASCII Code: ${'\n'.charCodeAt()}  Línea: ${numeroLinea} Columna: ${linea.length + 4 * tabs + 2}\n`
    })
    return flujo
}

function obtenerNombreCaracter(caracter) {
    if (caracter == '\n') return `Fin de línea, ASCII Code: ${'\r'.charCodeAt()} \nSalto de línea, ASCII Code: ${caracter.charCodeAt()}`
    if (caracter == '\t') return `Tabulador, ASCII Code: ${caracter.charCodeAt()}`
    if (caracter == ' ') return `${caracter} - Espacio en blanco - ASCII Code: ${caracter.charCodeAt()}`
    if (caracter == '.') return `${caracter} - Punto - ASCII Code: ${caracter.charCodeAt()}`
    if (caracter == ',') return `${caracter} - Coma - ASCII Code: ${caracter.charCodeAt()}`
    if (caracter == '(') return `${caracter} - Paréntesis abierto - ASCII Code: ${caracter.charCodeAt()}`
    if (caracter == ')') return `${caracter} - Paréntesis cerrado - ASCII Code: ${caracter.charCodeAt()}`
    if (caracter == '{') return `${caracter} - Llave abierta - ASCII Code: ${caracter.charCodeAt()}`
    if (caracter == '}') return `${caracter} - Llave cerrada - ASCII Code: ${caracter.charCodeAt()}`
    if (caracter == "'") return `${caracter} - Comilla simple - ASCII Code: ${caracter.charCodeAt()}`
    if (caracter == '"') return `${caracter} - Comilla doble - ASCII Code: ${caracter.charCodeAt()}`
    if (caracter == '[') return `${caracter} - Corchete abierto - ASCII Code: ${caracter.charCodeAt()}`
    if (caracter == ']') return `${caracter} - Corchete cerrado - ASCII Code: ${caracter.charCodeAt()}`
}

function mostrarFlujoCaracteres(texto) {
    caracteresEspeciales = ['\n', '\t', ' ', '.', '(', ')', '{', '}', "'", '"', '[', ']', ',']
    const lineas = texto.split('\n')
    for (let j = 0; j < lineas.length; j++) {
        const numeroLinea = j + 1
        let numeroColumna = 0
        let tabs = 0
        const linea = lineas[j]
        for (var i = 0; i < linea.length; i++) {
            numeroColumna = i + 1
            const caracter = linea.charAt(i)
            if (caracter == '\t') {
                tabs++
            }
            if (caracter !== '\n') {
                if (
                    !confirm(
                        `${caracteresEspeciales.includes(caracter) ? obtenerNombreCaracter(caracter) : caracter}  Línea: ${numeroLinea} Columna: ${
                            tabs != 0 ? numeroColumna + 4 * tabs : numeroColumna
                        }\n`
                    )
                )
                    break
            }
        }
        if (!confirm(`Fin de línea, ASCII Code: ${'\r'.charCodeAt()}  Línea: ${numeroLinea} Columna: ${linea.length + 1 + 4 * tabs}`)) break
        if (!confirm(`Salto de línea, ASCII Code: ${'\n'.charCodeAt()}  Línea: ${numeroLinea} Columna: ${linea.length + 4 * tabs + 2}`)) break
    }
}

function limpiar(ventana) {
    if (ventana) window.jar.updateCode('')
    else window.visualizacionJar.updateCode('')
}

function mostrarEdicion(id, palabra) {
    const idPalabra = document.getElementById('idPalabra')
    const inputPalabra = document.getElementById('palabraEdicion')
    idPalabra.value = id
    inputPalabra.value = palabra
    const mantenimientoPalabras = obtenerModal('mantenimientoPalabras')
    mantenimientoPalabras.hide()
    const edicion = obtenerModal('edicion')
    edicion.show()
}

async function confirmarEliminacion(id) {
    const respuesta = await confirm('¿Estás seguro de eliminar esta palabra?')
    if (!respuesta) return
    grid.eliminar(id)
}

async function llamarApi(method, url, params = false) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: params ? JSON.stringify(params) : '',
    }
    if (!params) delete options.body
    return fetch(url, options)
        .then((res) => res.json())
        .catch((err) => {})
}

function obtenerModal(id) {
    return new bootstrap.Modal(document.getElementById(id), {
        keyboard: false,
    })
}
