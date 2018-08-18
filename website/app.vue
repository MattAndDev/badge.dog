<template>
  <div id="App">
   <Hero />
  </div>
</template>
<script>
import 'reset-css/reset.css'
import Hero from './components/hero'
export default {
  name: 'app',
  components: {
   Hero
  }
}
</script>

<style lang="sass">
#App
  font-family: 'IBM Plex Sans', sans-serif
</style>