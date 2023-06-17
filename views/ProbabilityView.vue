<template>
  <section>
    <div class="w-full h-14 bg-orange-400 text-white flex items-center justify-center text-sm">
      <div class="w-1/3 h-14 bg-orange-500 rounded-br-full">
        <div class="text-center">
          Probability<br><i class="fa-solid fa-hurricane text-2xl"></i>
        </div>
      </div>
      <div class="w-2/3 px-2">沖縄県内各地が暴風域に入る確率です。</div>
    </div>
  </section>
  <section>
    <div class="mt-1.5">
      <div class="border-b border-b-gray-100">
        <ul class="flex justify-center gap-3  text-sm font-medium" style="width: 100%;">
          <li>
            <a @click="clickTab(0)" class="cursor-pointer hover:text-sky-700" :class="{ 'relative text-primary-700  after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:bg-sky-700': active_tab === -1 }"><i class="fa-solid fa-hurricane"></i></a>
          </li>
          <li>
            <a @click="clickTab(1)" class="cursor-pointer hover:text-sky-700" :class="{ 'relative text-primary-700  after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:bg-sky-700': active_tab === 1 }"> 沖縄本島</a>
          </li>
          <li>
            <a @click="clickTab(2)" class="cursor-pointer hover:text-sky-700" :class="{ 'relative text-primary-700  after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:bg-sky-700': active_tab === 2 }"> 宮古島</a>
          </li>
          <li>
            <a @click="clickTab(3)" class="cursor-pointer hover:text-sky-700" :class="{ 'relative text-primary-700  after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:bg-sky-700': active_tab === 3 }"> 石垣島</a>
          </li>
          <li>
            <a @click="clickTab(4)" class="cursor-pointer hover:text-sky-700" :class="{ 'relative text-primary-700 after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:bg-sky-700': active_tab === 4 }"> 大東島</a>
          </li>
        </ul>
      </div>
      <div class="mt-0.5">
        <div v-show="active_tab === 1">
          <div class="max-w-lg absolute" style="margin-left: calc(100vw/2 - 9rem + 2.9rem);">
            <ul class="list-disc text-sm pl-5 opacity-90 bg-white rounded">
              <li class="mb-1 cursor-pointer" @click="routePush('南部')">南部</li>
              <li class="mb-1 cursor-pointer" @click="routePush('中部')">中部</li>
              <li class="mb-1 cursor-pointer" @click="routePush('慶良間・粟国諸島')">慶良間・粟国諸島</li>
              <li class="mb-1 cursor-pointer" @click="routePush('伊是名・伊平屋')">伊是名・伊平屋</li>
              <li class="mb-1 cursor-pointer" @click="routePush('国頭地区')">国頭地区</li>
              <li class="mb-1 cursor-pointer" @click="routePush('名護地区')">名護地区</li>
              <li class="mb-1 cursor-pointer" @click="routePush('恩納・金武地区')">恩納・金武地区</li>
              <li class="mb-1 cursor-pointer" @click="routePush('久米島')">久米島</li>
            </ul>
          </div>
        </div>
        <div v-show="active_tab === 2">
          <div class="max-w-lg absolute" style="margin-left: calc(100vw/2 - 9rem + 7rem);">
            <ul class="list-disc text-sm pl-5 opacity-90 bg-white">
              <li class="mb-1 cursor-pointer" @click="routePush('宮古島')">宮古島</li>
              <li class="mb-1 cursor-pointer" @click="routePush('多良間島')">多良間島</li>
            </ul>
          </div>
        </div>
        <div v-show="active_tab === 3">
          <div class="max-w-lg absolute" style="margin-left: calc(100vw/2 - 9rem + 9.5rem);">
            <ul class="list-disc text-sm pl-5 opacity-90 bg-white">
              <li class="mb-1 cursor-pointer" @click="routePush('石垣市')">石垣市</li>
              <li class="mb-1 cursor-pointer" @click="routePush('竹富町')">竹富町</li>
              <li class="mb-1 cursor-pointer" @click="routePush('与那国地方')">与那国島地方</li>
            </ul>
          </div>
        </div>
        <div v-show="active_tab === 4" style="margin-left: calc(100vw/2 - 9rem + 13.8rem);">
          <div class="max-w-lg absolute">
            <ul class="list-disc text-sm pl-5 opacity-90 bg-white">
              <li class="mb-1 cursor-pointer" @click="routePush('大東島地方')">大東島地方</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
  <div style="height: calc(100vh - 2.75rem - .5rem - 2.25rem - 3.5rem - 4.5rem); max-width: 98vw;" class="mt-2 flex justify-center" @click="clickTab(0)">
    <canvas id="myChart" width="400" height="400" class=""></canvas>
  </div>
</template>



<script>
// import {mapActions} from "vuex";
import {mapGetters} from "vuex";
import Chart from 'chart.js/auto';

let chart_element = null
export default {
  name: 'ProbabilityView',
  data() {
    return {
      active_tab: 0,
    }
  },
  computed: {
    ...mapGetters(
        [
          "probabilityAreas",
          "probabilityDateTimes",
          "probabilityData"
        ]
    ),
    probabilityDates() {
      const result = []
      for( let index = 0; index < this.probabilityDateTimes.length; index++ ) {
        const date = this.probabilityDateTimes[index] && this.probabilityDateTimes[index].replace(/(\d{4})-(\d{2})-(\d{2}).+/, '$2月$3日')
        if (!result.includes(date))
          result.push(date)
      }
      return result
    }
  },
  methods: {
    isMiddleArea(area) {
      for( const data of this.probabilityAreas )
        if( data.middle_area === area )
          return true
      return false
    },
    clickTab(active_tab) {
      if(active_tab === this.active_tab)
        this.active_tab = 0
      else
        this.active_tab = active_tab
    },
    routePush(middle_area){
      if(this.isMiddleArea(middle_area))
        this.$router.push(encodeURI(`/probability/${middle_area}`))
    },
    showChart(middle_area){
      if( !this.isMiddleArea(middle_area) ) return
      this.active_tab = 0
      const dates = this.probabilityDates
      let data = []
      let all_data = null
      for( const data of this.probabilityData ) {
        if (data.middle_area === middle_area)
          all_data = data.data
      }

      let hour = Number(this.probabilityDateTimes[0] && this.probabilityDateTimes[0].replace(/.+T(\d{2}).+/, '$1'))
      let global_index = 0
      function getDataObject(there_date){
        const result = {}
        result.x = there_date
        let flag = true
        while( flag ){
          if(hour <= 9)
            result[`hour0${hour}`]  = all_data[global_index]
          else
            result[`hour${hour}`]  = all_data[global_index]
          global_index++
          hour += 3
          if( hour === 24 ){
            hour = 0
            break
          }
        }
        return result
      }
      for( const there_date of dates ) {
        data.push(
            getDataObject(there_date)
        )
      }
      const datasets = []
      for( const hour of ['00', '03', '06', '09', '12', '15', '18', '21'] ){
        datasets.push(
            {
              label: `${hour}時`,
              data: data,
              parsing: {
                yAxisKey: `hour${hour}`
              },
              backgroundColor: 'red',
              categoryPercentage: 0.97,
              barPercentage: 0.85
            }
        )
      }
      if(chart_element !== null){
        chart_element.destroy()
        chart_element = null
      }
      const ctx = document.getElementById('myChart')
      chart_element = new Chart(
          ctx,
          {
            type: 'bar',
            options: {
              plugins: {
                title: {
                  display: true,
                  text: middle_area,
                  font: {
                    size: 16,
                    weight: 'normal'
                  }
                },
                legend: {
                  display: false
                }
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: ['予想日時', '0時から始まり3時間毎']
                  }
                },
                y: {
                  min: 0,
                  max: 100,
                  title: {
                    display: true,
                    text: '暴風域に入る確率 (%)'
                  }
                }
              }
            },
            data: {
              datasets: datasets
            },
          }
      )
    }
  },
  created() {
  },
  mounted() {
    if( this.$route.params && this.$route.params.middle_area )
      this.showChart( decodeURI(this.$route.params.middle_area) )
    else
      this.showChart('南部')
  },
  watch: {
    $route(to) {
      let path = ''
      path = to && to.path && decodeURI(to.path).replace(/[/a-z]+(.+)/, '$1')
      this.showChart(path)
    }
  }

}
</script>
