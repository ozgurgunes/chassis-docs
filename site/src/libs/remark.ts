import type { Root } from 'mdast'
import type { MdxJsxAttribute, MdxJsxExpressionAttribute } from 'mdast-util-mdx-jsx'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'
import { getConfig } from './config'

// [[config:foo]]
// [[config:foo.bar]]
const configRegExp = /\[\[config:(?<name>[\w\.]+)]]/g
// [[docsref:/foo]]
// [[docsref:/foo/bar#baz]]
const docsrefRegExp = /\[\[docsref:(?<path>[\w\.\/#-]+)]]/g

// A remark plugin to replace config values embedded in markdown (or MDX) files.
// For example, [[config:foo]] will be replaced with the value of the `foo` key in the `config.yml` file.
// Nested values are also supported, e.g. [[config:foo.bar]].
// Note: this also works in frontmatter.
// Note: this plugin is meant to facilitate the migration from Hugo to Astro while keeping the differences to a minimum.
// At some point, this plugin should maybe be removed and embrace a more MDX-friendly syntax.
export const remarkCxConfig: Plugin<[], Root> = function () {
  return function remarkCxConfigPlugin(ast, file) {
    if (containsFrontmatter(file.data.astro)) {
      replaceInFrontmatter(file.data.astro.frontmatter, replaceConfigInText)
    }

    // https://github.com/syntax-tree/mdast#nodes
    // https://github.com/syntax-tree/mdast-util-mdx-jsx#nodes
    visit(ast, ['code', 'definition', 'image', 'inlineCode', 'link', 'mdxJsxFlowElement', 'text'], (node) => {
      switch (node.type) {
        case 'code':
        case 'inlineCode':
        case 'text': {
          node.value = replaceConfigInText(node.value)
          break
        }
        case 'image': {
          if (node.alt) {
            node.alt = replaceConfigInText(node.alt)
          }

          node.url = replaceConfigInText(node.url)
          break
        }
        case 'definition':
        case 'link': {
          node.url = replaceConfigInText(node.url)
          break
        }
        case 'mdxJsxFlowElement': {
          node.attributes = replaceConfigInAttributes(node.attributes)
          break
        }
      }
    })
  }
}

export function replaceConfigInText(text: string) {
  return text.replace(configRegExp, (_match, path) => {
    const value = getConfigValueAtPath(path)

    if (!value) {
      throw new Error(`Failed to find a valid configuration value for '${path}'.`)
    }

    return value
  })
}

function replaceConfigInAttributes(attributes: (MdxJsxAttribute | MdxJsxExpressionAttribute)[]) {
  return attributes.map((attribute) => {
    if (attribute.type === 'mdxJsxAttribute' && typeof attribute.value === 'string') {
      attribute.value = replaceConfigInText(attribute.value)
    }

    return attribute
  })
}

function getConfigValueAtPath(path: string) {
  const config = getConfig()

  const value = path.split('.').reduce((values, part) => {
    if (!values || typeof values !== 'object') {
      return undefined
    }

    return (values as any)?.[part]
  }, config as unknown)

  return typeof value === 'string' ? value : undefined
}

function replaceInFrontmatter(record: Record<string, unknown>, replacer: (value: string) => string) {
  for (const [key, value] of Object.entries(record)) {
    if (typeof value === 'string') {
      record[key] = replacer(value)
    } else if (Array.isArray(value)) {
      record[key] = value.map((arrayValue) => {
        return typeof arrayValue === 'string'
          ? replacer(arrayValue)
          : typeof arrayValue === 'object'
            ? replaceInFrontmatter(arrayValue, replacer)
            : arrayValue
      })
    }
  }

  return record
}

function containsFrontmatter(data: unknown): data is { frontmatter: Record<string, unknown> } {
  return data != undefined && typeof data === 'object' && 'frontmatter' in data
}
