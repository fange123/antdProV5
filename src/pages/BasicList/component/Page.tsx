import React, { useEffect } from 'react'
import {Card, Col, Form, message, Row,Space,Spin,Tabs} from 'antd'
import {useRequest,useLocation,history} from 'umi'
import { PageContainer ,FooterToolbar} from '@ant-design/pro-layout';
import FormBuild from '../build/FormBuild'
import ActionsBuild from '../build/ActionBuild';
import moment from 'moment';
import { setFieldsAdaptor, submitFieldsAdaptor } from '../helper';
import styles from '../index.less'

interface IProps {
  modalVisible: boolean
  modalUrl: string
  hideModal: (reload?: boolean) => void
}
const layout = {
  labelCol: { span: 4},
  wrapperCol: { span: 20 },
};
const { TabPane } = Tabs;
const Page: React.FC<IProps> = () => {
  const [form] = Form.useForm();
  const location = useLocation()
  const init = useRequest<{data: BasicListApi.PageData}>(`https://public-api-v2.aspirantzhang.com${location.pathname.replace('/basic-list','')}?X-API-KEY=antd`,
  {
    // manual:true,// 手动发请求
    onError:()=> {
      history.go(-1)
      // history.goBack()

    }
  })

  const request = useRequest((value) => {
    message.loading({
      content: 'loading。。。',
      key:'process',
      duration:0
    })
    const {uri,method,...formValue} = value
    return{
      url: `https://public-api-v2.aspirantzhang.com${uri}`,
      method,
      // TODO:写data就不需要body和JSON.stringify
      data:{
        'X-API-KEY': 'antd',
        ...submitFieldsAdaptor(formValue),
      }
      // body: JSON.stringify({ formValue }),
    }
  }, {
    manual: true,
    onSuccess:(data)=> {
      message.success({
        content: data.message,
        key:'process',
        duration:20
      })
      history.goBack()
    },
    formatResult:(res)=> {
      return res
    }
  });

  // 有值了才能给表单赋值
  useEffect(() => {
    if(init.data){
      form.setFieldsValue(setFieldsAdaptor(init?.data))
    }

  }, [init.data])

  const onFinish= (action:  BasicListApi.Action) => {
    request.run(Object.assign(form.getFieldsValue(),{uri:action.uri,method:action.method}))
  }
  const actionHandler = (action:  BasicListApi.Action ) => {
    switch (action.action) {
      case 'submit':
        onFinish(action)
        break;
      case 'cancel':
        history.goBack()
        break;
      case 'reset':
       form.resetFields()
        break;

      default:
        break;
    }
  }
  return (
    <PageContainer>
      {
        init.loading ? (<Spin tip='loading'/>) : (
          <Form {...layout} form = {form} initialValues={
            {
              create_time:moment(),
              update_time:moment(),
              status:true
            }
          }
          onFinish={onFinish}
          >
          <Row gutter={24}>
            <Col span={16}>
            <Tabs  type="card" className={styles.tab_wrapper}>
             {
               init.data?.layout.tabs.map(item => {
                 return (
                  <TabPane tab={item.title} key={item.title}>
                  <Card>{
                     FormBuild(item.data)}
                  </Card>
                </TabPane>
                 )
               })
             }

            </Tabs>
            </Col>
            <Col span={8} className={styles.text_center}>
              {
                init.data?.layout.actions.map(item => {
                  return (
                    <Card key={item.title}>
                      <Space>{ActionsBuild(item.data,actionHandler) }</Space>
                    </Card>
                  )
                })
              }
            </Col>

          </Row>
          <FooterToolbar>
            { ActionsBuild(init.data?.layout?.actions[0]?.data,actionHandler)
    }
          </FooterToolbar>
          </Form>

        )
      }

    </PageContainer>
  )
}

export default Page
