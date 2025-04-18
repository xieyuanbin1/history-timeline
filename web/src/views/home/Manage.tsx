import {defineComponent, onMounted, ref} from "vue";
import {Button, Card, CardMeta, InputSearch, message, Modal, Select, SelectProps} from "ant-design-vue";
import {timelineAddTitleApi, timelineDeleteApi, timelineListApi, timelineTitleDetailApi} from "../../api/timeline.ts";
import {SlideResponse} from "../../types/timeline.rest.ts";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons-vue";
import {SelectValue} from "ant-design-vue/es/select";

import "./manage.less";

export const Manage = defineComponent({
  name: 'Manage',
  setup(_props, _ctx) {
    const timelineList = ref<{id: string, name: string}[]>([]);
    const slides = ref<SlideResponse>({events: []});

    // 时间线下拉框数据
    const timelineOptions = ref<SelectProps['options']>([]);
    // 当前选择的时间线数据
    const timelineValue = ref<SelectValue>(undefined);

    //
    const timelineAddNameValue = ref('');

    // 控制显示编辑时间线模态框
    const openTimeline = ref<boolean>(false);

    onMounted(() => {
      _init();
    })

    function _init() {
      handleTimelineList().then();
    }

    // 获取时间线列表
    async function handleTimelineList () {
      try {
        const list = await timelineListApi();
        console.log('==========', list)
        timelineList.value = list;
        timelineOptions.value = list.map(t => ({value: t.id, label: t.name}))
      } catch (e) {
        console.log('[ERROR] 获取时间线列表:', e);
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
      handleTimelineList().then();
    }

    // 删除 slide
    function handleDeleteSlide(id: string) {
      console.log('delete::::::::::', id);
    }

    // 选择时间线
    function handleSelectTimeline(value: SelectValue) {
      timelineValue.value = value;
      console.log('-------------- select:', value);
      handleTimelineDetail(value as string).then()
    }
    // 选择时间线过滤操作
    const handleFilterOption = (input: string, option: any) => {
      return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    };

    // 添加时间线 timeline.name
    async function handleAddTimelineName() {
      console.log('-----value:', timelineAddNameValue.value);
      if (!timelineAddNameValue.value) return message.error("时间线名称不能为空");
      const add = await timelineAddTitleApi({
        name: timelineAddNameValue.value,
      });
      console.log('==========', add)
      timelineAddNameValue.value = '';
      handleTimelineList().then();
    }

    return () => (
      <div class={["manage-container", 'p-4']}>
        {/* 新增等操作*/}
        <div>
          <Select
            value={timelineValue.value}
            options={timelineOptions.value}
            filterOption={handleFilterOption}
            onChange={handleSelectTimeline}
            showSearch placeholder="选择..."
            style="width: 200px">
          </Select>
          <Button onClick={handleTimelineList}>刷新</Button>
          <Button onClick={() => openTimeline.value = true}>管理时间线</Button>
          <Button>新增事件</Button>
        </div>

        <div class={['flex']}>
          <div class={['w-8/12', 'p-4']}>
            <div class={['events-container']}>
              {
                slides.value.title && <Card class={['border-blue-300']} hoverable style="width: 300px">
                  {{
                    default: () => <CardMeta title={slides.value.title?.text.headline} description={slides.value.title?.text.text}></CardMeta>,
                    actions: () => [<EditOutlined key="edit" />, <DeleteOutlined onClick={() => handleDeleteSlide(slides.value.title?.id!)} key="delete" />]
                  }}
                </Card>
              }
              {
                slides.value.events.map(slide => (
                  <Card hoverable style="width: 300px">
                    {{
                      default: () => <CardMeta title={slide.text.headline} description={slide.text.text}></CardMeta>,
                      actions: () => [<EditOutlined key="edit" />, <DeleteOutlined onClick={() => handleDeleteSlide(slide.id!)} key="delete" />]
                    }}
                  </Card>
                ))
              }
            </div>
          </div>
        </div>

        {/*编辑操作时间线*/}
        <Modal
          title="时间线"
          width="100%"
          wrapClassName="full-modal"
          onOk={() => openTimeline.value = false}
          onCancel={() => openTimeline.value = false}
          open={openTimeline.value}>
          <div class={['list', 'w-2/12', 'p-4']}>
            <div>
              <InputSearch
                value={timelineAddNameValue.value}
                onChange={(e) => timelineAddNameValue.value = e.target.value!}
                placeholder="添加时间线"
                onSearch={handleAddTimelineName}>
                {{
                  enterButton: () => <Button>新增</Button>
                }}
              </InputSearch>
            </div>
            <ul>
              {
                timelineList.value.map((tl: { id: string, name: string }) => {
                  return <li class={['cursor-pointer']} key={tl.id}>
                    {tl.name}
                    <Button onClick={() => handleTimelineDel(tl.id)}>删除</Button>
                  </li>
                })
              }
            </ul>
          </div>
        </Modal>
      </div>
    )
  },
})
