export default class SubscriptConverter {
  get type () { return 'subscript' }

  get tagName () { return 'sub' }

  export (node, el, exporter) {
    el.removeAttribute('id')
  }
}
