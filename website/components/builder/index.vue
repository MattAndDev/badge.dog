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
      <div class="builder_options_cell" v-for="opt in typedTemplateOptions">
        <template v-if="opt.type === 'color'">
          <label for="color">{{ opt.name }}</label>
          <input type="color" v-model="templateOptions[opt.name]">
        </template>
        <template v-if="opt.type === 'text'">
          <label :for="opt.name">{{ opt.name }}</label>
          <input :id="opt.name" type="text" v-model="templateOptions[opt.name]">
        </template>
        <template v-if="opt.type === 'number'">
          <label :for="opt.name">{{ opt.name }}</label>
          <input :id="opt.name" type="number" v-model="templateOptions[opt.name]">
        </template>
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
