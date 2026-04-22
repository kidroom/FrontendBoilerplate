export interface DemoItem {
  id: string
  name: string
  status: 'active' | 'draft'
  updatedAt: string
}

export interface DemoListQuery {
  q: string
  page: number
  pageSize: number
  sortField: 'name' | 'updatedAt'
  sortOrder: 'asc' | 'desc'
  statuses: Array<'active' | 'draft'>
}

export interface DemoPermissionItem {
  id: string
  name: string
  parentName: string
  isEnabled: boolean
}