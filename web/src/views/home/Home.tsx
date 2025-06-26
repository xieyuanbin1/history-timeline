import {defineComponent, onMounted} from "vue";
import {RouterView} from "vue-router";

export const Home = defineComponent({
  name: 'Home',
  setup(_props, _ctx) {
    onMounted(async () => {
      console.log('[on Mounted].')
    })

    return () => (
      <div class="main-container">
        <RouterView/>
      </div>
    )
  },
})
