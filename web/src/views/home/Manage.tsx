import {defineComponent, onMounted} from "vue";
import {Button} from "ant-design-vue";
import {timelineListApi} from "../../api/timeline.ts";

export const Manage = defineComponent({
  name: 'Manage',
  setup(_props, _ctx) {
    onMounted(() => {
      handleTimelineList().then(() => {});
    })

    // 获取时间线列表
    async function handleTimelineList () {
      try {
        const list = await timelineListApi();
        console.log('==========', list)
      } catch (e) {
        console.log('eeeeeeee::', e);
      }
    }

    return () => (
      <div class={["manage-container", 'p-4']}>
        {/* 新增等操作*/}
        <div>
          <Button>新增时间线</Button>
          <Button>新增事件</Button>
        </div>

        {/* 列表 */}
        <div class="list"></div>
      </div>
    )
  },
})
