import moment from "moment"

export const submitFieldsAdaptor = (data: any) => {
  const result = data
  Object.keys(data).forEach(item => {
    if(moment.isMoment(data[item])){
      result[item]  = moment(data[item]).format()
    }
  })
  return result
}

export const setFieldsAdaptor = (data: BasicListApi.PageData) => {
  if(data?.layout?.tabs && data?.dataSource){
    const result = {}
    // 不需要返回值使用foreach遍历
    data.layout.tabs.forEach((tab)=> {
      tab.data.forEach(field=> {

        switch (field.type) {
          case 'datetime':
            result[field.key] = moment(data.dataSource[field.key])
            break;
          default:
            result[field.key] = data.dataSource[field.key]
            break;
        }

      })
    })
    return result
  }
  return {}
}
