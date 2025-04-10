import {defineComponent, onMounted} from "vue";
import {timelineTitleDetailApi} from "../../api/timeline.ts";
import { pick } from "lodash-es";
import Slide = TL.Slide;

export const Timeline = defineComponent({
  name: 'Timeline',
  setup(_props, _ctx) {
    onMounted(async () => {
      const title = await timelineTitleDetailApi('bd84c6e0-b433-4652-b068-ad3abc96470d') as Slide;
      console.log('-------------------------------- title:', title)
      const slide = pick(title, ['start_date', 'end_date', 'text', 'media', 'background'])
      console.log('-------------------------------- slide:', slide)
      const data = {
        title: {
          "start_date": {
            "year": 1000,
            "month": 10,
            "day": 10
          },
          "end_date": {
            "year": 1200,
            "month": 10,
            "day": 20
          },
          "text": {
            "headline": "测试标题",
            "text": "测试内容"
          }
        },
        events: [{
          "start_date": {
            "year": 1000,
            "month": 10,
            "day": 10
          },
          "end_date": {
            "year": 1000,
            "month": 10,
            "day": 20
          },
          "text": {
            "headline": "测试标题",
            "text": "测试内容"
          }
        }]
      };
      const tl = new TL.Timeline('timeline', data, {language: 'zh-cn'});
      console.log('>>', tl)
    })
    return () => (
      <div>
        <div id="timeline" style="width: 100%; height: 600px"></div>
      </div>
    )
  },
})