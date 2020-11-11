<script>
  import { onMount } from 'svelte'
  import { navigate } from 'svelte-routing'

  onMount(() => {
    localStorage.clear()
    Meteor.logout(() => {
      navigate('/', { replace: true })
    })
  })
</script>
