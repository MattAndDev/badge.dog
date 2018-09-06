export default {
  name: 'builder',
  computed: {
    typedTemplateOptions () {
      let opts = []
      for (var opt in this.templateOptions) {
        let type = ''
        switch (typeof this.templateOptions[opt]) {
          case 'string':
            if (
              this.templateOptions[opt].charAt(0) === '#' &&
              (this.templateOptions[opt].length === 7 || this.templateOptions[opt].length === 4)
            ) {
              type = 'color'
              break
            }
            type = 'text'
            break
          case 'number':
            type = 'number'
        }
        opts.push({
          name: opt,
          type,
          value: this.templateOptions[opt]
        })
      }
      return opts
    }
  },
  data () {
    return {
      template: '',
      bgColor: '#ffffff',
      result: '',
      templateOptions: {},
      isLoading: false
    }
  },
  methods: {
    getTemplate: async function () {
      this.isLoading = true
      this.result = ''
      var queryString = Object.keys(this.templateOptions).map(key => key + '=' + encodeURIComponent(this.templateOptions[key])).join('&')
      let opts = require(`../../../templates/${this.template}/opts.js`)
      this.templateOptions = opts
      let result = await fetch(`http://localhost:3100/woof/${this.template}.svg?${queryString}`)
      result = await result.text()
      this.isLoading = false
      this.result = result
    }
  }
}
