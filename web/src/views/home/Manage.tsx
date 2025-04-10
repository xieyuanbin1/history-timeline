import {defineComponent, onMounted, ref} from "vue";
import {Button} from "ant-design-vue";
import {timelineAddTitleApi, timelineDeleteApi, timelineListApi, timelineTitleDetailApi} from "../../api/timeline.ts";

export const Manage = defineComponent({
  name: 'Manage',
  setup(_props, _ctx) {
    const timelineList = ref<{id: string, name: string}[]>([]);
    onMounted(() => {
      handleTimelineList().then(() => {});
    })

    // 获取时间线列表
    async function handleTimelineList () {
      try {
        const list = await timelineListApi();
        console.log('==========', list)
        timelineList.value = list;
      } catch (e) {
        console.log('eeeeeeee::', e);
      }
    }

    // 获取时间线详细
    async function handleTimelineDetail(id: string) {
      try {
        console.log('---------- detail:', id);
        const title = await timelineTitleDetailApi(id);
        console.log('---------- title:', title);
      } catch (e) {
        console.log('[error] slide detail:', e)
      }
    }

    // 删除时间线
    async function handleTimelineDel(id: string) {
      console.log('-- 删除 时间线 包括 tl， slide 下的所有数据', id);
      const ret = await timelineDeleteApi(id);
      console.log('delete:', ret);
    }

    // 添加时间线 slide
    async function handleTimelineAddSlide() {
      try {
        const add = await timelineAddTitleApi({
          name: `test-${Date.now()}`,
          start_date: { year: 1000, month: 10, day: 10 },
          end_date: { year: 1000, month: 10, day: 10 },
          text: { headline: '测试标题', text: '测试内容'},
        });
        console.log('==========', add)
      } catch (e) {
        console.log('[error] add slide:', e)
      }
    }

    return () => (
      <div class={["manage-container", 'p-4']}>
        {/* 新增等操作*/}
        <div>
          <Button onClick={handleTimelineList}>更新 timeline 列表数据</Button>
          <Button onClick={handleTimelineAddSlide}>新增时间线</Button>
          <Button>新增事件</Button>
        </div>

        {/* 列表 */}
        <div class="list">
          <ul>
            {
              timelineList.value.map((tl: { id: string, name: string }) => {
                return <li key={tl.id}>{tl.name} <Button onClick={() => handleTimelineDetail(tl.id)}>详细</Button> <Button onClick={() => handleTimelineDel(tl.id)}>删除</Button></li>
              })
            }
          </ul>
        </div>
      </div>
    )
  },
})
