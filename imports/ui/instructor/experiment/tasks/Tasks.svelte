<script>
  import tasks from '../../../../tasks.yml'
  import marked from 'marked'
  import CodeWindow from '../CodeWindow.svelte'
  import Hint from '../../../Hint.svelte'
</script>

<main class="flex justify-stretch items-stretch">
  <aside class="mr-2 p-1 h-full flex-1">

    {#each tasks as { id, title, description, initialCode, input, expectedOutput, hints }, i}
      <div>
        <h1 class="text-lg my-5">Task {i + 1}/{tasks.length}</h1>
        <div class="flex">
          <div
            class="flex-1 task-description dark:bg-gray-800 bg-gray-200 max-w-xl
            px-4 py-4">
            <h1>{title}</h1>
            {@html marked(description)}
          </div>
          <CodeWindow code={initialCode} />
        </div>
        <h3 class="mt-3 mb-2">Hints and expected solutions</h3>
        {#each hints as hint}
          <div class="mb-2">
            <div
              class="align-top text-sm bg-yellow-300 text-silver-800 rounded-lg
              border-1 border-solid shadow-md inline-block border-gray-800 py-1
              px-2 mr-3"
              style="width:304px;">
              {@html marked(hint.message)}
            </div>
            {#if hint.solution}
              <tt class="align-top whitespace-pre text-sm inline-block">
                {hint.solution.into || hint.solution.add}
              </tt>
            {/if}
          </div>
        {/each}
        <div class="flex">
          <div class="flex-1">
            <h3 class="mt-3 mb-2">Input</h3>
            <pre class="mr-4 user-input">{input}</pre>
          </div>
          <div class="flex-1">
            <h3 class="mt-3 mb-2">Output</h3>
            <pre class="output">{expectedOutput || '???'}</pre>
          </div>
        </div>
      </div>
    {:else}No tasks.{/each}

  </aside>
</main>
