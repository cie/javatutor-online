<script>
  import marked from 'marked'
  import Button from './Button.svelte'
  import Logo from './Logo.svelte'
  import Redirect from './Redirect.svelte'
  let x = 1

  let confirmed = localStorage.getItem('confirmedTerms') == 1
  $: if (confirmed) {
    localStorage.setItem('confirmedTerms', 1)
  }
</script>

{#if confirmed}
  <Redirect to="/experiment" />
{/if}

<main class="h-full w-full bg-gray-800 text-white text-center">
  <Logo />
  <section
    class="text-left mx-auto my-4 message"
    style="max-width: 32em; font-size: 19px;"
    data-harmony-id="Message">
    {@html marked(`
# Introduction and Agreement

Hello and Welcome to the Java Tutor, a research project for programming lab sessions.

The purpose of this research project is to help students during their
introductory programming lab session.

The procedure involves you using the Java Tutor project to solve and code
certain predefined programming exercises that are available in the course lab
manual. After you are done, a short survey will be presented to you to fill
and the researcher will conduct an interview with you in order to collect
information and find out about your level of satisfaction about the reach
project usage. The estimated time of participation is around 60 min.

Your work will be recorded and collected for later use of the study. Your
responses will be confidential. All data is stored in a password protected
electronic format. To help protect your confidentiality, the surveys will not
contain information that will personally identify you. The results of this
study will be used for scholarly purposes only.

If you have any questions about the research study, please contact the researcher, Samar Mahrous, at smahrous000${x}@stu.kau.edu.sa

By clicking on the "agree" button below indicates that:

* You have read the above information
* you voluntarily agree to participate		
      `)}
  </section>
  <div class="mb-8">
    <Button
      on:click={() => (confirmed = true)}
      data-harmony-id="Confirm button">
      I agree to participate in the study
    </Button>
  </div>
  <div class="absolute bottom-0 text-sm" style="right: 30px">
    <a href="/instructor" data-harmony-id="Instructor login">
      Instructor login
    </a>
  </div>
</main>

<style>
  .message :global(p) {
    margin-bottom: 1em;
  }
  .message :global(h1) {
    text-align: center;
    margin-bottom: 0.8em;
    font-size: 1.6em;
  }
  .message :global(ul) {
    list-style: disc;
    padding-left: 2em;
  }
</style>
