import React from 'react'
import { Button, Card, Col, Pagination, Row, Space, Table } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import styles from './index.less'

interface IProps {}

const Index: React.FC<IProps> = props => {
  const dataSource = [
    {
      key: '1',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号',
    },
    {
      key: '2',
      name: '胡彦祖',
      age: 42,
      address: '西湖区湖底公园1号',
    },
  ];

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '住址',
      dataIndex: 'address',
      key: 'address',
    },
  ];

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
          <Pagination/>
        </Col>
      </Row>
    )
  }
  const searchLayout = ()=> {}
  return <PageContainer>
    {searchLayout()}
    <Card>
    {beforeTableLayout()}
    <Table dataSource={dataSource} columns={columns} pagination={false}/>
    {afterTableLayout()}
    </Card>
  </PageContainer>
}

export default Index
