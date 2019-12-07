export default class PermissionsConverter {
  get type () { return 'permission' }

  get tagName () { return 'permissions' }

  import (el, node, importer) {
    // Extract figure permissions
    let copyrightStatementEl = el.find('copyright-statement')
    if (copyrightStatementEl) {
      node.copyrightStatement = copyrightStatementEl.textContent
    }
    let copyrightYearEl = el.find('copyright-year')
    if (copyrightYearEl) {
      node.copyrightYear = copyrightYearEl.textContent
    }
    let copyrightHolderEl = el.find('copyright-holder')
    if (copyrightHolderEl) {
      node.copyrightHolder = copyrightHolderEl.textContent
    }
    // TODO: it would be more natural and explicit to do el.find('ali:license-rec')
    let licenseRefEl = el.find('license_ref')
    if (licenseRefEl) {
      node.license = licenseRefEl.textContent
    }
    let licenseP = el.find('license > license-p')
    if (licenseP) {
      node.licenseText = importer.annotatedText(licenseP, [node.id, 'licenseText'])
    }
  }

  export (node, el, exporter) {
    let $$ = exporter.$$
    if (node.copyrightStatement) {
      el.append($$('copyright-statement').append(node.copyrightStatement))
    } else {
      el.append($$('copyright-statement').append('Copyright © ' + new Date().getFullYear() + ' The Author(s)'))
    }
    if (node.copyrightYear) {
      el.append($$('copyright-year').append(node.copyrightYear))
    } else {
      el.append($$('copyright-year').append(new Date().getFullYear()))
    }
    if (node.copyrightHolder) {
      el.append($$('copyright-holder').append(node.copyrightHolder))
    } else {
      el.append($$('copyright-holder').append('The Author(s)'))
    }
    if (node.license || node.licenseText) {
      let licenseEl = $$('license')
      if (node.license) {
        licenseEl.attr( 'license-type', 'open-access' ).attr( 'xlink:href', node.license )
      }
      if (node.licenseText) {
        licenseEl.append(
          $$('license-p').append(
            exporter.annotatedText([node.id, 'licenseText'])
          )
        )
      } else if (node.license.includes('by/4.0')) {
      licenseEl.append($$('license-p').append('Except where otherwise noted, the content of this article is licensed under Creative Commons Attribution 4.0 International License, which permits unrestricted use, distribution, and reproduction in any medium, provided the original author and source are credited.'))
    } else if (node.license.includes('by-nc')) {
      licenseEl.append($$('license-p').append('Except where otherwise noted, the content of this article is licensed under Creative Commons Attribution-NonCommercial 4.0 International License. In addition to this license, reuse of a reasonable portion of the work for fair dealing purposes under Australian copyright law, such as medical research, education, scholarship, or not-for-profit or charitable purposes, is also permitted. For additional permissions, please contact the corresponding author.'))
    }
      el.append(licenseEl)
    }
  }
}
