<script context="module">
  import moment from 'moment'
  import { writable } from 'svelte/store'
  import { slide } from 'svelte/transition'
  import { useTracker } from 'meteor/rdb:svelte-meteor-data'
  export const CHAT = writable(false)
  const isInstructor = Meteor.userId() === 'instructor'
  const me = isInstructor ? 'instructor' : 'student'
</script>

<script>
  export let student_id
  $: Meteor.subscribe('MessagesOf', { student_id })
  $: MESSAGES = Messages.find({ student_id }, { sort: { createdAt: 1 } })
  $: messages = $MESSAGES
  let newMessage
  function handleKeydown(evt) {
    if (evt.key === 'Enter' && !evt.ctrlKey && !evt.shiftKey && !evt.altKey) {
      evt.preventDefault()
      send()
    }
  }

  function send() {
    Meteor.call('sendMessage', { text: newMessage, student_id })
    newMessage = ''
  }
  function close() {
    $CHAT = false
  }
</script>

<main
  class="h-full w-full bg-silver-100 dark:bg-silver-700 flex flex-col relative
  min-h-20">
  <button
    class="text-4xl text-gray-500 absolute top-0 right-0 m-1 active:outline-none
    opacity-50 hover:opacity-75"
    on:click={close}>
    <ion-icon name="close-outline" />
  </button>
  <div class="flex-1 flex flex-col justify-end py-2">
    {#each messages as message, i (i)}
      <div
        in:slide|local={{}}
        class="text-sm my-1 rounded px-2 py-1 whitespace-pre"
        title={moment().format('LT')}
        class:bg-orange-500={message.from === me}
        class:dark:bg-orange-600={message.from === me}
        class:bg-orange-400={message.from !== me}
        class:dark:bg-orange-500={message.from !== me}
        class:message-local={message.from === me}
        class:message-remote={message.from !== me}
        class:message-instructor={message.from === 'instructor'}
        class:message-student={message.from === 'student'}>
        {message.text}
      </div>
    {/each}
  </div>
  <div class="flex items-center overflow-auto">
    <textarea
      id="chatMessage"
      class="text-sm bg-white dark:text-white dark:bg-silver-600
      dark:placeholder-silver-400 rounded message-local message-student"
      placeholder="Message to instructor"
      bind:value={newMessage}
      on:keypress={handleKeydown}
      rows="3" />
    <button
      class="ml-1 text-orange-500"
      title={`Send (Enter)
(Press Shift+Enter for newline)`}
      on:click={send}>
      <ion-icon name="send-outline" />
    </button>
  </div>
</main>

<style>
  main {
    padding: 0.8em;
    flex: 0.45;
  }
  textarea {
    width: 100%;
    outline: none;
    padding: 0.2em 0.4em;
    vertical-align: middle;
    resize: none;
  }
  .message-local.message-instructor {
    border-bottom-right-radius: 0;
  }
  .message-local.message-student {
    border-bottom-left-radius: 0;
  }
  .message-remote.message-instructor {
    border-top-right-radius: 0;
  }
  .message-remote.message-student {
    border-top-left-radius: 0;
  }
</style>
