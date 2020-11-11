<script>
  import Editor from '../../../Editor.svelte'
  import ChatBox from '../../ChatBox.svelte'

  export let student
</script>

<section class="flex">
  {#if student.code}
    <Editor
      value={student.code}
      readOnly
      growHeight={false}
      uri={`workspace:instructor/${student._id}/Code.java`} />
    <div class="h-full" style="flex: 0.45;">
      <ChatBox />
    </div>
  {/if}
</section>

<style>
  section {
    border: 4px solid #2d3748;
    width: 920px;
    flex-shrink: 0.2;
    flex-grow: 1;
  }
</style>
