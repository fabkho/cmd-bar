import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Command, Group } from '../../types'
import { useCmdBarState } from '../useCmdBarState'

function createCommand(key: string, action = vi.fn()): Command {
  return { key, label: key, action }
}

describe('useCmdBarState', () => {
  const { initState, resetState, toggleGroup, updateQuery, selectCommand, executeCommand } =
    useCmdBarState()

  beforeEach(() => {
    vi.useFakeTimers()
    resetState()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('executes a command from the initial groups', () => {
    const command = createCommand('business-1')
    initState([{ key: 'businesses', commands: [command] }])

    selectCommand('business-1')
    executeCommand()

    expect(command.action).toHaveBeenCalledOnce()
  })

  it('executes an async search result that is not part of the initial commands', async () => {
    const initialCommand = createCommand('business-1')
    const searchedCommand = createCommand('business-42')
    const group: Group = {
      key: 'businesses',
      commands: [initialCommand],
      search: async () => [searchedCommand]
    }
    initState([group])
    await toggleGroup(null, false)

    const pendingQuery = updateQuery('acme')
    await vi.advanceTimersByTimeAsync(300)
    await pendingQuery

    selectCommand('business-42')
    executeCommand()

    expect(searchedCommand.action).toHaveBeenCalledOnce()
    expect(initialCommand.action).not.toHaveBeenCalled()
  })
})
