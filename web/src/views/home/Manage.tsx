import {defineComponent, onMounted, reactive, Ref, ref, UnwrapRef} from "vue";
import {
  Button,
  Card,
  CardMeta,
  Input,
  InputSearch,
  message,
  Modal,
  Popconfirm,
  SelectProps,
  Table,
  Textarea
} from "ant-design-vue";
import {
  eventSlideAddApi, eventSlideDeleteApi,
  timelineAddTitleApi,
  timelineDeleteApi,
  timelineListApi,
  timelineTitleDetailApi, timelineUpdateApi,
  titleSlideAddApi,
  titleSlideDeleteApi
} from "../../api/timeline.ts";
import {SlideResponse} from "../../types/timeline.rest.ts";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons-vue";
import {SelectValue} from "ant-design-vue/es/select";
import flatpickr from "flatpickr";
import dayjs from 'dayjs';

import "./manage.less";
import {cloneDeep} from "lodash-es";
import { useRouter } from "vue-router";

export const Manage = defineComponent({
  name: 'Manage',
  setup(_props, _ctx) {
    const router = useRouter();
    const slideStartDateEle = ref<HTMLDivElement | null>(null); // slideStartDateEle
    const slideEndDateEle = ref<HTMLDivElement | null>(null); // slideStartDateEle

    const timelineList = ref<{_id: string, name: string}[]>([]);
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
    const editableData: UnwrapRef<Record<string, {_id: string; name: string}>> = reactive({});
    const edit = (key: string) => {
      console.log('---------------key:;', key);
      console.log('---------------timelineDataSource:;', timelineDataSource.value);
      editableData[key] = cloneDeep(timelineDataSource.value.filter(item => key === item._id)[0]);
    };
    const save = async (key: string) => {
      console.log('--------------- save key:;', key);
      console.log('--------------- editableData[key]:;', editableData[key]);
      if (editableData[key] && editableData[key].name) {
        try {
          await timelineUpdateApi(key, editableData[key].name);
          await handleTimelineList()
          Object.assign(timelineDataSource.value.filter(item => key === item._id)[0], editableData[key]);
          delete editableData[key];
        } catch (error: any) {
          console.error('更新失败:', error);
          // 这里可以根据实际情况处理错误，比如显示错误信息
          message.error(error.message || "更新失败");
        }
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
    const slideStartDate: Ref<string|undefined> = ref(undefined);
    const slideStartDateCEType = ref('positive'); // positive/negative
    const slideEndDate: Ref<string|undefined> = ref(undefined);
    const slideEndDateCEType = ref('positive');
    // ----------------------------------------------------------------------------------------

    onMounted(() => {
      _init();
      // const fp = flatpickr(slideStartDateEle.value!, { allowInput: true, dateFormat: "Y-m-d", onChange: (selectedDates, dateStr) => {
      //     console.log('flatpickr selected date:', selectedDates, dateStr);
      //     selectedDate.value = dateStr; // 这里可以处理选中的日期
      //   }});
      // console.log('Manage mounted:::::', fp);
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
        timelineOptions.value = list.map(t => ({value: t._id, label: t.name}))
      } catch (e) {
        console.log('[ERROR] 获取时间线列表:', e);
      }
    }

    // 获取时间线详细
    async function handleTimelineDetail(id: string) {
      try {
        if (!id) {
          message.error("请选择时间线");
          slides.value = {events: []};
          timelineValue.value = undefined;
          console.log('handleTimelineDetail: id is empty'); // 直接返回
          return;
        }
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
    async function handleDeleteSlide(type: 'title' | 'event', id: string, sid: string) {
      console.log('delete::::::::::', id, slides.value);
      try {
        if (type === 'title') {
          // 删除 title slide
          await titleSlideDeleteApi(id, sid);
        } else if (type === 'event') {
          // 删除 event slide
          await eventSlideDeleteApi(id, sid);
        }
        if (timelineValue.value) await handleTimelineDetail(timelineValue.value! as string);
      } catch (error: any) {
        console.error('添加事件失败:', error);
        message.error(error.message || "添加事件失败");
      }
    }

    // 选择时间线
    async function handleSelectTimeline(value: SelectValue) {
      console.log('-------------- select:', value);
      timelineValue.value = value;
      await handleTimelineDetail(value as string)
    }

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
      if(!slideStartDate.value) return message.error("请填写事件时间");
      console.log('slideStartDate:::', dayjs(slideStartDate.value));
      const startDate = dayjs(slideStartDate.value);
      if (!startDate.isValid()) return message.error("开始时间格式不正确");
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
          year: slideStartDateCEType.value == 'positive' ? startDate.year() : -startDate.year(),
          month: startDate.month() + 1, // month 是从 0 开始的
          day: startDate.date(),
        },
      };
      if (slideEndDate.value) {
        const endDate = dayjs(slideEndDate.value);
        if (!endDate.isValid()) return message.error("结束时间格式不正确");
        if (endDate.isBefore(startDate)) return message.error("结束时间不能早于开始时间");
        // 如果有结束时间
        console.log('slideEndDate:::', dayjs(slideEndDate.value));
        // 处理结束时间
        slide.end_date = {
          year: slideEndDateCEType.value == 'positive' ? endDate.year() : -endDate.year(),
          month: endDate.month() + 1, // month 是从 0 开始的
          day: endDate.date(),
        }
      }
      if (slideGroup.value) slide.group = slideGroup.value;
      try {
        if (slideType.value === '0') {
          // 添加标题
          await titleSlideAddApi(slide.id, slide);
        }
        if (slideType.value === '1') {
          // 添加事件
          await eventSlideAddApi(slide.id, slide);
        }
        if (timelineValue.value) await handleTimelineDetail(timelineValue.value! as string);
        openAddSlide.value = false;
      } catch (error: any) {
        console.error('添加事件失败:', error);
        message.error(error.message || "添加事件失败");
        return;
      }
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

    // 打开新增事件弹框 初始化数据
    function handleInitAddSlide() {
      openAddSlide.value = true;
      slideValue.value = undefined;
      slideType.value = '1'; // 默认事件类型
      slideGroup.value = undefined;
      slideHeadline.value = undefined;
      slideText.value = undefined;
      slideStartDate.value = undefined;
      slideStartDateCEType.value = 'positive'; // positive/negative
      slideEndDate.value = undefined;
      slideEndDateCEType.value = 'positive';
      // 清理 flatpickr 的值
      console.log('flatpickr mounted:', slideStartDateEle.value);
      setTimeout(() => {
        if (slideStartDateEle.value) {
          const fp = flatpickr(slideStartDateEle.value!, { allowInput: true, dateFormat: "Y-m-d", onChange: (selectedDates, dateStr) => {
            console.log('flatpickr selected date:', selectedDates, dateStr);
            slideStartDate.value = dateStr; // 这里可以处理选中的日期
          }});
          console.log('flatpickr mounted:', fp);
        }
        if (slideEndDateEle.value) {
          const fp = flatpickr(slideEndDateEle.value!, { allowInput: true, dateFormat: "Y-m-d", onChange: (selectedDates, dateStr) => {
            console.log('flatpickr selected date:', selectedDates, dateStr);
            slideStartDate.value = dateStr; // 这里可以处理选中的日期
          }});
          console.log('flatpickr mounted:', fp);
        }
      }, 100);
    }

    function handleRoute(e: MouseEvent, path: string) {
      console.log('handleRoute', path);
      e.preventDefault();
      e.stopPropagation();
      router.push(path);
    }

    return () => (
      <div class={["manage-container", 'p-4']}>
        <button ref="/timeline" onClick={e => handleRoute(e, '/timeline')}>查看模式</button>
        {/* 新增等操作*/}
        <div>
          <select
            value={timelineValue.value}
            onChange={(e: any) => handleSelectTimeline(e.target.value)}
            placeholder="选择查看..."
            style="width: 200px">
            <option value="" key="">-- 选择时间线 --</option>
            {
              timelineOptions.value!.map(t => (
                <option value={t.value} key={t.value!}>{t.label}</option>
              ))
            }
          </select>
          <button onClick={handleTimelineList}>刷新</button>
          <button onClick={() => openTimeline.value = true}>管理时间线</button>
          <button onClick={handleInitAddSlide}>新增事件</button>
        </div>

        <div class={['flex']}>
          <div class={['w-8/12', 'p-4']}>
            <div class={['events-container']}>
              {
                slides.value.title && <Card class={['border-blue-300']} hoverable style="width: 300px">
                  {{
                    default: () => <CardMeta title={slides.value.title?.text.headline} description={slides.value.title?.text.text}></CardMeta>,
                    actions: () => [<EditOutlined key="edit" />, <DeleteOutlined onClick={() => handleDeleteSlide('title', slides.value._id!, slides.value.title?._id!)} key="delete" />]
                  }}
                </Card>
              }
              {
                slides.value.events.map(slide => (
                  <Card hoverable style="width: 300px">
                    {{
                      default: () => <CardMeta title={slide.text.headline} description={slide.text.text}></CardMeta>,
                      actions: () => [<EditOutlined key="edit" />, <DeleteOutlined onClick={() => handleDeleteSlide('event', slides.value._id!, slide._id!)} key="delete" />]
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
          width="80%"
          okText="确定"
          cancelText="取消"
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
                    if (editableData[record._id]) return <Input
                      value={editableData[record._id][column.dataIndex as "name"]}
                      onChange={(e) => {editableData[record._id][column.dataIndex! as "name"]=e.target.value!}}
                      class={['-ml-1']}>
                    </Input>;
                    return <div>{text}</div>;
                  }
                  if (column.dataIndex === 'operation') {
                    if (editableData[record._id]) return <span>
                      <a onClick={() => save(record._id)} class={['mr-2']} style="margin-right:10px;">保存</a>
                      <a onClick={() => cancel(record._id)}>取消</a>
                    </span>;
                    return <span>
                      <a onClick={() => edit(record._id)} class={['mr-2']} style="margin-right:10px;">编辑</a>
                      <Popconfirm title="确定删除?" okText="确定" cancelText="取消" onConfirm={() => handleTimelineDel(record._id)}><a>删除</a></Popconfirm>
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
          width="80%"
          okText="确定"
          cancelText="取消"
          onOk={handleAddSlide}
          onCancel={handleCancelAddSlide}
          open={openAddSlide.value}>
          <p class={['mb-2']} style={{fontWeight: 'bolder'}}>选择时间线</p>
          <select
            value={slideValue.value}
            onChange={(e: Event) => handleSlideSelectTimeline((e.target as HTMLInputElement).value)}
            placeholder="选择..."
            style="width: 200px">
            <option value="" key="">-- 选择时间线 --</option>
            {
              timelineOptions.value!.map(t => (
                <option value={t.value} key={t.value!}>{t.label}</option>
              ))
            }
          </select>
          <p class={['mt-4', 'mb-2']} style={{fontWeight: 'bolder'}}>类型</p>
          {/* 添加的类型 */}
          <label>
            <input
              type="radio"
              name="slideType"
              value="0"
              checked={slideType.value === '0'}
              onChange={(e: Event) => (slideType.value = (e.target as HTMLInputElement).value)}
            />
            标题
          </label>

          <label>
            <input
              type="radio"
              name="slideType"
              value="1"
              checked={slideType.value === '1'}
              onChange={(e: Event) => (slideType.value = (e.target as HTMLInputElement).value)}
            />
            事件
          </label>

          {/* 起止时间 */}
          <p class={['mt-4', 'mb-2']} style={{fontWeight: 'bolder'}}>事件日期</p>
          <p class={['mt-4', 'mb-2']} style={{fontWeight: 'bolder'}}>开始时间</p>
          <select value={slideStartDateCEType.value} onChange={(e: Event) => slideStartDateCEType.value = (e.target as HTMLInputElement).value!}>
            <option value="positive" key="positive">CE</option>
            <option value="negative" key="negative">BCE</option>
          </select>
          <input ref={slideStartDateEle} type="text" placeholder="选择开始时间"></input>

          <p class={['mt-4', 'mb-2']} style={{fontWeight: 'bolder'}}>结束时间</p>
          <select value={slideEndDateCEType.value} onChange={(e: Event) => slideEndDateCEType.value = (e.target as HTMLInputElement).value!}>
            <option value="positive" key="positive">CE</option>
            <option value="negative" key="negative">BCE</option>
          </select>
          <input ref={slideEndDateEle} type="text" placeholder="选择结束时间"></input>

          {/* 根据类型判断是否需要分组，title 标题中不需要分组，events 中可以设置分组进行归类 */}
          {
            slideType.value === "1" && <div>
              <p class={['mt-4', 'mb-2']} style={{fontWeight: 'bolder'}}>分组</p>
              <input value={slideGroup.value} onChange={(e: Event) => slideGroup.value = (e.target as HTMLInputElement).value} style={{ width: '300px' }}></input>
            </div>
          }

          {/* 标题及内容 */}
          <p class={['mt-4', 'mb-2']} style={{fontWeight: 'bolder'}}>正文</p>
          <input
            value={slideHeadline.value}
            onChange={(e: Event) => (slideHeadline.value = (e.target as HTMLInputElement).value!)}
            placeholder={"标题"}
            style="width: 300px"></input>
          <Textarea
            value={slideText.value}
            onChange={(e) => (slideText.value = e.target.value!)}
            autoSize={{minRows: 10, maxRows: 30}}
            placeholder={"内容"}
            class={['mt-4']}></Textarea>

        </Modal>
      </div>
    )
  },
})
