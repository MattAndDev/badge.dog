<template>
  <div id="App">
    <Hero />
    <Builder />
  </div>
</template>
<script>
import 'reset-css/reset.css'
import Hero from './components/hero'
import Builder from './components/builder'
export default {
  name: 'App',
  components: {
    Hero,
    Builder
  }
}
</script>

<style lang="sass">
#App
  font-family: 'IBM Plex Sans', sans-serif
</style>
