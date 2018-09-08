<template>
  <div class="input-select">
    <select v-model="option.value" class="input-select_native">
      <option v-if="placeholder" disabled value>{{placeholder}}</option>
      <option v-for="option in options" :value="option.value">
        {{option.name}}
      </option>
    </select>
    <span @click='toggleDropdown'>
      <input 
        class="input-select_input"
        type="text" 
        name=""
        @click='toggleDropdown'
        :value="option.name"
        :placeholder="placeholder"
        disabled
      />
    </span>
    <ul v-if="dropdownVisilbe" class="input-select_options">
      <li 
        v-for="option in options"
        class="input-select_options_item"
        @click="setOption(option) & hideDropdown()"
        :value="option.value"
      >
        {{option.name}}
      </li>
    </ul>
  </div>
</template>
<script src="./input-select.js"></script>
<style lang="sass">
@import 'input-select'
</style>    