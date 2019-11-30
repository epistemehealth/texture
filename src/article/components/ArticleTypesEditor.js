import DropdownEditor from '../shared/DropdownEditor'
import { ARTICLE_TYPES } from '../ArticleConstants'

export default class ArticleTypesEditor extends DropdownEditor {
  _getLabel () {
    return this.getLabel('Select article type')
  }

  _getValues () {
    return ARTICLE_TYPES
  }
}
