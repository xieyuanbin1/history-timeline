import {defineComponent, onMounted} from "vue";
import {timelineTitleDetailApi} from "../../api/timeline.ts";

export const Timeline = defineComponent({
  name: 'Timeline',
  setup(_props, _ctx) {
    onMounted(async () => {
      const data = await timelineTitleDetailApi('bd84c6e0-b433-4652-b068-ad3abc96470d') as TL.Data;
      console.log('-------------------------------- title:', data)

      const tl = new TL.Timeline('timeline', data, {language: 'zh-cn', initial_zoom: 3});
      console.log('>>', tl)
    })
    return () => (
      <div>
        <div id="timeline" style="width: 100%; height: 600px"></div>
      </div>
    )
  },
})