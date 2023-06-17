import {createStore} from 'vuex'

const target_big_areas = [
    '沖縄本島地方',
    '宮古島地方',
    '八重山地方',
    '大東島地方'
]

function checkOverlapForObject(array_of_objects, property_name, property_value) {
   for( const object of array_of_objects )
       if( object[property_name] === property_value )
           return false
   return true
}

function checkOverlapForArray( array, value ){
    for( const item of array ){
        if( item === value )
            return false
    }
    return true
}

function addDataForProbability( array_of_data, big_area, middle_area, another_inner_data ){
    let result = false
    for( const data of array_of_data ){
        if( data.big_area === big_area && data.middle_area === middle_area ) {
            data.data.push( another_inner_data )
            result = true
        }
    }
    return result
}

export default createStore({
    state: {
        warnings_data: [
            //この形でデータを入れていきます。
            // {
            //     area: '',
            //     warnings: []
            // }
        ],
        probability_date_times: [
            //'2021-03-19T16:55:00+09:00'
        ],
        probability_areas: [
            //
            //{
            //     big_area: '',
            //     middle_area: ''
            //}
        ],
        probability_data: [
            // {
            //     big_area: '',
            //     middle_area: '',
            //     data: []
            // }
        ]

    },
    getters: {
        targetBigAreas() {
            return target_big_areas
        },
        warningsInArea: state => area => {
            for (const data of state.warnings_data)
                if (data.area === area) {
                    return data.warnings
                }
            return null
        },
        probabilityDateTimes(state){
            return state.probability_date_times
        },
        probabilityAreas(state){
            return state.probability_areas
        },
        probabilityData(state){
            return state.probability_data
        }
    },
    mutations: {
        addProbabilityDateTime(state, date_time){
            if( checkOverlapForArray( state.probability_date_times, date_time ) )
                state.probability_date_times.push( date_time )
        },
        addProbabilityArea(state, payload){
            if( checkOverlapForObject(state.probability_areas, 'middle_area', payload.middle_area) )
                state.probability_areas.push(
                    {
                        big_area: payload.big_area,
                        middle_area: payload.middle_area
                    }
                )
        },
        addProbability(state, payload){
            if( !addDataForProbability( state.probability_data, payload.big_area, payload.middle_area, payload.data ) ) {
                state.probability_data.push(
                    {
                        big_area: payload.big_area,
                        middle_area: payload.middle_area,
                        data: [payload.data]
                    }
                )
            }
        },
    },
    actions: {
        getProbabilityXML({commit}){
            const text = probability_data
            const xml = (new DOMParser()).parseFromString(text, 'text/xml')
            const date_times = xml.querySelectorAll('TimeDefines>TimeDefine>DateTime')
            for( const date_time of date_times )
                commit("addProbabilityDateTime", date_time.innerHTML)
            const items = xml.querySelectorAll('TimeSeriesInfo>Item')
            for( const item of items ){
                const prefecture = item.querySelector('Area>Prefecture').innerHTML
                if(target_big_areas.includes(prefecture)) {
                    const name = item.querySelector('Area>Name').innerHTML
                    commit("addProbabilityArea", {big_area: prefecture, middle_area: name})
                    const all_data = item.querySelectorAll('FiftyKtWindProbability[refID]')
                    for(const data of all_data){
                        commit(
                            "addProbability",
                            {
                                big_area: prefecture,
                                middle_area: name,
                                data: data.innerHTML
                            }
                        )
                    }

                }
            }
        },
    },
    modules: {}
})

let probability_data =
`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<Report xmlns="http://xml.kishou.go.jp/jmaxml1/" xmlns:jmx="http://xml.kishou.go.jp/jmaxml1/">
<Control>
<Title>台風の暴風域に入る確率</Title>
<DateTime>2021-03-19T07:54:29Z</DateTime>
<Status>通常</Status>
<EditorialOffice>気象庁本庁</EditorialOffice>
<PublishingOffice>気象庁</PublishingOffice>
</Control>
<Head xmlns="http://xml.kishou.go.jp/jmaxml1/informationBasis1/">
<Title>台風の暴風域に入る確率</Title>
<ReportDateTime>2021-03-19T16:55:00+09:00</ReportDateTime>
<TargetDateTime>2020-09-30T15:00:00+09:00</TargetDateTime>
<TargetDuration>PT120H</TargetDuration>
<EventID>TC2001</EventID>
<InfoType>発表</InfoType>
<Serial>13</Serial>
<InfoKind>台風の暴風域に入る確率</InfoKind>
<InfoKindVersion>1.4_0</InfoKindVersion>
<Headline>
<Text/>
</Headline>
</Head>
<Body xmlns="http://xml.kishou.go.jp/jmaxml1/body/meteorology1/" xmlns:jmx_eb="http://xml.kishou.go.jp/jmaxml1/elementBasis1/">
<MeteorologicalInfos type="台風情報">
<MeteorologicalInfo type="台風呼称">
<DateTime>2020-09-30T15:00:00+09:00</DateTime>
<Item>
<Kind>
<Property>
<Type>呼称</Type>
<TyphoonNamePart>
<Name>DAMREY</Name>
<NameKana>ダムレイ</NameKana>
<Number>2001</Number>
</TyphoonNamePart>
</Property>
</Kind>
</Item>
</MeteorologicalInfo>
<TimeSeriesInfo>
<TimeDefines>
<TimeDefine timeId="1">
<DateTime>2020-09-30T15:00:00+09:00</DateTime>
<Duration>PT3H</Duration>
</TimeDefine>
<TimeDefine timeId="2">
<DateTime>2020-09-30T18:00:00+09:00</DateTime>
<Duration>PT3H</Duration>
</TimeDefine>
<TimeDefine timeId="3">
<DateTime>2020-09-30T21:00:00+09:00</DateTime>
<Duration>PT3H</Duration>
</TimeDefine>
<TimeDefine timeId="4">
<DateTime>2020-10-01T00:00:00+09:00</DateTime>
<Duration>PT3H</Duration>
</TimeDefine>
<TimeDefine timeId="5">
<DateTime>2020-10-01T03:00:00+09:00</DateTime>
<Duration>PT3H</Duration>
</TimeDefine>
<TimeDefine timeId="6">
<DateTime>2020-10-01T06:00:00+09:00</DateTime>
<Duration>PT3H</Duration>
</TimeDefine>
<TimeDefine timeId="7">
<DateTime>2020-10-01T09:00:00+09:00</DateTime>
<Duration>PT3H</Duration>
</TimeDefine>
<TimeDefine timeId="8">
<DateTime>2020-10-01T12:00:00+09:00</DateTime>
<Duration>PT3H</Duration>
</TimeDefine>
<TimeDefine timeId="9">
<DateTime>2020-10-01T15:00:00+09:00</DateTime>
<Duration>PT3H</Duration>
</TimeDefine>
<TimeDefine timeId="10">
<DateTime>2020-10-01T18:00:00+09:00</DateTime>
<Duration>PT3H</Duration>
</TimeDefine>
<TimeDefine timeId="11">
<DateTime>2020-10-01T21:00:00+09:00</DateTime>
<Duration>PT3H</Duration>
</TimeDefine>
<TimeDefine timeId="12">
<DateTime>2020-10-02T00:00:00+09:00</DateTime>
<Duration>PT3H</Duration>
</TimeDefine>
<TimeDefine timeId="13">
<DateTime>2020-10-02T03:00:00+09:00</DateTime>
<Duration>PT3H</Duration>
</TimeDefine>
<TimeDefine timeId="14">
<DateTime>2020-10-02T06:00:00+09:00</DateTime>
<Duration>PT3H</Duration>
</TimeDefine>
<TimeDefine timeId="15">
<DateTime>2020-10-02T09:00:00+09:00</DateTime>
<Duration>PT3H</Duration>
</TimeDefine>
<TimeDefine timeId="16">
<DateTime>2020-10-02T12:00:00+09:00</DateTime>
<Duration>PT3H</Duration>
</TimeDefine>
<TimeDefine timeId="17">
<DateTime>2020-10-02T15:00:00+09:00</DateTime>
<Duration>PT3H</Duration>
</TimeDefine>
<TimeDefine timeId="18">
<DateTime>2020-10-02T18:00:00+09:00</DateTime>
<Duration>PT3H</Duration>
</TimeDefine>
<TimeDefine timeId="19">
<DateTime>2020-10-02T21:00:00+09:00</DateTime>
<Duration>PT3H</Duration>
</TimeDefine>
<TimeDefine timeId="20">
<DateTime>2020-10-03T00:00:00+09:00</DateTime>
<Duration>PT3H</Duration>
</TimeDefine>
<TimeDefine timeId="21">
<DateTime>2020-10-03T03:00:00+09:00</DateTime>
<Duration>PT3H</Duration>
</TimeDefine>
<TimeDefine timeId="22">
<DateTime>2020-10-03T06:00:00+09:00</DateTime>
<Duration>PT3H</Duration>
</TimeDefine>
<TimeDefine timeId="23">
<DateTime>2020-10-03T09:00:00+09:00</DateTime>
<Duration>PT3H</Duration>
</TimeDefine>
<TimeDefine timeId="24">
<DateTime>2020-10-03T12:00:00+09:00</DateTime>
<Duration>PT3H</Duration>
</TimeDefine>
<TimeDefine timeId="25">
<DateTime>2020-10-03T15:00:00+09:00</DateTime>
<Duration>PT3H</Duration>
</TimeDefine>
<TimeDefine timeId="26">
<DateTime>2020-10-03T18:00:00+09:00</DateTime>
<Duration>PT3H</Duration>
</TimeDefine>
<TimeDefine timeId="27">
<DateTime>2020-10-03T21:00:00+09:00</DateTime>
<Duration>PT3H</Duration>
</TimeDefine>
<TimeDefine timeId="28">
<DateTime>2020-10-04T00:00:00+09:00</DateTime>
<Duration>PT3H</Duration>
</TimeDefine>
<TimeDefine timeId="29">
<DateTime>2020-10-04T03:00:00+09:00</DateTime>
<Duration>PT3H</Duration>
</TimeDefine>
<TimeDefine timeId="30">
<DateTime>2020-10-04T06:00:00+09:00</DateTime>
<Duration>PT3H</Duration>
</TimeDefine>
<TimeDefine timeId="31">
<DateTime>2020-10-04T09:00:00+09:00</DateTime>
<Duration>PT3H</Duration>
</TimeDefine>
<TimeDefine timeId="32">
<DateTime>2020-10-04T12:00:00+09:00</DateTime>
<Duration>PT3H</Duration>
</TimeDefine>
<TimeDefine timeId="33">
<DateTime>2020-10-04T15:00:00+09:00</DateTime>
<Duration>PT3H</Duration>
</TimeDefine>
<TimeDefine timeId="34">
<DateTime>2020-10-04T18:00:00+09:00</DateTime>
<Duration>PT3H</Duration>
</TimeDefine>
<TimeDefine timeId="35">
<DateTime>2020-10-04T21:00:00+09:00</DateTime>
<Duration>PT3H</Duration>
</TimeDefine>
<TimeDefine timeId="36">
<DateTime>2020-10-05T00:00:00+09:00</DateTime>
<Duration>PT3H</Duration>
</TimeDefine>
<TimeDefine timeId="37">
<DateTime>2020-10-05T03:00:00+09:00</DateTime>
<Duration>PT3H</Duration>
</TimeDefine>
<TimeDefine timeId="38">
<DateTime>2020-10-05T06:00:00+09:00</DateTime>
<Duration>PT3H</Duration>
</TimeDefine>
<TimeDefine timeId="39">
<DateTime>2020-10-05T09:00:00+09:00</DateTime>
<Duration>PT3H</Duration>
</TimeDefine>
<TimeDefine timeId="40">
<DateTime>2020-10-05T12:00:00+09:00</DateTime>
<Duration>PT3H</Duration>
</TimeDefine>
</TimeDefines>
<Item>
<Kind>
<Property>
<Type>台風の暴風域に入る確率</Type>
<FiftyKtWindProbabilityPart>
<FiftyKtWindProbability refID="1" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="2" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="3" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="4" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="5" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="6" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="7" unit="%">1</FiftyKtWindProbability>
<FiftyKtWindProbability refID="8" unit="%">71</FiftyKtWindProbability>
<FiftyKtWindProbability refID="9" unit="%">92</FiftyKtWindProbability>
<FiftyKtWindProbability refID="10" unit="%">97</FiftyKtWindProbability>
<FiftyKtWindProbability refID="11" unit="%">97</FiftyKtWindProbability>
<FiftyKtWindProbability refID="12" unit="%">97</FiftyKtWindProbability>
<FiftyKtWindProbability refID="13" unit="%">92</FiftyKtWindProbability>
<FiftyKtWindProbability refID="14" unit="%">78</FiftyKtWindProbability>
<FiftyKtWindProbability refID="15" unit="%">50</FiftyKtWindProbability>
<FiftyKtWindProbability refID="16" unit="%">22</FiftyKtWindProbability>
<FiftyKtWindProbability refID="17" unit="%">7</FiftyKtWindProbability>
<FiftyKtWindProbability refID="18" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="19" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="20" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="21" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="22" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="23" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="24" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="25" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="26" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="27" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="28" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="29" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="30" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="31" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="32" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="33" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="34" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="35" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="36" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="37" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="38" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="39" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="40" unit="%">0</FiftyKtWindProbability>
</FiftyKtWindProbabilityPart>
</Property>
</Kind>
<Area>
<Name>南部</Name>
<Code>471011</Code>
<Prefecture>沖縄本島地方</Prefecture>
<PrefectureCode>471000</PrefectureCode>
</Area>
</Item>
<Item>
<Kind>
<Property>
<Type>台風の暴風域に入る確率</Type>
<FiftyKtWindProbabilityPart>
<FiftyKtWindProbability refID="1" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="2" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="3" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="4" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="5" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="6" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="7" unit="%">1</FiftyKtWindProbability>
<FiftyKtWindProbability refID="8" unit="%">71</FiftyKtWindProbability>
<FiftyKtWindProbability refID="9" unit="%">92</FiftyKtWindProbability>
<FiftyKtWindProbability refID="10" unit="%">97</FiftyKtWindProbability>
<FiftyKtWindProbability refID="11" unit="%">98</FiftyKtWindProbability>
<FiftyKtWindProbability refID="12" unit="%">97</FiftyKtWindProbability>
<FiftyKtWindProbability refID="13" unit="%">95</FiftyKtWindProbability>
<FiftyKtWindProbability refID="14" unit="%">85</FiftyKtWindProbability>
<FiftyKtWindProbability refID="15" unit="%">61</FiftyKtWindProbability>
<FiftyKtWindProbability refID="16" unit="%">31</FiftyKtWindProbability>
<FiftyKtWindProbability refID="17" unit="%">11</FiftyKtWindProbability>
<FiftyKtWindProbability refID="18" unit="%">1</FiftyKtWindProbability>
<FiftyKtWindProbability refID="19" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="20" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="21" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="22" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="23" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="24" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="25" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="26" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="27" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="28" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="29" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="30" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="31" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="32" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="33" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="34" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="35" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="36" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="37" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="38" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="39" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="40" unit="%">0</FiftyKtWindProbability>
</FiftyKtWindProbabilityPart>
</Property>
</Kind>
<Area>
<Name>中部</Name>
<Code>471012</Code>
<Prefecture>沖縄本島地方</Prefecture>
<PrefectureCode>471000</PrefectureCode>
</Area>
</Item>
<Item>
<Kind>
<Property>
<Type>台風の暴風域に入る確率</Type>
<FiftyKtWindProbabilityPart>
<FiftyKtWindProbability refID="1" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="2" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="3" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="4" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="5" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="6" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="7" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="8" unit="%">28</FiftyKtWindProbability>
<FiftyKtWindProbability refID="9" unit="%">64</FiftyKtWindProbability>
<FiftyKtWindProbability refID="10" unit="%">82</FiftyKtWindProbability>
<FiftyKtWindProbability refID="11" unit="%">86</FiftyKtWindProbability>
<FiftyKtWindProbability refID="12" unit="%">86</FiftyKtWindProbability>
<FiftyKtWindProbability refID="13" unit="%">82</FiftyKtWindProbability>
<FiftyKtWindProbability refID="14" unit="%">72</FiftyKtWindProbability>
<FiftyKtWindProbability refID="15" unit="%">54</FiftyKtWindProbability>
<FiftyKtWindProbability refID="16" unit="%">31</FiftyKtWindProbability>
<FiftyKtWindProbability refID="17" unit="%">12</FiftyKtWindProbability>
<FiftyKtWindProbability refID="18" unit="%">1</FiftyKtWindProbability>
<FiftyKtWindProbability refID="19" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="20" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="21" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="22" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="23" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="24" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="25" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="26" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="27" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="28" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="29" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="30" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="31" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="32" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="33" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="34" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="35" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="36" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="37" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="38" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="39" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="40" unit="%">0</FiftyKtWindProbability>
</FiftyKtWindProbabilityPart>
</Property>
</Kind>
<Area>
<Name>慶良間・粟国諸島</Name>
<Code>471013</Code>
<Prefecture>沖縄本島地方</Prefecture>
<PrefectureCode>471000</PrefectureCode>
</Area>
</Item>
<Item>
<Kind>
<Property>
<Type>台風の暴風域に入る確率</Type>
<FiftyKtWindProbabilityPart>
<FiftyKtWindProbability refID="1" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="2" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="3" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="4" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="5" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="6" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="7" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="8" unit="%">48</FiftyKtWindProbability>
<FiftyKtWindProbability refID="9" unit="%">86</FiftyKtWindProbability>
<FiftyKtWindProbability refID="10" unit="%">96</FiftyKtWindProbability>
<FiftyKtWindProbability refID="11" unit="%">98</FiftyKtWindProbability>
<FiftyKtWindProbability refID="12" unit="%">99</FiftyKtWindProbability>
<FiftyKtWindProbability refID="13" unit="%">98</FiftyKtWindProbability>
<FiftyKtWindProbability refID="14" unit="%">96</FiftyKtWindProbability>
<FiftyKtWindProbability refID="15" unit="%">85</FiftyKtWindProbability>
<FiftyKtWindProbability refID="16" unit="%">60</FiftyKtWindProbability>
<FiftyKtWindProbability refID="17" unit="%">29</FiftyKtWindProbability>
<FiftyKtWindProbability refID="18" unit="%">4</FiftyKtWindProbability>
<FiftyKtWindProbability refID="19" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="20" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="21" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="22" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="23" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="24" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="25" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="26" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="27" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="28" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="29" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="30" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="31" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="32" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="33" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="34" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="35" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="36" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="37" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="38" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="39" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="40" unit="%">0</FiftyKtWindProbability>
</FiftyKtWindProbabilityPart>
</Property>
</Kind>
<Area>
<Name>伊是名・伊平屋</Name>
<Code>471021</Code>
<Prefecture>沖縄本島地方</Prefecture>
<PrefectureCode>471000</PrefectureCode>
</Area>
</Item>
<Item>
<Kind>
<Property>
<Type>台風の暴風域に入る確率</Type>
<FiftyKtWindProbabilityPart>
<FiftyKtWindProbability refID="1" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="2" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="3" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="4" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="5" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="6" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="7" unit="%">1</FiftyKtWindProbability>
<FiftyKtWindProbability refID="8" unit="%">76</FiftyKtWindProbability>
<FiftyKtWindProbability refID="9" unit="%">96</FiftyKtWindProbability>
<FiftyKtWindProbability refID="10" unit="%">99</FiftyKtWindProbability>
<FiftyKtWindProbability refID="11" unit="%">99</FiftyKtWindProbability>
<FiftyKtWindProbability refID="12" unit="%">99</FiftyKtWindProbability>
<FiftyKtWindProbability refID="13" unit="%">99</FiftyKtWindProbability>
<FiftyKtWindProbability refID="14" unit="%">96</FiftyKtWindProbability>
<FiftyKtWindProbability refID="15" unit="%">82</FiftyKtWindProbability>
<FiftyKtWindProbability refID="16" unit="%">52</FiftyKtWindProbability>
<FiftyKtWindProbability refID="17" unit="%">23</FiftyKtWindProbability>
<FiftyKtWindProbability refID="18" unit="%">2</FiftyKtWindProbability>
<FiftyKtWindProbability refID="19" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="20" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="21" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="22" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="23" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="24" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="25" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="26" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="27" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="28" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="29" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="30" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="31" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="32" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="33" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="34" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="35" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="36" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="37" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="38" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="39" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="40" unit="%">0</FiftyKtWindProbability>
</FiftyKtWindProbabilityPart>
</Property>
</Kind>
<Area>
<Name>国頭地区</Name>
<Code>471022</Code>
<Prefecture>沖縄本島地方</Prefecture>
<PrefectureCode>471000</PrefectureCode>
</Area>
</Item>
<Item>
<Kind>
<Property>
<Type>台風の暴風域に入る確率</Type>
<FiftyKtWindProbabilityPart>
<FiftyKtWindProbability refID="1" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="2" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="3" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="4" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="5" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="6" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="7" unit="%">1</FiftyKtWindProbability>
<FiftyKtWindProbability refID="8" unit="%">76</FiftyKtWindProbability>
<FiftyKtWindProbability refID="9" unit="%">96</FiftyKtWindProbability>
<FiftyKtWindProbability refID="10" unit="%">99</FiftyKtWindProbability>
<FiftyKtWindProbability refID="11" unit="%">99</FiftyKtWindProbability>
<FiftyKtWindProbability refID="12" unit="%">99</FiftyKtWindProbability>
<FiftyKtWindProbability refID="13" unit="%">98</FiftyKtWindProbability>
<FiftyKtWindProbability refID="14" unit="%">94</FiftyKtWindProbability>
<FiftyKtWindProbability refID="15" unit="%">79</FiftyKtWindProbability>
<FiftyKtWindProbability refID="16" unit="%">50</FiftyKtWindProbability>
<FiftyKtWindProbability refID="17" unit="%">22</FiftyKtWindProbability>
<FiftyKtWindProbability refID="18" unit="%">2</FiftyKtWindProbability>
<FiftyKtWindProbability refID="19" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="20" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="21" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="22" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="23" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="24" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="25" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="26" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="27" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="28" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="29" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="30" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="31" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="32" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="33" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="34" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="35" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="36" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="37" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="38" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="39" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="40" unit="%">0</FiftyKtWindProbability>
</FiftyKtWindProbabilityPart>
</Property>
</Kind>
<Area>
<Name>名護地区</Name>
<Code>471023</Code>
<Prefecture>沖縄本島地方</Prefecture>
<PrefectureCode>471000</PrefectureCode>
</Area>
</Item>
<Item>
<Kind>
<Property>
<Type>台風の暴風域に入る確率</Type>
<FiftyKtWindProbabilityPart>
<FiftyKtWindProbability refID="1" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="2" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="3" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="4" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="5" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="6" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="7" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="8" unit="%">65</FiftyKtWindProbability>
<FiftyKtWindProbability refID="9" unit="%">91</FiftyKtWindProbability>
<FiftyKtWindProbability refID="10" unit="%">97</FiftyKtWindProbability>
<FiftyKtWindProbability refID="11" unit="%">98</FiftyKtWindProbability>
<FiftyKtWindProbability refID="12" unit="%">98</FiftyKtWindProbability>
<FiftyKtWindProbability refID="13" unit="%">97</FiftyKtWindProbability>
<FiftyKtWindProbability refID="14" unit="%">90</FiftyKtWindProbability>
<FiftyKtWindProbability refID="15" unit="%">70</FiftyKtWindProbability>
<FiftyKtWindProbability refID="16" unit="%">40</FiftyKtWindProbability>
<FiftyKtWindProbability refID="17" unit="%">15</FiftyKtWindProbability>
<FiftyKtWindProbability refID="18" unit="%">1</FiftyKtWindProbability>
<FiftyKtWindProbability refID="19" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="20" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="21" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="22" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="23" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="24" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="25" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="26" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="27" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="28" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="29" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="30" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="31" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="32" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="33" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="34" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="35" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="36" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="37" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="38" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="39" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="40" unit="%">0</FiftyKtWindProbability>
</FiftyKtWindProbabilityPart>
</Property>
</Kind>
<Area>
<Name>恩納・金武地区</Name>
<Code>471024</Code>
<Prefecture>沖縄本島地方</Prefecture>
<PrefectureCode>471000</PrefectureCode>
</Area>
</Item>
<Item>
<Kind>
<Property>
<Type>台風の暴風域に入る確率</Type>
<FiftyKtWindProbabilityPart>
<FiftyKtWindProbability refID="1" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="2" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="3" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="4" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="5" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="6" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="7" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="8" unit="%">1</FiftyKtWindProbability>
<FiftyKtWindProbability refID="9" unit="%">12</FiftyKtWindProbability>
<FiftyKtWindProbability refID="10" unit="%">33</FiftyKtWindProbability>
<FiftyKtWindProbability refID="11" unit="%">49</FiftyKtWindProbability>
<FiftyKtWindProbability refID="12" unit="%">54</FiftyKtWindProbability>
<FiftyKtWindProbability refID="13" unit="%">53</FiftyKtWindProbability>
<FiftyKtWindProbability refID="14" unit="%">45</FiftyKtWindProbability>
<FiftyKtWindProbability refID="15" unit="%">31</FiftyKtWindProbability>
<FiftyKtWindProbability refID="16" unit="%">16</FiftyKtWindProbability>
<FiftyKtWindProbability refID="17" unit="%">6</FiftyKtWindProbability>
<FiftyKtWindProbability refID="18" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="19" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="20" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="21" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="22" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="23" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="24" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="25" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="26" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="27" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="28" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="29" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="30" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="31" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="32" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="33" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="34" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="35" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="36" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="37" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="38" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="39" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="40" unit="%">0</FiftyKtWindProbability>
</FiftyKtWindProbabilityPart>
</Property>
</Kind>
<Area>
<Name>久米島</Name>
<Code>471030</Code>
<Prefecture>沖縄本島地方</Prefecture>
<PrefectureCode>471000</PrefectureCode>
</Area>
</Item>
<Item>
<Kind>
<Property>
<Type>台風の暴風域に入る確率</Type>
<FiftyKtWindProbabilityPart>
<FiftyKtWindProbability refID="1" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="2" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="3" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="4" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="5" unit="%">8</FiftyKtWindProbability>
<FiftyKtWindProbability refID="6" unit="%">94</FiftyKtWindProbability>
<FiftyKtWindProbability refID="7" unit="%">100</FiftyKtWindProbability>
<FiftyKtWindProbability refID="8" unit="%">100</FiftyKtWindProbability>
<FiftyKtWindProbability refID="9" unit="%">100</FiftyKtWindProbability>
<FiftyKtWindProbability refID="10" unit="%">100</FiftyKtWindProbability>
<FiftyKtWindProbability refID="11" unit="%">100</FiftyKtWindProbability>
<FiftyKtWindProbability refID="12" unit="%">100</FiftyKtWindProbability>
<FiftyKtWindProbability refID="13" unit="%">94</FiftyKtWindProbability>
<FiftyKtWindProbability refID="14" unit="%">59</FiftyKtWindProbability>
<FiftyKtWindProbability refID="15" unit="%">19</FiftyKtWindProbability>
<FiftyKtWindProbability refID="16" unit="%">3</FiftyKtWindProbability>
<FiftyKtWindProbability refID="17" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="18" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="19" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="20" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="21" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="22" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="23" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="24" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="25" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="26" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="27" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="28" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="29" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="30" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="31" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="32" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="33" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="34" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="35" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="36" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="37" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="38" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="39" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="40" unit="%">0</FiftyKtWindProbability>
</FiftyKtWindProbabilityPart>
</Property>
</Kind>
<Area>
<Name>大東島地方</Name>
<Code>472000</Code>
<Prefecture>大東島地方</Prefecture>
<PrefectureCode>472000</PrefectureCode>
</Area>
</Item>
<Item>
<Kind>
<Property>
<Type>台風の暴風域に入る確率</Type>
<FiftyKtWindProbabilityPart>
<FiftyKtWindProbability refID="1" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="2" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="3" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="4" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="5" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="6" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="7" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="8" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="9" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="10" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="11" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="12" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="13" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="14" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="15" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="16" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="17" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="18" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="19" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="20" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="21" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="22" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="23" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="24" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="25" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="26" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="27" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="28" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="29" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="30" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="31" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="32" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="33" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="34" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="35" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="36" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="37" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="38" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="39" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="40" unit="%">0</FiftyKtWindProbability>
</FiftyKtWindProbabilityPart>
</Property>
</Kind>
<Area>
<Name>宮古島</Name>
<Code>473001</Code>
<Prefecture>宮古島地方</Prefecture>
<PrefectureCode>473000</PrefectureCode>
</Area>
</Item>
<Item>
<Kind>
<Property>
<Type>台風の暴風域に入る確率</Type>
<FiftyKtWindProbabilityPart>
<FiftyKtWindProbability refID="1" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="2" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="3" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="4" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="5" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="6" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="7" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="8" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="9" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="10" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="11" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="12" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="13" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="14" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="15" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="16" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="17" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="18" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="19" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="20" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="21" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="22" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="23" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="24" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="25" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="26" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="27" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="28" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="29" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="30" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="31" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="32" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="33" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="34" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="35" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="36" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="37" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="38" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="39" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="40" unit="%">0</FiftyKtWindProbability>
</FiftyKtWindProbabilityPart>
</Property>
</Kind>
<Area>
<Name>多良間島</Name>
<Code>473002</Code>
<Prefecture>宮古島地方</Prefecture>
<PrefectureCode>473000</PrefectureCode>
</Area>
</Item>
<Item>
<Kind>
<Property>
<Type>台風の暴風域に入る確率</Type>
<FiftyKtWindProbabilityPart>
<FiftyKtWindProbability refID="1" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="2" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="3" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="4" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="5" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="6" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="7" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="8" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="9" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="10" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="11" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="12" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="13" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="14" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="15" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="16" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="17" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="18" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="19" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="20" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="21" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="22" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="23" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="24" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="25" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="26" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="27" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="28" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="29" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="30" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="31" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="32" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="33" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="34" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="35" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="36" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="37" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="38" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="39" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="40" unit="%">0</FiftyKtWindProbability>
</FiftyKtWindProbabilityPart>
</Property>
</Kind>
<Area>
<Name>石垣市</Name>
<Code>474011</Code>
<Prefecture>八重山地方</Prefecture>
<PrefectureCode>474000</PrefectureCode>
</Area>
</Item>
<Item>
<Kind>
<Property>
<Type>台風の暴風域に入る確率</Type>
<FiftyKtWindProbabilityPart>
<FiftyKtWindProbability refID="1" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="2" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="3" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="4" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="5" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="6" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="7" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="8" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="9" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="10" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="11" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="12" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="13" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="14" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="15" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="16" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="17" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="18" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="19" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="20" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="21" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="22" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="23" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="24" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="25" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="26" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="27" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="28" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="29" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="30" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="31" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="32" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="33" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="34" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="35" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="36" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="37" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="38" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="39" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="40" unit="%">0</FiftyKtWindProbability>
</FiftyKtWindProbabilityPart>
</Property>
</Kind>
<Area>
<Name>竹富町</Name>
<Code>474012</Code>
<Prefecture>八重山地方</Prefecture>
<PrefectureCode>474000</PrefectureCode>
</Area>
</Item>
<Item>
<Kind>
<Property>
<Type>台風の暴風域に入る確率</Type>
<FiftyKtWindProbabilityPart>
<FiftyKtWindProbability refID="1" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="2" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="3" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="4" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="5" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="6" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="7" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="8" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="9" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="10" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="11" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="12" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="13" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="14" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="15" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="16" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="17" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="18" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="19" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="20" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="21" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="22" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="23" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="24" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="25" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="26" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="27" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="28" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="29" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="30" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="31" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="32" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="33" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="34" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="35" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="36" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="37" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="38" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="39" unit="%">0</FiftyKtWindProbability>
<FiftyKtWindProbability refID="40" unit="%">0</FiftyKtWindProbability>
</FiftyKtWindProbabilityPart>
</Property>
</Kind>
<Area>
<Name>与那国島地方</Name>
<Code>474020</Code>
<Prefecture>八重山地方</Prefecture>
<PrefectureCode>474000</PrefectureCode>
</Area>
</Item>
</TimeSeriesInfo>
</MeteorologicalInfos>
</Body>
</Report>`