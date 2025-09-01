import type { HTMLAttributes } from 'astro/types'
import { getConfig } from '@libs/config'

export function getChassisCssProps(direction: 'rtl' | undefined) {
  let cxCssLinkHref = '/assets/css/chassis'

  if (direction === 'rtl') {
    cxCssLinkHref = `${cxCssLinkHref}.rtl`
  }

  if (import.meta.env.PROD) {
    cxCssLinkHref = `${cxCssLinkHref}.min`
  }

  cxCssLinkHref = `${cxCssLinkHref}.css`

  const cxCssLinkProps: HTMLAttributes<'link'> = {
    href: cxCssLinkHref,
    rel: 'stylesheet'
  }

  if (import.meta.env.PROD) {
    cxCssLinkProps.integrity = direction === 'rtl' ? getConfig().cdn.css_rtl_hash : getConfig().cdn.css_hash
  }

  return cxCssLinkProps
}

export function getChassisJsProps() {
  let cxJsScriptSrc = '/assets/js/chassis.bundle'

  if (import.meta.env.PROD) {
    cxJsScriptSrc = `${cxJsScriptSrc}.min`
  }

  cxJsScriptSrc = `${cxJsScriptSrc}.js`

  const cxJsLinkProps: HTMLAttributes<'script'> = {
    src: cxJsScriptSrc
  }

  if (import.meta.env.PROD) {
    cxJsLinkProps.integrity = getConfig().cdn.js_bundle_hash
  }

  return cxJsLinkProps
}
