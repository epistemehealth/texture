import { getLabel } from '../../shared/nodeHelpers'

export default class XrefConverter {
  get type () { return 'xref' }

  get tagName () { return 'xref' }

  import (el, node) {
    node.refType = el.attr('ref-type')
    node.refTargets = (el.attr('rid') || '').split(/\s/)
  }

  export (node, el, exporter) {
    el.removeAttribute('id')
    el.attr('ref-type', node.refType)
    let label = getLabel(node)
    if (node.refType == 'bibr') {
      let targs = label.split(/\D+/).filter(function checknum(label){return label > 0})
      el.attr('rid', 'ref' + targs[0])
    } else {
      el.attr('rid', node.refTargets[0])
    }
    if (label) {
      el.text(label)
    }
  }
}
