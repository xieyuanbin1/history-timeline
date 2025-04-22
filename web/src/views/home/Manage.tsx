import {defineComponent, onMounted, Ref, ref} from "vue";
import {
  Button,
  Card,
  CardMeta,
  Input, InputNumber,
  InputSearch,
  message,
  Modal, RadioButton, RadioGroup,
  Select, SelectOption,
  SelectProps,
  Textarea
} from "ant-design-vue";
import {
  slideAddApi,
  timelineAddTitleApi,
  timelineDeleteApi,
  timelineListApi,
  timelineTitleDetailApi
} from "../../api/timeline.ts";
import {SlideResponse} from "../../types/timeline.rest.ts";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons-vue";
import {SelectValue} from "ant-design-vue/es/select";

import "./manage.less";
import {pick} from "lodash-es";

export const Manage = defineComponent({
  name: 'Manage',
  setup(_props, _ctx) {
    const timelineList = ref<{id: string, name: string}[]>([]);
    const slides = ref<SlideResponse>({events: []});

    // 时间线下拉框数据
    const timelineOptions = ref<SelectProps['options']>([]);
    // 当前选择的时间线数据
    const timelineValue = ref<SelectValue>(undefined);

    // 添加时间线的输入框值
    const timelineAddNameValue = ref('');

    // 控制显示编辑时间线模态框
    const openTimeline = ref<boolean>(false);

    // 控制添加 事件的模态框
    const openAddSlide = ref<boolean>(false);

    // 添加事件选择时间线绑定的数据
    const slideValue = ref<SelectValue>(undefined);
    const slideType = ref<string>('1');
    const slideGroup = ref<string | undefined>(undefined);
    const slideHeadline = ref<string|undefined>(undefined);
    const slideText = ref<string|undefined>(undefined);
    const slideStartDate: Ref<{year: undefined|number,month?:number,day?:number}> = ref({year: undefined, month: undefined, day: undefined});
    const slideStartDateCEType = ref('add')
    const slideEndDate = ref({year: undefined, month: undefined, day: undefined});
    const slideEndDateCEType = ref('add')
    // ----------------------------------------------------------------------------------------

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

    // 提交 添加事件的函数
    async function handleAddSlide() {
      console.log('add slide.');
      console.log('====    slideValue:', slideStartDate.value);
      if(!slideValue.value) return message.error("请选择时间线");
      if(!slideHeadline.value) return message.error("请填写标题");
      if(!slideText.value) return message.error("请填写内容");
      if(!slideStartDate.value.year) return message.error("请填写事件时间");
      slideAddApi({
        id: slideValue.value as string,
        type: slideType.value,
        text: { headline: slideHeadline.value, text: slideText.value },
        start_date: pick(slideStartDate.value, ['year', 'month', 'day']),
        end_date: pick(slideStartDate.value, ['year', 'month', 'day']),
        group: slideGroup.value,
      }).then(() => {
        openAddSlide.value = false;
      })
    }

    // 取消添加
    async function handleCancelAddSlide() {
      openAddSlide.value = false;
      // TODO: 清理模态框的临时数据
    }

    function handleSlideSelectTimeline(value: SelectValue) {
      console.log('-------------- select:', value);
      slideValue.value = value;
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
          <Button onClick={() => openAddSlide.value = true}>新增事件</Button>
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
          okText="确定"
          cancelText="取消"
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

        {/*添加事件*/}
        <Modal
          title="添加事件"
          width="100%"
          wrapClassName="full-modal"
          okText="确定"
          cancelText="取消"
          onOk={handleAddSlide}
          onCancel={handleCancelAddSlide}
          open={openAddSlide.value}>
          <h1 class={['mb-2']} style={{fontSize: 'large', fontWeight: 'bolder'}}>选择时间线</h1>
          <Select
            value={slideValue.value}
            options={timelineOptions.value}
            filterOption={handleFilterOption}
            onChange={handleSlideSelectTimeline}
            showSearch placeholder="选择..."
            style="width: 200px">
          </Select>
          <h1 class={['mt-4', 'mb-2']} style={{fontSize: 'large', fontWeight: 'bolder'}}>类型</h1>
          <RadioGroup
            value={slideType.value}
            onChange={(e) => (slideType.value = e.target.value)}
            buttonStyle="solid">
            <RadioButton value='0'>Title</RadioButton>
            <RadioButton value='1'>Slide</RadioButton>
          </RadioGroup>
          {
            slideType.value === "1" && <div>
              <h1 class={['mt-4', 'mb-2']} style={{fontSize: 'large', fontWeight: 'bolder'}}>分组</h1>
              <Input value={slideGroup.value} onChange={(e) => slideGroup.value = e.target.value!} style="width: 300px"></Input>
            </div>
          }
          <h1 class={['mt-4', 'mb-2']} style={{fontSize: 'large', fontWeight: 'bolder'}}>正文</h1>
          <Input
            value={slideHeadline.value}
            onChange={(e) => (slideHeadline.value = e.target.value!)}
            placeholder={"标题"}
            style="width: 300px"></Input>
          <Textarea
            value={slideText.value}
            onChange={(e) => (slideText.value = e.target.value!)}
            autoSize={{minRows: 10, maxRows: 30}}
            placeholder={"内容"}
            class={['mt-4']}></Textarea>

          <h1 class={['mt-4', 'mb-2']} style={{fontSize: 'large', fontWeight: 'bolder'}}>事件日期</h1>
          <h1 class={['mt-4', 'mb-2']} style={{fontSize: 'medium', fontWeight: 'bolder'}}>开始时间</h1>
          <InputNumber value={slideStartDate.value.year} min={-10000} max={5000} onChange={(val) => slideStartDate.value.year = val as number} style="width:150px">
            {{
              addonBefore: () => (<Select value={slideStartDateCEType.value}
                                          onChange={(val) => (slideStartDateCEType.value = val as string)}
                                          style="width:60px">
                <SelectOption value="add">+</SelectOption>
                <SelectOption value="minus">-</SelectOption>
              </Select>)
            }}
          </InputNumber>
          <InputNumber value={slideStartDate.value.month} min={1} max={12} onChange={(val) => slideStartDate.value.month = val as number} style="width:80px"></InputNumber>
          <InputNumber value={slideStartDate.value.day} min={1} max={31} onChange={(val) => slideStartDate.value.day = val as number} style="width:80px"></InputNumber>

          <h1 class={['mt-4', 'mb-2']} style={{fontSize: 'medium', fontWeight: 'bolder'}}>结束时间</h1>
          <InputNumber value={slideEndDate.value.year} min={-10000} max={5000} style="width:150px">
            {{
              addonBefore: () => (<Select value={slideEndDateCEType.value}
                                          onChange={(val) => (slideEndDateCEType.value = val as string)}
                                          style="width:60px">
                <SelectOption value="add">+</SelectOption>
                <SelectOption value="minus">-</SelectOption>
              </Select>)
            }}
          </InputNumber>
          <InputNumber value={slideEndDate.value.month} min={1} max={12} style="width:80px"></InputNumber>
          <InputNumber value={slideEndDate.value.day} min={1} max={31} style="width:80px"></InputNumber>
        </Modal>
      </div>
    )
  },
})
