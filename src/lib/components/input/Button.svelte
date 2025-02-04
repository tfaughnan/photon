<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import Spinner from '$lib/components/ui/loader/Spinner.svelte'
  import { twMerge } from 'tailwind-merge'

  type ButtonColor = keyof typeof buttonColor
  type ButtonSize = keyof typeof buttonSize
  type ButtonRoundness = keyof typeof buttonRoundness

  const buttonColor = {
    primary: `border border-slate-900 bg-slate-900 dark:bg-zinc-100
    dark:border-zinc-100 dark:text-black hover:text-inherit text-slate-100 hover:bg-transparent
    active:bg-black/10 active:dark:bg-white/10`,

    secondary:
      'border border-slate-200 dark:border-zinc-700 bg-transparent hover:bg-slate-100 hover:dark:bg-zinc-800',

    tertiary:
      'border border-transparent bg-transparent hover:bg-slate-100 hover:dark:bg-zinc-800',

    danger:
      'border border-red-500 bg-red-500 hover:text-red-500 hover:bg-transparent text-white',

    ghost: `border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 hover:dark:bg-zinc-800
      hover:border-slate-200 hover:dark:border-zinc-700`,

    elevated: `bg-slate-100 dark:bg-zinc-800 border border-slate-200
     dark:border-zinc-700 hover:bg-slate-200 hover:dark:bg-zinc-700 hover:border-slate-300
     hover:dark:border-zinc-600`,

    elevatedLow: `bg-slate-100 dark:bg-zinc-900 border border-slate-200
    dark:border-zinc-800 hover:bg-slate-200 hover:dark:bg-zinc-800 hover:border-slate-300
    hover:dark:border-zinc-700`,

    none: '',
  }

  const buttonSize = {
    sm: 'px-2 py-1',
    md: 'px-3 py-1.5',
    lg: 'px-4 py-2',
  }

  const buttonRoundness = {
    pill: 'rounded-full',
    md: 'rounded-md',
    none: '',
  }

  export let loading = false
  export let submit = false

  export let color: ButtonColor = 'secondary'
  export let size: ButtonSize = 'md'
  export let rounded: ButtonRoundness = 'md'

  // const dispatch = createEventDispatcher()
  export let href: string | undefined = undefined
</script>

{#if href}
  <a
    {href}
    {...$$restProps}
    class="{`
      ${buttonColor[color]}
      ${buttonSize[size]}
      ${buttonRoundness[rounded]}
      text-sm transition-colors disabled:!opacity-70 disabled:!pointer-events-none
      disabled:!border disabled:!border-slate-300 disabled:!bg-slate-200 disabled:dark:!border-zinc-700 disabled:dark:!bg-zinc-800
      ${$$props.class}
    `} {loading
      ? color == 'primary'
        ? '!bg-transparent !text-inherit'
        : ''
      : ''}"
  >
    <div class="flex flex-row items-center justify-center gap-1.5 h-full">
      {#if loading}
        <Spinner
          width={size == 'lg' ? 20 : size == 'md' ? 18 : size == 'sm' ? 16 : 16}
        />
      {:else}
        <slot name="icon" />
      {/if}
      <slot />
    </div>
  </a>
{:else}
  <button
    {...$$restProps}
    on:click
    class="{`
      ${buttonColor[color]}
      ${buttonSize[size]}
      ${buttonRoundness[rounded]}
      text-sm transition-colors disabled:!opacity-70 disabled:!pointer-events-none
      disabled:!border disabled:!border-slate-300 disabled:!bg-slate-200
      disabled:dark:!border-zinc-700 disabled:dark:!bg-zinc-800 disabled:text-inherit
      ${$$props.class}
    `} {loading
      ? color == 'primary'
        ? '!bg-transparent !text-inherit'
        : ''
      : ''}"
    type={submit ? 'submit' : 'button'}
  >
    <div class="flex flex-row items-center justify-center gap-1.5">
      {#if loading}
        <Spinner
          width={size == 'lg' ? 20 : size == 'md' ? 18 : size == 'sm' ? 16 : 16}
        />
      {:else}
        <slot name="icon" />
      {/if}
      <slot />
    </div>
  </button>
{/if}
