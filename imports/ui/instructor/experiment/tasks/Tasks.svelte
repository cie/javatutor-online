<script>
  import tasks from '../../../../tasks.yml'
  import marked from 'marked'
  import CodeWindow from '../CodeWindow.svelte'
</script>

<main class="flex justify-stretch items-stretch">
  <aside class="mr-2 p-1 h-full flex-1">

    {#each tasks as { id, description, initialCode, input }, i}
      <div>
        <h1 class="text-lg my-5">
          {i + 1}
          <tt>{id}</tt>
        </h1>
        <div class="task-description dark:bg-gray-800 max-w-xl px-4 py-4">
          {@html marked(description)}
        </div>
        <CodeWindow code={initialCode} />
        <p class="text-bold my-2">input</p>
        <pre>{input}</pre>
      </div>
    {:else}No tasks.{/each}

  </aside>
</main>
