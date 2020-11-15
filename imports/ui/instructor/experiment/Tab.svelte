<script>
  export let id,
    title,
    currentTab,
    experiment_id,
    disabled = false,
    disabledMessage
</script>

<a
  class="py-1 px-2 m-2 {disabled ? 'text-gray-500' : currentTab === id ? 'bg-gray-400 text-black' : 'dark:text-white '}
  {disabled ? 'cursor-not-allowed' : 'hover:bg-gray-500 hover-text-black'}
  "
  draggable="false"
  title={disabled ? disabledMessage : undefined}
  data-harmony-id="{title} tab"
  href={disabled ? undefined : `/instructor/experiments/${experiment_id}/${id}`}>
  {title}
</a>
