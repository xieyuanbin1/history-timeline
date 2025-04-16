import {defineComponent, onMounted, ref} from "vue";
import {Button} from "ant-design-vue";
import {timelineAddTitleApi, timelineDeleteApi, timelineListApi, timelineTitleDetailApi} from "../../api/timeline.ts";
import {SlideResponse} from "../../types/timeline.rest.ts";

export const Manage = defineComponent({
  name: 'Manage',
  setup(_props, _ctx) {
    const timelineList = ref<{id: string, name: string}[]>([]);
    const slides = ref<SlideResponse>({events: []});

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
        const data = await timelineTitleDetailApi(id);
        console.log('---------- data:', data);
        slides.value = data;
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

        <div class={['flex']}>
          {/* 列表 */}
          <div class={['list', 'w-2/12', 'pl-4', 'pr-4']}>
            <ul>
              {
                timelineList.value.map((tl: { id: string, name: string }) => {
                  return <li key={tl.id}>{tl.name} <Button onClick={() => handleTimelineDetail(tl.id)}>详细</Button> <Button onClick={() => handleTimelineDel(tl.id)}>删除</Button></li>
                })
              }
            </ul>
          </div>

          <div class={['w-8/12', 'pl-4', 'pr-4']}>
            <div class={['title-container']}>{JSON.stringify(slides.value.title)}</div>
            <div class={['events-container']}>{JSON.stringify(slides.value.events)}</div>
          </div>
        </div>

      </div>
    )
  },
})
