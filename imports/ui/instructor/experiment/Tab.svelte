<script>
  export let id, title, currentTab, experiment_id
</script>

<a
  class="py-1 px-2 m-2 {currentTab === id ? 'bg-gray-300 text-black' : 'text-white '}
  hover:bg-gray-500 hover:text-black"
  draggable="false"
  data-harmony-id="{title} tab"
  href="/instructor/experiments/{experiment_id}/{id}">
  {title}
</a>
