import type { RouteLocationNamedRaw, Router, RouteRecordNormalized } from 'vue-router'
import type { NavIconName } from '@/constants/navIcons'

export interface NavItem {
  label: string
  to: RouteLocationNamedRaw
  permission?: string
  icon?: NavIconName
}

export interface NavSection {
  title: string
  items: NavItem[]
}

type Collected = NavItem & {
  section: string
  sectionOrder: number
  order: number
}

function routeMenuLabel(route: RouteRecordNormalized): string {
  const t = route.meta.title
  return typeof t === 'string' && t.length > 0 ? t : String(route.name ?? '')
}

/**
 * 從已註冊路由組裝側欄：僅包含設定了 `meta.nav` 且有 `name` 的路由。
 * 分區以 `nav.section` 分組；`sectionOrder` / `order` 數字小者排前。
 */
export function buildNavSectionsFromRouter(router: Router): NavSection[] {
  const collected: Collected[] = []

  for (const route of router.getRoutes()) {
    const nav = route.meta.nav
    if (!nav || route.name === undefined || route.name === null) continue

    const permission =
      typeof route.meta.permission === 'string' && route.meta.permission.length > 0
        ? route.meta.permission
        : undefined

    collected.push({
      section: nav.section,
      sectionOrder: nav.sectionOrder ?? 100,
      order: nav.order ?? 0,
      label: routeMenuLabel(route),
      to: { name: route.name },
      permission,
      icon: nav.icon,
    })
  }

  const sectionMeta = new Map<string, { sectionOrder: number; items: Collected[] }>()

  for (const row of collected) {
    const cur = sectionMeta.get(row.section)
    if (!cur) {
      sectionMeta.set(row.section, { sectionOrder: row.sectionOrder, items: [row] })
    } else {
      cur.items.push(row)
      cur.sectionOrder = Math.min(cur.sectionOrder, row.sectionOrder)
    }
  }

  const titles = [...sectionMeta.keys()].sort((a, b) => {
    const oa = sectionMeta.get(a)!.sectionOrder
    const ob = sectionMeta.get(b)!.sectionOrder
    return oa - ob || a.localeCompare(b)
  })

  const out: NavSection[] = []
  for (const title of titles) {
    const { items } = sectionMeta.get(title)!
    items.sort((x, y) => x.order - y.order || x.label.localeCompare(y.label))
    out.push({
      title,
      items: items.map((row) => ({
        label: row.label,
        to: row.to,
        permission: row.permission,
        icon: row.icon,
      })),
    })
  }

  return out
}
