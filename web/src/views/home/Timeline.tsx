import {defineComponent, onMounted, ref} from "vue";
import {timelineListApi, timelineTitleDetailApi} from "../../api/timeline.ts";
import {message, SelectProps} from "ant-design-vue";
import {SelectValue} from "ant-design-vue/es/select";

export const Timeline = defineComponent({
  name: 'Timeline',
  setup(_props, _ctx) {
    const timelineList = ref<{_id: string, name: string}[]>([]);
    // 时间线下拉框数据
    const timelineOptions = ref<SelectProps['options']>([]);
    // 当前选择的时间线数据
    const timelineValue = ref<SelectValue>(undefined);

    onMounted(async () => {
      const list = await timelineListApi();
      console.log('timeline list', list);
      timelineList.value = list;
      timelineOptions.value = list.map(t => ({value: t._id, label: t.name}))
    })

    // 选择时间线
    async function handleSelectTimeline(value: SelectValue) {
      timelineValue.value = value;
      await renderTimeline();
    }

    async function renderTimeline() {
      if (!timelineValue.value) return;
      const data = await timelineTitleDetailApi(timelineValue.value as string);
      if (data && data.events.length) {
        new TL.Timeline('timeline', data, {language: 'zh-cn', initial_zoom: 3});
      } else {
        message.warning('当前时间线没有事件数据');
      }
    }
    return () => (
      <div>
        <div class={['pl-4', 'pr-4']}>
          <select name="timeline" id="timeline-select" placeholder="选择时间线" value={timelineValue.value} onChange={(e: any) => handleSelectTimeline(e.target.value)}>
            <option value="" key= "">-- 选择时间线 --</option>
            {timelineList.value.map(t => (
              <option value={t._id} key={t._id}>{t.name}</option>
            ))}
          </select>
        </div>
        <div id="timeline" style="width: 100%; height: 600px"></div>
      </div>
    )
  },
})