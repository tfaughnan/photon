<script lang="ts">
  import { Color } from '$lib/ui/colors'
  import Menu from '$lib/components/ui/menu/Menu.svelte'
  import MenuButton from '$lib/components/ui/menu/MenuButton.svelte'

  type T = $$Generic

  export let options: T[]
  export let optionNames: Map<any, string> = new Map()
  export let selected: T

  let open = false

  optionNames.set(null, 'None')
</script>

<Menu let:toggleOpen>
  <button
    class="flex flex-row gap-2 items-center px-3 py-1.5 w-full text-sm
      transition-all max-w-64 rounded-md bg-slate-100 border border-slate-200
      dark:bg-zinc-800 dark:border-zinc-700"
    slot="button"
    type="button"
    on:click|preventDefault={toggleOpen}
  >
    {optionNames.get(selected) || selected}
  </button>
  <li class="text-xs opacity-80 my-1 py-1 mx-4">Communities</li>
  {#each options as option}
    <MenuButton on:click={() => (selected = option)}>
      {optionNames.get(option) || option}
    </MenuButton>
  {/each}
</Menu>
