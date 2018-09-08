<template>
  <div class="builder">
    <div class="builder_template">
      <input-label :name="'Template:'" />
      <input-select
        @change="getTemplate"
        :placeholder="'Choose...'"
        :options="templateTypes"
      />
      <p v-if="template">Selected: {{ template }}</p>
    </div>
    <div class="builder_options">
      <div v-for="opt in typedTemplateOptions" class="builder_options_cell">
        <label class="builder_options_label" :for="opt.name">{{ opt.label }}</label>
        <input 
          v-model="templateOptions[opt.name]" 
          :id="opt.name" 
          :class="`builder_options_input builder_options_input-${opt.type}`"
          :type="opt.type"
        >
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
