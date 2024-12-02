import {defineComponent} from "vue";
import {RouterView} from "vue-router";

export const App = defineComponent({
  name: 'App',
  setup(_props, _ctx) {
    return () => (<RouterView />)
  },
})
