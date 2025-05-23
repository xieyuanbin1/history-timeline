import {defineComponent, onMounted, reactive, Ref, ref, UnwrapRef} from "vue";
import {
  Button,
  Card,
  CardMeta,
  Input,
  InputNumber,
  InputSearch,
  message,
  Modal,
  Popconfirm,
  RadioButton,
  RadioGroup,
  Select,
  SelectOption,
  SelectProps,
  Table,
  Textarea
} from "ant-design-vue";
import {
  slideAddApi, slideDeleteApi,
  timelineAddTitleApi,
  timelineDeleteApi,
  timelineListApi,
  timelineTitleDetailApi, timelineUpdateApi
} from "../../api/timeline.ts";
import {SlideResponse} from "../../types/timeline.rest.ts";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons-vue";
import {SelectValue} from "ant-design-vue/es/select";

import "./manage.less";
import {cloneDeep} from "lodash-es";

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
    const timelineTableColumns = [
      {
        title: '名称',
        dataIndex: 'name',
        width: '70%',
      },
      {
        title: '操作',
        dataIndex: 'operation',
      },
    ];
    const timelineDataSource = ref(timelineList);
    const editableData: UnwrapRef<Record<string, {id: string; name: string}>> = reactive({});
    const edit = (key: string) => {
      console.log('---------------key:;', key);
      console.log('---------------timelineDataSource:;', timelineDataSource.value);
      editableData[key] = cloneDeep(timelineDataSource.value.filter(item => key === item.id)[0]);
    };
    const save = async (key: string) => {
      console.log('--------------- save key:;', key);
      console.log('--------------- editableData[key]:;', editableData[key]);
      if (editableData[key] && editableData[key].name) {
        await timelineUpdateApi(key, editableData[key].name);
        await handleTimelineList()
        Object.assign(timelineDataSource.value.filter(item => key === item.id)[0], editableData[key]);
        delete editableData[key];
      } else {
        message.error("数据不能为空");
      }
    };
    const cancel = (key: string) => {
      console.log('---------------cancel key:;', key);
      console.log('---------------cancel key:;', editableData);
      delete editableData[key];
    };

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
    const slideEndDate: Ref<{year?: number,month?:number,day?:number}> = ref({year: undefined, month: undefined, day: undefined});
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
        slides.value = await timelineTitleDetailApi(id);
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
    async function handleDeleteSlide(id: string) {
      console.log('delete::::::::::', id);
      await slideDeleteApi(id);
      if (timelineValue.value) await handleTimelineDetail(timelineValue.value! as string);
    }

    // 选择时间线
    async function handleSelectTimeline(value: SelectValue) {
      timelineValue.value = value;
      console.log('-------------- select:', value);
      await handleTimelineDetail(value as string)
    }
    // 选择时间线过滤操作
    const handleFilterOption = (input: string, option: any) => {
      return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    };

    // 添加时间线 timeline.name
    async function handleAddTimelineName() {
      if (!timelineAddNameValue.value) return message.error("时间线名称不能为空");
      const add = await timelineAddTitleApi({
        name: timelineAddNameValue.value,
      });
      console.log('-------------- select:', add);
      timelineAddNameValue.value = '';
      handleTimelineList().then();
    }

    // 提交 添加事件的函数
    async function handleAddSlide() {
      if(!slideValue.value) return message.error("请选择时间线");
      if(!slideHeadline.value) return message.error("请填写标题");
      if(!slideText.value) return message.error("请填写内容");
      if(!slideStartDate.value.year) return message.error("请填写事件时间");
      console.log('slideStartDate:::', slideStartDate);
      const slide: {
        id: string;
        type: string;
        text: { headline: string, text: string };
        start_date: {year: number, month: number|undefined, day: number|undefined },
        end_date?: {year: number, month: number|undefined, day: number|undefined },
        group?: string,
      } = {
        id: slideValue.value as string,
        type: slideType.value,
        text: { headline: slideHeadline.value, text: slideText.value },
        start_date: {
          year: slideStartDateCEType.value === 'minus' ? -slideStartDate.value.year : slideStartDate.value.year,
          month: slideStartDate.value.month,
          day: slideStartDate.value.day
        },
      };
      if (slideEndDate.value.year) {
        slide.end_date = {
          year: slideEndDateCEType.value === 'minus' ? -slideEndDate.value.year : slideEndDate.value.year,
          month: slideEndDate.value.month,
          day: slideEndDate.value.day
        }
      }
      if (slideGroup.value) slide.group = slideGroup.value;
      await slideAddApi(slide)
      if (timelineValue.value) await handleTimelineDetail(timelineValue.value! as string);
      openAddSlide.value = false;
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
            showSearch placeholder="选择查看..."
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
          <div class={['list', 'p-4']}>
            <div>
              <InputSearch
                value={timelineAddNameValue.value}
                onChange={(e) => timelineAddNameValue.value = e.target.value!}
                placeholder="添加时间线"
                onSearch={handleAddTimelineName}
                class={['w-2/12',]}>
                {{
                  enterButton: () => <Button>新增</Button>
                }}
              </InputSearch>
            </div>
            <Table columns={timelineTableColumns} dataSource={timelineDataSource.value} bordered class={['mt-2']}>
              {{
                bodyCell: ({ column, text, record }: any) => {
                  if (['name'].includes(column.dataIndex)) {
                    if (editableData[record.id]) return <Input
                      value={editableData[record.id][column.dataIndex as "name"]}
                      onChange={(e) => {editableData[record.id][column.dataIndex! as "name"]=e.target.value!}}
                      class={['-ml-1']}>
                    </Input>;
                    return <div>{text}</div>;
                  }
                  if (column.dataIndex === 'operation') {
                    if (editableData[record.id]) return <span>
                      <a onClick={() => save(record.id)} class={['mr-2']}>保存</a>
                      <a onClick={() => cancel(record.id)}>取消</a>
                    </span>;
                    return <span>
                      <a onClick={() => edit(record.id)} class={['mr-2']}>编辑</a>
                      <Popconfirm title="确定删除?" okText="确定" cancelText="取消" onConfirm={() => handleTimelineDel(record.id)}><a>删除</a></Popconfirm>
                    </span>
                  }
                }
              }}
            </Table>
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
