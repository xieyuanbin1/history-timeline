import {defineComponent, onMounted} from "vue";
import {RouterView} from "vue-router";
import {Button} from "ant-design-vue";

export const Home = defineComponent({
  name: 'Home',
  setup(_props, _ctx) {
    onMounted(async () => {
      console.log('[on Mounted].')
    })

    return () => (
      <div class="main-container">
        <div class={['flex', 'justify-end', 'grid']}>
          <p>
            <Button type="link" href="/timeline">时间线</Button>
            <Button type="link" href="/manage">数据管理</Button>
          </p>
        </div>
        <RouterView/>
      </div>
    )
  },
})
