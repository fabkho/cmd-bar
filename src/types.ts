import { UseFuseOptions } from '@vueuse/integrations/useFuse'

export type State = {
  /* @deprecated */
  groupedCommands: Group[]

  selectedCommandId: string | null
  query: string

  groups: Group[]
  commands: Command[]
  results: Command[]
  selectedGroups: Set<string | null>

  fuseOptions: Partial<UseFuseOptions<Command>> | null
}

export interface Command {
  id: string
  leading?: string | []
  label: string
  action: () => void
  group?: string
  score?: number
  /**
   * Format is based on useMagicKeys.
   * @example
   * 'Enter'
   * 'Ctrl+N'
   * 'Ctrl+Shift+P'
   */
  shortcut?: string
  // matches?: (FuseSortFunctionMatch | FuseSortFunctionMatchList)[]
  [key: string]: any
}
export interface Group {
  key: string
  commands?: Command[]
  visible?: boolean
  search?: (query: string) => Promise<Command[]>
  [key: string]: any
}

export interface NavOperations {
  next: () => void
  prev: () => void
  execute: () => void
}

export interface ShortcutOptions {
  key: string
  action: () => void
  autoRepeat?: boolean
}

export interface FilterOption {
  groupKey: string | null
  visible: boolean
  label: string
}
