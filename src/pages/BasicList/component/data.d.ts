declare module PageApi {

  export interface Page {
      title: string;
      type: string;
  }

  export interface Child2 {
      id: number;
      parent_id: number;
      name: string;
      create_time: Date;
      delete_time?: any;
      status: number;
      value: number;
      title: string;
      depth: number;
  }

  export interface Child {
      id: number;
      parent_id: number;
      name: string;
      create_time: Date;
      delete_time?: any;
      status: number;
      value: number;
      title: string;
      depth: number;
      children: Child2[];
  }

  export interface Datum2 {
      id: number;
      parent_id: number;
      name: string;
      create_time: Date;
      delete_time?: any;
      status: number;
      value: number;
      title: string;
      depth: number;
      children: Child[];
  }

  export interface Datum {
      title: string;
      dataIndex: string;
      key: string;
      type: string;
      data: Datum2[];
  }

  export interface Tab {
      name: string;
      title: string;
      data: Datum[];
  }

  export interface Datum3 {
      component: string;
      text: string;
      type: string;
      action: string;
      uri: string;
      method: string;
  }

  export interface Action {
      name: string;
      title: string;
      data: Datum3[];
  }

  export interface Layout {
      tabs: Tab[];
      actions: Action[];
  }

  export interface Data {
      page: Page;
      layout: Layout;
  }

  export interface RootObject {
      success: boolean;
      message: string;
      data: Data;
  }

}

