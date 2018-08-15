
export default class ReferenceCollectionModel {
  constructor (api, node) {
    this._api = api
    this._node = node
  }

  get type () { return 'references' }

  get id () {
    return 'references'
  }

  get isCollection () {
    return true
  }

  getItems () {
    let refs = this._api.getReferenceManager().getBibliography()
    let result = refs.map(ref => this._getItem(ref.id))
    return result
  }

  addItem (item) {
    return this._api.addItemToCollection(item, this)
  }

  addItems (items) {
    this._api.addReferences(items, this)
  }

  removeItem (item) {
    this._api.deleteReference(item, this)
  }

  _getItem (id) {
    let article = this._api.getArticle()
    let node = article.get(id)
    if (!node) {
      console.warn(`No db entry found for ${id}.`)
      return undefined
    }

    let model = this._api._getModelForNode(node)
    return model
  }
}
