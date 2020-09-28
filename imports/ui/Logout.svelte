<script>
  import { onMount } from 'svelte'
  import { navigate } from 'svelte-routing'

  onMount(() => {
    localStorage.removeItem('student_id')
    Meteor.logout(() => {
      navigate('/')
    })
  })
</script>
