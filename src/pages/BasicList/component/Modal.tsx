import React, { useEffect } from 'react'
import {Form, Modal as AntdModal} from 'antd'
import {useRequest} from 'umi'
import FormBuild from '../build/FormBuild'
import ActionsBuild from '../build/ActionBuild';

interface IProps {
  modalVisible: boolean
  modalUrl: string
  hideModal: () => void
}
const layout = {
  labelCol: { span: 6},
  wrapperCol: { span: 18 },
};
const Modal: React.FC<IProps> = ({modalVisible,modalUrl,hideModal}) => {
  const init = useRequest<{data: PageApi.Data}>(`${modalUrl}`)

  useEffect(() => {
    if(modalVisible){
      init.run()
    }

  }, [modalVisible])
  return (
    <AntdModal
    title={init?.data?.page?.title}
    visible={modalVisible}
    // onOk={handleOk}
    onCancel={hideModal}
    footer={ActionsBuild(init?.data?.layout?.actions[0]?.data)}
    >
    <Form {...layout} >
    {FormBuild(init?.data?.layout?.tabs[0]?.data)}
    </Form>
    </AntdModal>
  )
}

export default Modal
