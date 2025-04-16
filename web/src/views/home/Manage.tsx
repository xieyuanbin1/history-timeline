import {defineComponent, onMounted, ref} from "vue";
import {Button, Card, CardMeta} from "ant-design-vue";
import {timelineAddTitleApi, timelineDeleteApi, timelineListApi, timelineTitleDetailApi} from "../../api/timeline.ts";
import {SlideResponse} from "../../types/timeline.rest.ts";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons-vue";

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

    // 删除 slide
    function handleDeleteSlide(id: string) {
      console.log('delete::::::::::', id);
    }

    return () => (
      <div class={["manage-container", 'p-4']}>
        {/* 新增等操作*/}
        <div>
          <Button onClick={handleTimelineList}>刷新</Button>
          <Button onClick={handleTimelineAddSlide}>新增时间线</Button>
          <Button>新增事件</Button>
        </div>

        <div class={['flex']}>
          {/* 列表 */}
          <div class={['list', 'w-2/12', 'p-4']}>
            <ul>
              {
                timelineList.value.map((tl: { id: string, name: string }) => {
                  return <li class={['cursor-pointer']} onClick={() => handleTimelineDetail(tl.id)} key={tl.id}>{tl.name} <Button onClick={() => handleTimelineDel(tl.id)}>删除</Button></li>
                })
              }
            </ul>
          </div>

          <div class={['w-8/12', 'p-4']}>
            <div class={['events-container']}>
              {
                slides.value.title && <Card
                  class={['border-blue-300']}
                  hoverable
                  v-slots={{
                    actions: () => [<EditOutlined key="edit" />, <DeleteOutlined onClick={() => handleDeleteSlide(slides.value.title?.id!)} key="delete" />]
                  }}
                  style="width: 300px">
                  <CardMeta title={slides.value.title?.text.text} description={slides.value.title?.text.headline}></CardMeta>
                </Card>
              }
              {
                slides.value.events.map(slide => (
                  <div>
                    <Card
                      hoverable
                      v-slots={{
                        actions: () => [<EditOutlined key="edit" />, <DeleteOutlined onClick={() => handleDeleteSlide(slide.id!)} key="delete" />]
                      }}
                      style="width: 300px">
                      <CardMeta title={slide.text.text} description={slide.text.headline}></CardMeta>
                    </Card>
                  </div>
                ))
              }
            </div>
          </div>
        </div>

      </div>
    )
  },
})
