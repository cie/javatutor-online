<script>
  export let node
  export let selected = []
</script>

{#if node.childNodes.length}
  <details class="ml-4" open>
    <summary class:selected={selected.includes(node)}>
      {node.nodeName}
      {#if node.attributes}
        {#each [...node.attributes] as attr}
          {#if !attr.namespaceURI}
            <span class="ml-3">{attr.nodeName} = {attr.nodeValue}</span>
          {/if}
        {/each}
      {/if}
    </summary>
    {#each [...node.childNodes] as c}
      <svelte:self node={c} {selected} />
    {/each}
  </details>
{:else}
  <div class="text-node" open class:selected={selected.includes(node)}>
    {node.nodeValue}
  </div>
{/if}

<style>
  summary {
    margin-left: -18px;
  }
  .text-node {
    color: #ccc;
    font-family: 'Courier New', Courier, monospace;
  }
  .selected {
    background: #8d6103;
  }
</style>
