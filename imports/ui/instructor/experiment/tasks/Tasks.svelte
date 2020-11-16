<script>
  import tasks from '../../../../tasks.yml'
  import marked from 'marked'
  import CodeWindow from '../CodeWindow.svelte'
  import htmldiff from 'node-htmldiff'
  import { escape } from 'html-escaper'
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
              <div class="inline-block">
                {#each [].concat(hint.solution) as solution}
                  <tt
                    class="hint-solution align-top whitespace-pre text-sm block">
                    {#if solution.add}
                      <ins>{solution.add}</ins>
                    {:else if solution.turn && solution.into}
                      {@html htmldiff(escape(solution.turn), escape(solution.into))}
                    {/if}
                  </tt>
                {/each}
              </div>
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

<style>
  .hint-solution :global(ins) {
    text-decoration: none;
    background-color: none;
  }
  .hint-solution:hover :global(ins) {
    background-color: #d0ffd0;
  }
  .hint-solution :global(del) {
    display: none;
    opacity: 0.75;
    text-decoration: line-through;
    background-color: #ffd0d0;
  }
  .hint-solution:hover :global(del) {
    display: inline-block;
    position: absolute;
    transform: translate(0, -1.4em);
  }
  :global(.dark) .hint-solution:hover :global(ins) {
    background-color: #006000;
  }
  :global(.dark) .hint-solution :global(del) {
    background-color: #603030;
  }
</style>
