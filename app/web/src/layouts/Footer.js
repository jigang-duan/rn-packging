import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      links={[
        {
          key: '公司',
          title: '公司',
          href: 'http://www.chalco-steering.com/html/index.jsp',
          blankTarget: true,
        },
        {
          key: 'gitlab',
          title: <Icon type="gitlab" />,
          href: 'http://git.cs2025.com/jigang.duan/rn-packaging-pro',
          blankTarget: true,
        },
        {
          key: '打个包',
          title: '打个包',
          href: '#',
          blankTarget: true,
        },
      ]}
      copyright={
        <Fragment>
          Copyright <Icon type="copyright" /> 2018 中铝视拓前端公共组出品
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;
