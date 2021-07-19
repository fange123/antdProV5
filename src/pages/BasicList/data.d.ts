declare module BasicListApi {
  type ActionHandler = (action:  BasicListApi.Action,record: any) => void

  type Page ={
     title: string;
    type: string;
    searchBar?: boolean;
    trash?: boolean;
  }


  type Action ={
     component: string;
    text: string;
    type: string;
    action: string;
    uri?: string;
    method?: string;
  }
  type Actions={
     name: string;
    title: string;
    data: Action[];
  }

  type Field ={
     title: string;
    dataIndex: string;
    key: string;
    sorter?: boolean,
    [key: string]: any// 接收其他多个任意属性的定义
  }



  type ListLayout ={
     tableColumn: Field[];
    tableToolBar: Action[];
    batchToolBar: Action[];
  }
  type PageLayout ={
     tabs: Tabs[];
    actions: Actions[];
  }



  export type DataSource = Record<string, any>;

  type Meta ={
     total: number;
    per_page: number;
    page: number;
  }
  type Tabs ={
     name: string;
    title: string;
    data: Field[];
  }

  type ListData ={
     page: Page;
    layout: ListLayout;
    dataSource: DataSource[];
    meta: Meta;
  }
  type PageData ={
     page: Page;
    layout: PageLayout;
    dataSource: DataSource;
  };

  type RootObject ={
     success: boolean;
      message: string;
      data:  PageData | ListData;
  }

}
