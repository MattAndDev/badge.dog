<template>
  <div class="builder">
    <div class="builder_template">
      <select v-model="template" @change="getTemplate">
        <option disabled value="">Choose your template</option>
        <option value='simple'>Simple</option>
        <option value='rocks'>Rocks</option>
      </select>
      <p v-if="template">Selected: {{ template }}</p>
    </div>
    <div class="builder_options">
      <div v-for="opt in typedTemplateOptions" class="builder_options_cell">
        <label :for="opt.name">{{ opt.name }}</label>
        <input  v-model="templateOptions[opt.name]" :id="opt.name" :type="opt.type">
      </div>
    </div>
    <div class="" v-html="result">
    </div>
    <button v-if="template" type="button" name="button" @click="getTemplate">get</button>
  </div>
</template>
<script src="./builder.js"></script>
  <style lang="sass">
  @import 'builder'
  </style>
