import { Component, Prop } from 'vue-property-decorator'
import Vue from 'vue'

@Component
export default class Tsx extends Vue {
  render() {
    return (
      <h1>hello word!</h1>
    )
  }
  @Prop() id: string
}