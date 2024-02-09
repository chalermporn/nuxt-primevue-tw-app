<script setup>
/*
- Props
* title: [string] - heading title
* modelValue - binding v-model open/close offcanvas state
* tagName [string] - element's tagname wrapper
* headerClass [string] - header class
* position [string] - offcanvas position
* size [string] - offcanvas size
* activeScreen [string] - offcanvas show on specific screen without modal
* noBackdrop [boolean]
* hideHeader [boolean]
* alwaysShow [boolean] - always show with modal

- Slot
* #default - section wrapper's child
* #pre-title - section before header title
* #title - header title
* #post-title - section after header title
* #footer - footer section

- Emit event
* @update:modelValue - v-model for open/close offcanvas
* @close - on close offcanvas
*/
import { computed, inject, onBeforeMount, watch } from 'vue'
// define props
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  modelValue: {
    type: Boolean,
    default: false
  },
  tagName: {
    type: String,
    default: 'div'
  },
  headerClass: {
    type: String,
    default: ''
  },
  position: {
    type: String,
    default: 'left',
    validator(value) {
      return ['top', 'right', 'bottom', 'left'].includes(value)
    }
  },
  size: {
    type: String,
    default: 'medium',
    validator(value) {
      return ['small', 'medium', 'large', 'xl', 'full'].includes(value)
    }
  },
  activeScreen: {
    type: String,
    default: 'default',
    validator(value) {
      return ['default', 'md', 'max-md', 'max-lg'].includes(value)
    }
  },
  noBackdrop: {
    type: Boolean,
    default: false
  },
  hideHeader: {
    type: Boolean,
    default: false
  },
  alwaysShow: {
    type: Boolean,
    default: false
  },
})
// emit event
const emit = defineEmits(['update:modelValue', 'close'])
// inject
const { isMd, isMaxMd, isLg } = inject('screen')
// const { isAnimating, animate } = inject('animate')
const dialog = inject('dialog')

const ACTIVE = 'bg-gray-0 dark:bg-bluegray-90 md:border-gray-20 dark:md:border-bluegray-60/50 z-20'
const DEACTIVE = 'bg-gray-0 dark:bg-bluegray-100'
const pt = {
  default: {
    right: `${DEACTIVE} fixed right-0 top-0 h-full translate-x-full`,
    right_active: `${ACTIVE} !translate-x-0 shadow-md dark:!shadow-[0_25px_40px_0_rgba(0,0,0,0.6),0_5px_15px_0_rgba(0,0,0,0.55)]`,
    bottom: `${DEACTIVE} fixed left-0 right-0 w-100 -bottom-full rounded-t-3xl`,
    bottom_active: `${ACTIVE} !bottom-0 shadow-md dark:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.6)]`,
  },
  'max-md': {
    left: `${DEACTIVE} max-md:fixed -translate-x-full max-md:top-[60px] max-md:h-full md:translate-x-0`,
    left_active: `${ACTIVE} md:border-r translate-x-0 max-md:shadow-md dark:max-md:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.6)]`,
    bottom: `${DEACTIVE} max-md:fixed max-md:left-0 max-md:right-0 max-md:w-100 -bottom-full max-md:rounded-t-3xl`,
    bottom_active: `${ACTIVE} !bottom-0 max-md:shadow-md dark:max-md:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.6)]`,
  },
  md: {
    left: `${DEACTIVE} md:fixed -translate-x-full md:top-0 md:h-full max-md:translate-x-0`,
    left_active: `${ACTIVE} max-md:border-r translate-x-0 md:shadow-md dark:md:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.6)]`,
    bottom: `${DEACTIVE} md:fixed md:left-0 md:right-0 md:w-100 -bottom-full md:rounded-t-3xl`,
    bottom_active: `${ACTIVE} max-md:border-t !bottom-0 md:shadow-md dark:md:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.6)]`,
  },
}

// state
const state = computed(() => {
  switch (props.activeScreen) {
    case 'md':
      return {
        activeClass: 'md',
        heightClass: props.hideHeader ? 'md:h-screen' : 'md:h-[calc(100dvh-var(--header-nav-height))]',
        backdropClass: 'max-md:hidden',
        isActive: isMaxMd
      }
    case 'max-md':
      return {
        activeClass: 'max-md',
        heightClass: props.hideHeader ? 'max-md:h-screen' : 'max-md:h-[calc(100dvh-var(--header-nav-height))]',
        backdropClass: 'md:hidden',
        isActive: isMd
      }
    case 'max-lg':
      return {
        activeClass: 'max-lg',
        heightClass: props.hideHeader ? 'max-lg:h-screen' : 'max-lg:h-[calc(100dvh-var(--header-nav-height))]',
        backdropClass: 'lg:hidden',
        isActive: isLg
      }
    case 'default':
    default:
      return {
        activeClass: 'default',
        heightClass: props.hideHeader ? 'h-screen' : 'h-[calc(100dvh-var(--header-nav-height))]',
        backdropClass: '',
        isActive: ''
      }
  }
})

// state options
// -- class
// const wrapperClass = computed(() => `${state.value.heightClass} overflow-y-auto dark:text-bluegray-0`)
const wrapperClass = computed(() => `${state.value.heightClass}  dark:text-bluegray-0`)
const activeClass = computed(() => state.value.activeClass)
const backdropClass = computed(() => state.value.backdropClass)
// -- offcanvas state
const isActive = computed(() => state.value.isActive)
const isHorizental = computed(() => ['left', 'right'].includes(props.position))

// actions - close offcanvas
const close = () => {
  if (props.alwaysShow)
    document.body.classList.remove('overflow-hidden')

  emit(props.alwaysShow ? 'close' : 'update:modelValue', false)
}

// watcher - watch for animation
watch(() => props.modelValue, (value) => {
  // animate()
  value ? document.body.classList.add('overflow-hidden') : document.body.classList.remove('overflow-hidden')
})

onBeforeMount(() => {
  if (!props.alwaysShow) return
  // animate()
  document.body.classList.add('overflow-hidden')
})
</script>

<template>
  <ClientOnly>
    <Teleport :disabled="isActive.value && !alwaysShow" to="body">
      <!-- backdrop -->
      <Backdrop v-if="modelValue && !noBackdrop" @click="close" :class="[`z-20 ${backdropClass}`, {
        'max-md:z-[2200]': dialog
      }]" />
      <!-- offcanvas -->
      <component v-bind="$attrs" :is="tagName" :class="[
        'z-20 duration-200',
        // isAnimating ? `z-20 duration-200 ${dialog ? 'max-md:z-[2200]' : ''}` : 'duration-0',
        pt[activeClass][position],
        {
          'w-60': (size === 'small' && isHorizental),
          'w-80': (size === 'medium' && isHorizental),
          'w-full': (size === 'full' && isHorizental),
          [pt[activeClass][`${position}_active`]]: (modelValue || alwaysShow),
          'md:w-[30rem] max-md:w-full': (size === 'large' && isHorizental),
          'md:w-[calc(100vw-16rem)] max-md:w-full': (size === 'xl' && isHorizental),
          '!shadow-xl drop-shadow-2xl': (activeScreen === 'default' && noBackdrop),
          'z-30': (modelValue && !isActive.value),
          'max-md:z-[2200]': (modelValue && !isActive.value && dialog),
          'dark:md:border-bluegray-70/80': alwaysShow,
          'dark:md:border-r': position === 'left',
          'dark:md:border-l': position === 'right',
        },
      ]">
        <!-- offcanvas header -->
        <div v-if="!hideHeader && ((!isActive.value || alwaysShow) || (modelValue && !isActive.value))" :class="[
          'h-[var(--header-nav-height)] top-0 sticky flex justify-between items-center',
          'px-4 py-2 border-b',
          'border-gray-20 bg-gray-10 dark:border-bluegray-60/30 dark:bg-bluegray-80',
          headerClass
        ]">
          <!-- pre-title -->
          <div v-if="$slots['pre-title']" class="flex items-center flex-1 gap-2 pe-3 basis-4">
            <slot name="pre-title" />
          </div>
          <!-- title -->
          <div :class="[
            'h-full flex items-center truncate',
            'text-gray-80 dark:text-white',
            'max-md:text-lg',
            $slots['pre-title'] ? 'px-3' : 'pe-3',
          ]">
            <slot name="title">{{ title }}</slot>
          </div>
          <!-- post-title -->
          <div class="flex items-center justify-end flex-1 gap-2 ps-3 basis-4 max-w-36">
            <slot name="post-title" />
            <KTBButton class="min-w-10 w-10" icon="pi pi-times" type="outlined" border-color="border-gray-700"
              text-color="text-gray-700 dark:text-white" @click="close" />
          </div>
        </div>
        <!-- wrapper -->
        <slot name="wrapper" :className="wrapperClass">
          <div :class="wrapperClass">
            <slot />
          </div>
        </slot>
        <!-- footer -->
        <footer v-if="$slots['footer']" class="sticky bottom-0">
          <slot name="footer" />
        </footer>
      </component>
    </Teleport>
  </ClientOnly>
</template>