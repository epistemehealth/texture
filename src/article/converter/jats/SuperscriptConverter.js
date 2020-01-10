export default class SuperscriptConverter {
  get type () { return 'superscript' }

  get tagName () { return 'sup' }

  export (node, el, exporter) {
    el.removeAttribute('id')
  }
}
