import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Pagination, Row, Space, Table } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import styles from './index.less'
// useRequest从umi中获取接口数据的一个工具
import {useRequest} from 'umi'

interface IProps {}

const Index: React.FC<IProps> = props => {
  const [page, setPage] = useState<number>(1)
  const [perPage, setPerPage] = useState<number>(10)
  const init = useRequest<{data: BasicListApi.Data}>(`https://public-api-v2.aspirantzhang.com/api/admins?X-API-KEY=antd&page=${page}&per_page=${perPage}`)

  useEffect(() => {
    init.run()

  }, [page,perPage])

  const paginationHandle = (_page,_per_page) => {
    setPage(_page)
    setPerPage(_per_page)
  }

  const beforeTableLayout = ()=> {
    return(
      <Row>
        <Col xs={24} sm={12}>...</Col>
        <Col xs={24} sm={12} className={styles.table_tool_bar}>
          <Space>
            <Button type='primary'>Add</Button>
            <Button type='primary'>Add2</Button>
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
  const searchLayout = ()=> {}
  return <PageContainer>
    {searchLayout()}
    <Card>
    {beforeTableLayout()}
    <Table dataSource={init?.data?.dataSource}
    columns={init?.data?.layout?.tableColumn.filter((item)=> item.hideInColumn !== true)}
    pagination={false}
    loading={init.loading}
    />
    {afterTableLayout()}
    </Card>
  </PageContainer>
}

export default Index
