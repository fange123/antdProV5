import React, { useEffect, useState } from 'react'
import {  Card, Col, message, Pagination,Modal, Row, Space, Table } from 'antd';
import { PageContainer ,FooterToolbar} from '@ant-design/pro-layout';
import styles from './index.less'
// useRequest从umi中获取接口数据的一个工具
import {useRequest} from 'umi'
import ActionsBuild from './build/ActionBuild';
import ColumnBuild from './build/ColumnBuild';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import type {  TablePaginationConfig } from 'antd/lib/table/interface';
import AntdModal from './component/Modal';



interface IProps {}
const { confirm } = Modal;


const Index: React.FC<IProps> = props => {
  const [pageQuery, setPageQuery] = useState<string>('')
  const [orders, setOrders] = useState<string>('desc')
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [selectedRows, setSelectedRows] = useState([])
  const [modalUrl, setModalUrl] = useState<string>('')
  const [column, setColumn] = useState<BasicListApi.Field[]>([])
  const init = useRequest<{data: BasicListApi.ListData}>(`https://public-api-v2.aspirantzhang.com/api/admins?X-API-KEY=antd&page=${pageQuery}&sort=create_time&order=${orders}`)
  useEffect(() => {
    init.run()
  }, [pageQuery,orders,modalVisible])
  useEffect(() => {
    if(modalUrl){
      setModalVisible(true)
    }

  }, [modalUrl])

  const paginationHandle = (page: any,perPage: any) => {
    setPageQuery(`${page}&per_page=${perPage}`)
  }
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
        ...formValue
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
    },
    formatResult:(res)=> {
      return res
    }
  });

const handleTableChange = (_: TablePaginationConfig,__: any,sorter: any) => {
  const { order, field } = sorter
  let ordering = ''
  if (field === 'create_time') {
    ordering = order === 'ascend' ? 'asc':'desc'
  }
  setOrders(ordering)
}
const batchOverview = (dataSource: BasicListApi.Field[]) => {
  const columns = ColumnBuild(init?.data?.layout?.tableColumn,actionHandler)
  const singleColumn = ()=> {
    return [columns[0],columns[1]]
  }

  return(
    <Table rowKey='id'
    size='small'
    dataSource={dataSource}
    pagination={false}
    columns={singleColumn()}/>
  )
}
function actionHandler(action: BasicListApi.Action,record: BasicListApi.Field) {

  switch (action.action) {
    case 'modal':

      setModalUrl( (action.uri || '').replace(/:\w+/g,(field)=> {
        return record[field.replace(":","")]
      }))
      break;
    case 'reload':
      init.run()
      break;
    case 'deletePermanently':
    case 'restore':
    case 'delete':
      confirm({
        title: '确定要删除一下选项吗？',
        icon: <ExclamationCircleOutlined />,
        content: batchOverview(Object.keys(record).length ? [record] : selectedRows),
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        onOk() {
          // TODO: onOk中返回一个Promise会有loading效果
          // 详见antd的Modal中的Modal.method()的api
          return request.run({
            uri:action.uri,
            method:action.method,
            type:action.action,
            ids:Object.keys(record).length ? [record.id] : selectedRows
          })
        },
        onCancel() {
          console.log('Cancel');
        },
      })

      break;

    default:
      break;
  }
}
  const beforeTableLayout = ()=> {
    return(
      <Row>
        <Col xs={24} sm={12}>...</Col>
        <Col xs={24} sm={12} className={styles.table_tool_bar}>
          <Space>
            {ActionsBuild(init?.data?.layout?.tableToolBar,actionHandler)}
          </Space>
        </Col>
      </Row>
    )
  }
  const afterTableLayout = ()=> {
    return(
      <Row>
        <Col xs={24} sm={12}>...</Col>
        <Col xs={24} sm={12} className={styles.table_tool_bar}>
          <Pagination
            showTotal={total => `Total ${total} items`}
            defaultPageSize={20}
            defaultCurrent={1}
            current={init.data?.meta?.page || 1}
            pageSize={init.data?.meta?.per_page || 10}
           total={init?.data?.meta?.total || 0}
           onChange={paginationHandle}
           onShowSizeChange={paginationHandle}

          />
        </Col>
      </Row>
    )
  }
  const searchLayout = ()=> {}
  const hideModal = (reload=false) => {
    if(reload){
      init.run()
    }
    setModalVisible(false)
    setModalUrl('')
  }
  const rowSelection = {
    selectedRowKeys,
    onChange:(_selectedRowKeys: any, _selectedRows: any)=> {
      setSelectedRowKeys(_selectedRowKeys)
      setSelectedRows(_selectedRows)

    }
  }
  const batchToolBar = () => {
    // return selectedRowKeys.length ? <Space>{ActionsBuild(init?.data?.layout?.batchToolBar,actionHandler)}</Space> : ''
    // 或者
    return selectedRowKeys.length > 0 && <Space>{ActionsBuild(init?.data?.layout?.batchToolBar,actionHandler)}</Space>
    // 如果直接写selectedRowKeys.length && ...当结果为0时react也会渲染

  }
  useEffect(() => {
    if(init.data?.layout?.tableColumn){
      setColumn(ColumnBuild(init.data.layout.tableColumn,actionHandler))

    }

  }, [init.data?.layout?.tableColumn])
  return <PageContainer>
    {searchLayout()}
    <Card>
      {beforeTableLayout()}
      <Table dataSource={init?.data?.dataSource}
      columns={column}
      pagination={false}
      rowKey='id'
      loading={init.loading}
      onChange={handleTableChange}
      rowSelection={rowSelection}
      />
      {afterTableLayout()}
    </Card>
    <AntdModal
      modalVisible = {modalVisible}
      hideModal={hideModal}
      modalUrl = {modalUrl}
    />
    <FooterToolbar extra={batchToolBar()}/>
  </PageContainer>
}

export default Index
