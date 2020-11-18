<script>
  import Editor from '../../../Editor.svelte'
  import ChatBox from '../../ChatBox.svelte'
  import tasks from '../../../../tasks.yml'
  import { onMount, tick } from 'svelte'

  export let student
  $: task = tasks.find(t => t.id === student.task_id)
  $: taskTitle = task ? task.title : student.task_id
  let selection
  let editor
  let model
  $: highlight = student.highlight

  const highlights = {}
  $: if (
    student &&
    model &&
    highlight &&
    student.code &&
    ~model.uri.indexOf(student._id)
  )
    updateHighlight()

  function updateHighlight() {
    const newDecorations =
      highlight && !isEmpty(highlight)
        ? [
            {
              options: {
                className: 'bg-primary'
              },
              range: highlight
            }
          ]
        : []
    highlights[student._id] = model.deltaDecorations(
      highlights[student._id] || [],
      newDecorations
    )
  }
  function isEmpty(selection) {
    return (
      selection.startLineNumber == selection.endLineNumber &&
      selection.startColumn == selection.endColumn
    )
  }
  let lastValue
  $: if (model && student.code != lastValue) {
    lastValue = student.code
    updateHighlight()
  }
</script>

<section class="flex">
  {#if student.code}
    <div class="flex-1 flex flex-col">
      <p class="py-1 px-2">
        <strong class="w-40 inline-block mr-4">{student.nickname}</strong>
        {#if student.task_id}{taskTitle}{/if}
      </p>
      <Editor
        value={student.code}
        readOnly
        growHeight={false}
        bind:selection
        bind:editor
        bind:model
        uri={`workspace:instructor/${student._id}/Code.java`} />
      <div class="flex h-20">
        <div class="flex-1">
          <h3 class="mt-3 mb-2">Input</h3>
          <pre class="mr-4 user-input">{student.input || ''}</pre>
        </div>
        <div class="flex-1">
          <h3 class="mt-3 mb-2">Output</h3>
          <pre class="output">{student.output || ''}</pre>
        </div>
      </div>
    </div>
    <div class="h-full" style="flex: 0.45;">
      {#each [student._id] as key (key)}
        <ChatBox
          student_id={student._id}
          task_id={student.task_id}
          closable={false}
          {selection}
          code={student.code} />
      {/each}
    </div>
  {/if}
</section>

<style>
  section {
    border: 4px solid rgba(203, 213, 224, 1);
    width: 920px;
    flex-shrink: 0.2;
    flex-grow: 1;
  }
</style>
