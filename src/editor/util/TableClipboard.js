import {
  DefaultDOMElement as DOM, platform, getRangeFromMatrix
} from 'substance'

export default class TableClipboard {

  constructor(tableEditing) {
    this.tableEditing = tableEditing
  }

  onCopy(e) {
    e.preventDefault()
    e.stopPropagation()
    if (e.clipboardData) {
      let data = this._copy()
      if (data) {
        // store as plain text and html
        e.clipboardData.setData('text/plain', data.text)
        try {
          e.clipboardData.setData('text/html', data.html)
        } catch(err) {
          // fails under some browsers
        }
      }
    }
  }

  onCut(e) {
    this.onCopy(e)
    this._cut()
  }

  onPaste(event) {
    let clipboardData = event.clipboardData
    let types = {}
    for (let i = 0; i < clipboardData.types.length; i++) {
      types[clipboardData.types[i]] = true
    }
    event.preventDefault()
    event.stopPropagation()
    let plainText
    let html
    if (types['text/plain']) {
      plainText = clipboardData.getData('text/plain')
    }
    if (types['text/html']) {
      html = clipboardData.getData('text/html')
    }
    // WORKAROUND: FF does not provide HTML coming in from other applications
    // so fall back to pasting plain text
    if (platform.isFF && !html) {
      this._pastePlainText(plainText)
      return
    }
    // if we have content given as HTML we let the importer assess the quality first
    // and fallback to plain text import if it's bad
    if (html) {
      this._pasteHtml(html, plainText)
    } else {
      this._pastePlainText(plainText)
    }
  }

  _pasteHtml(html, plainText) {
    let vals = this._htmlToVals(html)
    if (vals && vals.length > 0) {
      let { startRow, startCol } = this._getRange()
      this._setValues(startRow, startCol, vals)
    } else {
      this._pastePlainText(plainText)
    }
  }

  _pastePlainText(plainText) {
    let sel = this._getSelection()
    if (!sel) return
    const rowIdx = sel.anchorRow
    const colIdx = sel.anchorCol
    // TODO: we could try to detect csv/tsv in the plain text
    // and do a structured paste
    this.tableEditing.setValue(rowIdx, colIdx, plainText)
  }


  _copy() {
    const table = this.tableEditing.getTable()
    const range = this._getRange()
    if (!range) return null
    let rows = getRangeFromMatrix(table.getCellMatrix(), range.startRow, range.startCol, range.endRow, range.endCol, true)
    let vals = rows.map(row => {
      return row.map(cell => {
        return cell.textContent
      })
    })
    let text = this._valsToPlainText(vals)
    let html = this._valsToHTML(vals)
    return { text, html }
  }

  _cut() {
    const range = this._getRange()
    if (!range) return
    this._clearValues(range.startRow, range.startCol, range.endRow, range.endCol)
  }

  _valsToHTML(vals) {
    let bodyHTML = vals.map((rowVals) => {
      const rowHTML = rowVals.map((val) => {
        return `<td>${val}</td>`
      }).join('')
      return `<tr>${rowHTML}</tr>`
    }).join('\n')
    return `<table>${bodyHTML}</table>`
  }

  _valsToPlainText(vals) {
    return vals.map((rowVals) => {
      return rowVals.join('\t')
    }).join('\n')
  }

  _htmlToVals(html) {
    let doc = DOM.parseHTML(html)
    let table = doc.find('table')
    if (table) {
      let rowEls = table.findAll('tr')
      let vals = rowEls.map((rowEl) => {
        return rowEl.children.map((cell) => {
          return cell.textContent
        })
      })
      return vals
    }
  }

  _setValues(startRow, startCol, vals) {
    this.tableEditing.setValues(startRow, startCol, vals)
  }

  _clearValues(startRow, startCol, endRow, endCol) {
    this.tableEditing.clearValues(startRow, startCol, endRow, endCol)
  }

  _getSelection() {
    this.tableEditing.getSelectionData()
  }

  _getRange() {
    return this.tableEditing.getSelectedRange()
  }

}