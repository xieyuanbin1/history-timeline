import {defineComponent, onMounted} from "vue";
import {RouterView} from "vue-router";
import {pingApi} from "../../api/ping.ts";
import {Button} from "ant-design-vue";

export const Home = defineComponent({
  name: 'Home',
  setup(_props, _ctx) {
    onMounted(async () => {
      console.log('[on Mounted].')
    })

    // login
    async function handlePing() {
      const ping = await pingApi()
      console.log('ping ====>', ping)
    }

    return () => (
      <div class="main-container">
        <div class={['flex', 'justify-end', 'grid']}>
          <p>
            <Button type="link" href="/timeline">时间线</Button>
            <Button type="link" href="/manage">数据管理</Button>
          </p>
        </div>
        <p>
          <Button onClick={handlePing}>测试接口</Button>
        </p>
        <RouterView/>
      </div>
    )
  },
})
