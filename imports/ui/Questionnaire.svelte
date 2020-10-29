<script>
  import { navigate } from 'svelte-routing'
  import Button from './Button.svelte'
  import RadioGroup from './RadioGroup.svelte'
  import trackEvent from './trackEvent'

  const student_id = localStorage.getItem('student_id')

  function submit() {
    trackEvent({ type: 'Questionnaire', value: JSON.stringify(answers) })
    navigate('/thanks')
  }

  let answers = {}
</script>

<main class="h-full w-full bg-gray-800 text-white">
  <section
    class="text-left mx-auto my-12"
    style="max-width: 32em; font-size: 19px;">
    <p>
      You have gone through all tasks. Please now answer these questions about
      your experience.
    </p>
    <ul>
      <li class="my-3">
        How easy was it to understand the task descriptions?
        <RadioGroup
          name="easy-to-understand"
          bind:value={answers['easy-to-understand']} />
      </li>
      <li class="my-3">
        How easy was it to solve the tasks?
        <RadioGroup
          name="easy-to-solve"
          bind:value={answers['easy-to-solve']} />
      </li>
      <li class="my-3">
        How useful were the automated hints?
        <RadioGroup name="hints-useful" bind:value={answers['hints-useful']} />
      </li>
      <li class="my-3">
        How useful was the instructor's help?
        <RadioGroup
          name="instructors-help-useful"
          bind:value={answers['instructors-help-useful']} />
      </li>
      <li class="my-3">
        How much did you enjoy the experiment?
        <RadioGroup name="enjoyed" bind:value={answers['enjoyed']} />
      </li>
      <li class="my-3">
        Anything else you would tell us?
        <textarea
          rows="3"
          class="w-full py-2 px-3 rounded my-3"
          bind:value={answers['other']}
          style="background: rgba(255,255,255,0.12);" />
      </li>
    </ul>
    <center>
      <Button on:click={submit}>Submit</Button>
    </center>
  </section>
</main>
