import {defineComponent, onMounted} from "vue";

export const Timeline = defineComponent({
  name: 'Timeline',
  setup(_props, _ctx) {
    onMounted(() => {
      const data: TL.Data = {
        "title": {
          "start_date": {
            "year": -2070
          },
          "end_date": {
            "year": -1600
          },
          "text": {
            "headline": "夏朝<br/> 约前2070年 - 约前1600年",
            "text": "<p>中国历史记载的第一个中原部族世袭制朝代。一般认为夏朝的政治形态是由多个部落联盟或复杂酋邦形式联合组成，其主体部族称为夏人。根据史书记载，禹传位于子启，改变原始部落的禅让制，由天下为公转变为家天下，开创中国近四千年世袭王位之先河。夏代共传十四朝，十七王，国君为姒姓，延续470年，为商朝所灭。夏朝作为中国传统历史的第一个王朝，拥有较高的历史地位，后人常以“华夏”、“诸夏”自称，使之成为中国的代名词。</p>"
          }
        },
        "events": [
          {
            "group": "军事",
            "text": {
              "headline": "甘之战",
              "text": "夏王启与西方诸侯有扈氏之间的战争，战斗结果为有扈氏在甘（陕西户县,另一说为洛阳附近）被击败。夏后氏获得胜利，启得以建立中国第一个王朝夏朝。"
            },
            media: {
              caption: 'sss',
              credit: 'credit--------',
              url: 'https://cdn.pixabay.com/photo/2024/11/07/18/48/sofa-9181557_1280.jpg',
              thumbnail: 'https://cdn.pixabay.com/photo/2024/11/07/18/48/sofa-9181557_1280.jpg',
            },
            "start_date": {
              "year": -2071
            }
          }
        ]
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