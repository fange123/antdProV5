import React, { useEffect } from 'react'
import {Form, message, Modal as AntdModal} from 'antd'
import {useRequest} from 'umi'
import FormBuild from '../build/FormBuild'
import ActionsBuild from '../build/ActionBuild';
import moment from 'moment';
import { setFieldsAdaptor, submitFieldsAdaptor } from '../helper';

interface IProps {
  modalVisible: boolean
  modalUrl: string
  hideModal: (reload?: boolean) => void
}
const layout = {
  labelCol: { span: 6},
  wrapperCol: { span: 18 },
};
const Modal: React.FC<IProps> = ({modalVisible,modalUrl,hideModal}) => {
  const init = useRequest<{data: BasicListApi.PageData}>(`https://public-api-v2.aspirantzhang.com${modalUrl}?X-API-KEY=antd`,
  {
    manual:true,// 手动发请求
    onError:()=> {
      hideModal()

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
      hideModal(true)
    },
    formatResult:(res)=> {
      return res
    }
  });
  const [form] = Form.useForm();



  // 清除表单的数据方法：
  // 1.在请求前清除表单数据
  // 2.在弹窗关闭后清除表单
  useEffect(() => {
    if(modalVisible){
      // TODO:方法1
      // form.resetFields()
      init.run()
    }
    // TODO:方法2
    if(!modalVisible){
      form.resetFields()

    }

  }, [modalVisible])



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
        hideModal(false)
        break;
      case 'reset':
       form.resetFields()
        break;

      default:
        break;
    }
  }
  return (
    <AntdModal
    title={init?.data?.page?.title}
    visible={modalVisible}

    // onOk={()=>handleOk}
    onCancel={()=> {
      hideModal()
    }}
    footer={ActionsBuild(init?.data?.layout?.actions[0]?.data,actionHandler,request.loading)}
    // TODO: 点击遮罩层不能关闭弹框
    maskClosable={false}
    forceRender
    >
    <Form {...layout} form = {form} initialValues={
      {
        create_time:moment(),
        update_time:moment(),
        status:true
      }
    }
    onFinish={onFinish}
    >
    {FormBuild(init?.data?.layout?.tabs[0]?.data)}
    </Form>
    </AntdModal>
  )
}

export default Modal
