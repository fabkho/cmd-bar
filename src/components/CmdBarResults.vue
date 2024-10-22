<script setup lang="ts">
import { computed } from 'vue'
import { useCmdBarState } from '../composables/useCmdBarState'
import CmdBarItems from './CmdBarItems.vue'
import { Command } from '../types'

defineProps<{
  resultsHeader?: string | null
}>()

const { state, resultsEmpty } = useCmdBarState()
const results = computed(() => state.results as Readonly<Command[]>)
const isLoading = computed(() => state.isLoading)
const hasNoResults = computed(() => resultsEmpty.value && !isLoading.value)

</script>

<template>
  <div v-if="hasNoResults" class="no-results">
    <slot name="no-results" />
  </div>

  <ul v-else data-cmd-bar-items class="results">
    <li v-if="isLoading">
      <slot name="loading" />
    </li>

    <li v-else class="group">
      <h2 v-if="resultsHeader" class="group__label">{{ resultsHeader }}</h2>
      <ul data-cmd-bar-items class="items">
        <CmdBarItems :commands="results">
          <template #default="{ command }">
            <slot :command="command" />
          </template>
        </CmdBarItems>
      </ul>
    </li>
  </ul>
</template>
