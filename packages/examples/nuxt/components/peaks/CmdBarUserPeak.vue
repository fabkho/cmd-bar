<script setup lang="ts">
import { type Command } from 'cmd-bar'

defineProps<{
  command: Command | null
}>()
</script>

<template>
  <Transition name="slide-in-right">
    <CmdBarPreview v-if="command && command.group === 'users'" :command="command">
      <template #avatar>
        <img
          class="w-20 h-20 rounded-full ring-2 ring-gray-300 dark:ring-gray-500"
          src="../../assets/avatars/avatar-1.png"
          alt="Bordered avatar"
          style="z-index: 1"
        />
      </template>
      <template #data>
        <h5 class="text-xl mb-2 font-medium text-gray-700">
          {{ command?.label }}
        </h5>
        <div class="flex flex-col items-center gap-1 text-sm text-center text-gray-600">
          Enim anim et elit ullamco adipisicing sunt excepteur aliqua duis laboris et esse consequat
          voluptate.
        </div>
      </template>
      <template #actions>
        <button
          class="firstButton text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-500"
          @click="command.action?.()"
        >
          Edit
        </button>

        <button
          class="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
        >
          Book
        </button>
      </template>
    </CmdBarPreview>
  </Transition>
</template>

<style scoped lang="scss">
.slide-in-right {
  &-enter-active {
    animation: slideInRight 0.2s ease-in-out;
  }

  &-leave-active {
    animation: slideInRight 0.2s ease-in-out reverse;
  }
}

@keyframes slideInRight {
  from {
    transform: translate3d(100%, 0, 0);
    visibility: visible;
  }

  to {
    transform: translate3d(0, 0, 0);
  }
}
</style>
