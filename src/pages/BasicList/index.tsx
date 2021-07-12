import React, { useEffect, useState } from 'react'
import {  Button, Card, Col, Pagination, Row, Space, Table } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import styles from './index.less'
// useRequest从umi中获取接口数据的一个工具
import {useRequest} from 'umi'
import ActionsBuild from './build/ActionBuild';
import ColumnBuild from './build/ColumnBuild';
import type {  TablePaginationConfig } from 'antd/lib/table/interface';
import Modal from './component/Modal'

interface IProps {}

const Index: React.FC<IProps> = props => {
  const [page, setPage] = useState<number>(1)
  const [perPage, setPerPage] = useState<number>(10)
  const [orders, setOrders] = useState<string>('desc')
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [modalUrl, setModalUrl] = useState<string>('')
  const init = useRequest<{data: BasicListApi.Data}>(`https://public-api-v2.aspirantzhang.com/api/admins?X-API-KEY=antd&page=${page}&per_page=${perPage}&sort=create_time&order=${orders}`)

  useEffect(() => {
    init.run()

  }, [page,perPage,orders])

  const paginationHandle = (_page,_per_page) => {
    setPage(_page)
    setPerPage(_per_page)
  }

const handleTableChange = (pagination: TablePaginationConfig,_: any,sorter: any) => {
  const { order, field } = sorter
  let ordering = ''
  if (field === 'create_time') {
    ordering = order === 'ascend' ? 'asc':'desc'
  }
  setOrders(ordering)





}

  const beforeTableLayout = ()=> {
    return(
      <Row>
        <Col xs={24} sm={12}>...</Col>
        <Col xs={24} sm={12} className={styles.table_tool_bar}>
          <Space>
            {ActionsBuild(init?.data?.layout?.tableToolBar)}
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
            current={init?.data?.meta?.page || 1}
            pageSize={init?.data?.meta?.per_page || 10}
           total={init?.data?.meta?.total || 0}
           onChange={paginationHandle}
           onShowSizeChange={paginationHandle}

          />
        </Col>
      </Row>
    )
  }
  const searchLayout = ()=> {
    return(
      <div>
        <Button type='primary' onClick={()=>{
          setModalUrl('https://public-api-v2.aspirantzhang.com/api/admins/add?X-API-KEY=antd')
          setModalVisible(true)
        }}>add</Button>
      </div>
    )
  }
  return <PageContainer>
    {searchLayout()}
    <Card>
      {beforeTableLayout()}
      <Table dataSource={init?.data?.dataSource}
      columns={ColumnBuild(init?.data?.layout?.tableColumn)}
      pagination={false}
      rowKey='id'
      loading={init.loading}
      onChange={handleTableChange}
      />
      {afterTableLayout()}
    </Card>
    <Modal
      modalVisible = {modalVisible}
      hideModal={()=> setModalVisible(false)}
      modalUrl = {modalUrl}
    />
  </PageContainer>
}

export default Index
