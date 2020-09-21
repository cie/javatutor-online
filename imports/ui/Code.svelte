<script>
  import { onMount } from "svelte";

  const editorOptions = {
    minimap: {
      enabled: false,
    },
  };

  let editorEl,
    javaCode = "{}",
    output,
    editor;

  onMount(setupEditor);
  function setupEditor() {
    if (typeof monaco === "undefined") {
      setTimeout(setupEditor, 10);
      return;
    }

    monaco.editor.setTheme("vs-dark");
    editor = window.editor = monaco.editor.create(editorEl, editorOptions);
    monaco.editor.setModelLanguage(editor.getModel(), "java");
    window.addEventListener("resize", () => editor.layout());
  }
  $: if (editor) editor.getModel().setValue(javaCode);

  let hint = null;
  let hintLineNumber = 1;

  function run() {
    output = "Hello, World!";
  }
</script>

<div class="flex flex-col h-full">
  <div class="flex" style="background: #2e2e2e;">
    <nav class="text-white">
      <a class="text-white" href="#/">JavaTutor</a> › Arrays
    </nav>
  </div>
  <div class="flex-1 flex py-2" style="background: #1e1e1e;">
    <input
      type="hidden"
      data-harmony-id="Java code"
      bind:value={javaCode}
      on:change={(e) => e.currentTarget.dispatchEvent(new Event('input'))} />
    <div class="flex-1" style="background: #1e1e1e;" bind:this={editorEl} />

    <input
      type="hidden"
      data-harmony-id="Hint"
      bind:value={hint}
      on:change={(e) => e.currentTarget.dispatchEvent(new Event('input'))} />
    <input
      type="hidden"
      data-harmony-id="Hint line number"
      bind:value={hintLineNumber}
      on:change={(e) => e.currentTarget.dispatchEvent(new Event('input'))} />
    {#if hint}
      <div
        data-harmony-id="Bubble"
        class="bg-yellow-300 w-16 h-16 rounded-lg absolute">
        <div data-harmony-id="Bubble content">
          {@html hint}
        </div>
      </div>
    {/if}

    <aside
      class="text-white px-4 py-3"
      style="width: 20vw; background: #aaa ; color: #000">
      This is the task description.
    </aside>
  </div>
  <footer class="flex text-white" style="height: 25vh; background: #333;">
    <div class="flex-1 flex flex-col h-full p-2">
      <h2 class="font-bold mb-1">Input</h2>
      <textarea
        id="input"
        class="bg-transparent block flex-1 font-mono outline-none" />
    </div>
    <div
      class="h-full flex items-center justify-center content-center flex-col">
      <button
        class="bg-green-600 text-white px-4 py-3 rounded-lg"
        on:click={run}
        data-harmony-id="Run">
        Run<span class="ml-2 font-mono">▶</span>
      </button>
      <small class="text-gray-500">(Ctrl+Enter)</small>
    </div>
    <div class="flex-1 flex flex-col h-full p-2">
      <h2 class="font-bold mb-1">Output</h2>
      <textarea
        id="output"
        bind:value={output}
        readonly
        data-harmony-id="Output"
        class="bg-transparent block flex-1 font-mono outline-none" />
    </div>
  </footer>
</div>
