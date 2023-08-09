<template>
  <span v-if="!headless" class="shortcut-key" :class="{ black: blackStyle }">
    {{ formattedKey }}
  </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'KeyboardShortcut',
  props: {
    shortcut: {
      type: String,
      required: true
    },
    ctrl: {
      type: Boolean,
      default: false
    },
    blackStyle: {
      type: Boolean,
      default: false
    },
    headless: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    formattedKey() {
      if (!this.ctrl) return this.shortcut.toUpperCase()
      return '⌘' + this.shortcut.toUpperCase()
    }
  },
  mounted() {
    // Add keydown event listener on mount
    if (document) {
      document.addEventListener('keydown', this.handleKeydown)
    }
  },
  unmounted() {
    // remove event listener
    if (document) {
      document.removeEventListener('keydown', this.handleKeydown)
    }
  },
  methods: {
    handleKeydown(e: KeyboardEvent) {
      // check key
      if (e.key.toLowerCase() === this.shortcut.toLowerCase()) {
        // check if ctrl is pressed
        if (this.ctrl && !e.ctrlKey && !e.metaKey) {
          return
        }
        // check if target is input
        if (!this.ctrl) {
          if (e.target instanceof HTMLElement) {
            const tagName = e.target.tagName.toLowerCase()
            if (['input', 'textarea'].includes(tagName) || e.target.contentEditable === 'true') {
              return
            }
          }
        }

        e.preventDefault()
        this.$emit('detected', e)
      }
    }
  }
})
</script>

<style scoped lang="scss">
.shortcut-key {
  display: inline-block;
  color: var(--text-secondary-color);
  border: 1px solid var(--text-tertiary-color);
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.85rem;
  &.black {
    color: rgb(229, 229, 229);
    border-color: rgb(183, 183, 183);
  }
}
</style>
