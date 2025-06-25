import {defineComponent, onMounted} from "vue";
import {RouterView, useRouter} from "vue-router";

export const Home = defineComponent({
  name: 'Home',
  setup(_props, _ctx) {
    const router = useRouter();
    onMounted(async () => {
      console.log('[on Mounted].')
    })

    function handleRoute(e: MouseEvent, path: string) {
      console.log('handleRoute', path);
      e.preventDefault();
      e.stopPropagation();
      router.push(path);
      // 路由跳转
      // const router = _ctx.root.$router;
      // if (router) {
      //   router.push(path).catch(err => {
      //     console.error('Router push error:', err);
      //   });
      // }
    }

    return () => (
      <div class="main-container">
        <div class={['flex', 'justify-end', 'grid']}>
          <p>
            <button ref="/timeline" onClick={e => handleRoute(e, '/timeline')}>时间轴</button>
            <button ref="/timeline" onClick={e => handleRoute(e, '/manage')}>数据管理</button>
          </p>
        </div>
        <RouterView/>
      </div>
    )
  },
})
