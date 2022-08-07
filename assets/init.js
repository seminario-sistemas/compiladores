import { CodeJar } from './plugins/js/codejar.js'
import { withLineNumbers } from './plugins/js/linenumbers.js'

const editor = document.querySelector('#editor')
const visualizacion = document.querySelector('#visualizacion')

const highlight = (editor) => {
    editor.textContent = editor.textContent
    hljs.highlightBlock(editor)
}

const visualizacionHighlight = (visualizacion) => {
    visualizacion.textContent = visualizacion.textContent
    hljs.highlightBlock(visualizacion)
}

window.jar = CodeJar(editor, withLineNumbers(highlight))
window.visualizacionJar = CodeJar(visualizacion, visualizacionHighlight)
