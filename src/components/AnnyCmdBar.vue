<script setup lang="ts">
import { ref, computed, inject } from 'vue'
import KeyboardShortcut from '@/components/KeyboardShortcut.vue'
import CmdBar from '@/components/CmdBar.vue'
import CmdBarInput from '@/components/CmdBarInput.vue'
import CmdBarItems from '@/components/CmdBarItems.vue'
import { USE_CMD_STATE } from '@/useCmdState'
import type { CmdBarStore } from '@/types'

const useCmdState = inject<CmdBarStore>(USE_CMD_STATE)

const cmdBar = ref<typeof CmdBar | null>(null)
const searchTerm = ref('')
const items = ref(useCmdState?.state.items ?? [])

function toggleCmdBar(): void {
  if (cmdBar.value) {
    cmdBar.value.toggleCmdBar()
  }
}

const filteredItems = computed(() => {
  if (searchTerm.value && searchTerm.value.length > 1) {
    const lowerCaseSearchTerm = searchTerm.value.toLowerCase()
    return items.value.filter((item: any) => item.title.toLowerCase().includes(lowerCaseSearchTerm))
  } else {
    return items.value
  }
})
</script>

<template>
  <CmdBar ref="cmdBar">
    <template #header>
      <CmdBarInput v-model="searchTerm" />
    </template>
    <template #content>
      <CmdBarItems v-slot="{ item }: Record<string, any>" :items="filteredItems">
        <div class="item__leading">
          <img :src="item.leading" alt="" />
        </div>
        <div class="cmd-bar__item__title">{{ item.title }}</div>
        <div class="cmd-bar__item__actions"></div>
      </CmdBarItems>
    </template>
  </CmdBar>
  <keyboard-shortcut :headless="true" :ctrl="true" shortcut="k" @detected="toggleCmdBar" />
</template>

<style lang="scss">
@import '@/assets/anny-theme';
</style>
