<script context="module">
  import moment from 'moment'
  import { writable } from 'svelte/store'
  import { slide } from 'svelte/transition'
  import Instructor from './Instructor.svelte'
  export const CHAT = writable(true)
  const isInstructor = Meteor.userId() === 'instructor'
  const me = isInstructor ? 'instructor' : 'student'
</script>

<script>
  let newMessage
  function handleKeydown(evt) {
    if (evt.key === 'Enter' && !evt.ctrlKey && !evt.shiftKey && !evt.altKey) {
      evt.preventDefault()
      send()
    }
  }
  let messages = [
    { from: 'student', text: 'Helloworld', createdAt: new Date() },
    { from: 'instructor', text: 'Hello', createdAt: new Date() }
  ]

  function send() {
    messages = [
      ...messages,
      { text: newMessage, from: me, createdAt: new Date() }
    ]
    newMessage = ''
  }
  let input
</script>

{#if $CHAT}
  <main class="bg-silver-100 dark:bg-silver-700 flex flex-col">
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
        class="text-sm bg-white dark:text-white dark:bg-silver-600
        dark:placeholder-silver-400 rounded message-local message-student"
        placeholder="Message to instructor"
        bind:this={input}
        bind:value={newMessage}
        on:keypress={handleKeydown}
        rows="3" />
      <button class="ml-1 text-orange-500" title="Send (Enter)">
        <ion-icon name="send-outline" />
      </button>
    </div>
  </main>
{/if}

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
