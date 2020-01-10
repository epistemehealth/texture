export default class ItalicConverter {
  get type () { return 'italic' }

  get tagName () { return 'italic' }

  export (node, el, exporter) {
    el.removeAttribute('id')
  }
}
