export default {
  name: 'input-select',
  data () {
    return {
      value: '',
      option: this.selectedOption,
      dropdownVisilbe: false
    }
  },
  props: {
    options: {
      type: Array
    },
    placeholder: {
      type: String
    },
    selectedOption: {
      type: Object,
      default: () => { return { value: '' } }
    }
  },
  mounted () {
  },
  methods: {
    toggleDropdown () {
      this.dropdownVisilbe = this.dropdownVisilbe === false
    },
    hideDropdown () {
      this.dropdownVisilbe = false
    },
    setOption (option) {
      if (option !== this.option) {
        this.$emit('change', option)
        this.option = option
      }
    }
  }
}
