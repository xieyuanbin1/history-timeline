import {defineComponent, onMounted, ref} from "vue";
import {timelineListApi, timelineTitleDetailApi} from "../../api/timeline.ts";
import {Select, SelectProps} from "ant-design-vue";
import {SelectValue} from "ant-design-vue/es/select";

export const Timeline = defineComponent({
  name: 'Timeline',
  setup(_props, _ctx) {
    const timelineList = ref<{id: string, name: string}[]>([]);
    // 时间线下拉框数据
    const timelineOptions = ref<SelectProps['options']>([]);
    // 当前选择的时间线数据
    const timelineValue = ref<SelectValue>(undefined);

    onMounted(async () => {
      const list = await timelineListApi();
      timelineList.value = list;
      timelineOptions.value = list.map(t => ({value: t.id, label: t.name}))
    })

    // 选择时间线过滤操作
    const handleFilterOption = (input: string, option: any) => {
      return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    };

    // 选择时间线
    async function handleSelectTimeline(value: SelectValue) {
      timelineValue.value = value;
      await renderTimeline();
    }

    async function renderTimeline() {
      if (!timelineValue.value) return;
      const data = await timelineTitleDetailApi(timelineValue.value as string);
      new TL.Timeline('timeline', data, {language: 'zh-cn', initial_zoom: 3});
    }
    return () => (
      <div>
        <div class={['pl-4', 'pr-4']}>
          <Select
            value={timelineValue.value}
            options={timelineOptions.value}
            filterOption={handleFilterOption}
            onChange={handleSelectTimeline}
            showSearch placeholder="选择时间线"
            style="width: 200px">
          </Select>
        </div>
        <div id="timeline" style="width: 100%; height: 600px"></div>
      </div>
    )
  },
})