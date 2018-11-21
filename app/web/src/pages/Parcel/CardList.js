import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, Icon, List, Form, Modal, Input } from 'antd';
import Link from 'umi/link';

import Ellipsis from '@/components/Ellipsis';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './CardList.less';

const FormItem = Form.Item;

@connect(({ parcel, loading }) => ({
  parcel,
  loading: loading.models.parcel,
}))
@Form.create()
class CardList extends PureComponent {
  state = { visible: false, done: false };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'parcel/fetch',
    });
  }

  showModal = () => {
    this.setState({
      visible: true,
      current: undefined,
    });
  };

  showEditModal = item => {
    const current = {
      ...item,
      giturl: item.git.url,
      gitbranch: item.git.branch
    };
    this.setState({
      visible: true,
      current,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  validateRepeatedID = (rule, value, callback) => {
    const { parcel: { list } } = this.props;
    const { current } = this.state;
    if (value && (current === undefined) && list.map(it => it.id).includes(value)) {
      callback('项目ID已经占用了!');
    } else {
      callback();
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;

    form.validateFields((err, fields) => {
      if (err) return;
      this.setState({
        done: false,
        visible: false,
      });
      const { giturl, gitbranch, ...reFields } = fields;
      dispatch({
        type: 'parcel/submit',
        payload: { ...reFields, git: { url: giturl, branch: gitbranch } },
      });
    });
  };

  render() {
    const {
      parcel: { list },
      loading,
      form: { getFieldDecorator },
    } = this.props;

    const { visible, done, current = {} } = this.state;

    const modalFooter = done
        ? { footer: null, onCancel: this.handleDone }
        : { okText: '确定', onOk: this.handleSubmit, onCancel: this.handleCancel };

    const getModalContent = () => (
      <Form onSubmit={this.handleSubmit}>
        <FormItem label="ID" {...this.formLayout}>
          {getFieldDecorator('id', {
            rules: [
              { required: true, message: '项目ID不能为空' },
              {
                validator: this.validateRepeatedID,
              }
            ],
            initialValue: current.id,
          })(
            <Input placeholder="请输入项目ID" disabled={current.id !== undefined} />
          )}
        </FormItem>
        <FormItem label="标题" {...this.formLayout}>
          {getFieldDecorator('title', {
            rules: [{ required: true, message: '项目标题不能为空' }],
            initialValue: current.title,
          })(
            <Input placeholder="请输入项目标题" />
          )}
        </FormItem>
        <FormItem label="Logo" {...this.formLayout}>
          {getFieldDecorator('avatar', {
            rules: [
              { type: 'url', message: '输入不是有效的URL!'},
              { required: true, message: '项目Logo不能为空', whitespace: true }
            ],
            initialValue: current.avatar,
          })(
            <Input placeholder="请输入项目Logo的地址" />
          )}
        </FormItem>
        <FormItem label="描述" {...this.formLayout}>
          {getFieldDecorator('description', {
            rules: [{ required: true, message: '项目描述不能为空' }],
            initialValue: current.description,
          })(
            <Input placeholder="请输入项目描述" />
          )}
        </FormItem>
        <FormItem label="Git地址" {...this.formLayout}>
          {getFieldDecorator('giturl', {
            rules: [{ required: true, message: '项目Git地址不能为空' }],
            initialValue: current.giturl,
          })(
            <Input placeholder="请输入项目Git地址" />
          )}
        </FormItem>
        <FormItem label="Git分支" {...this.formLayout}>
          {getFieldDecorator('gitbranch', {
            rules: [{ required: true, message: '项目Git分支不能为空' }],
            initialValue: current.gitbranch,
          })(
            <Input placeholder="请输入项目Git分支" />
          )}
        </FormItem>
      </Form>
    )

    const content = (
      <div className={styles.pageHeaderContent}>
        <p>项目打包管理：提供React Native在线打包功能，支持Android和iOS。</p>
        <div className={styles.contentLink}>
          <a>
            <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/MjEImQtenlyueSmVEfUD.svg" />{' '}
            快速
          </a>
          <a>
            <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/NbuDUAuBlIApFuDvWiND.svg" />{' '}
            简单
          </a>
          <a>
            <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/ohOEPSYdDTNnyMbGuyLb.svg" />{' '}
            方便
          </a>
        </div>
      </div>
    );

    const extraContent = (
      <div className={styles.extraImg}>
        <img
          alt="这是一个标题"
          src="https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png"
        />
      </div>
    );

    return (
      <PageHeaderWrapper
        title="React Native项目打包管理"
        content={content}
        extraContent={extraContent}
      >
        <div className={styles.cardList}>
          <List
            rowKey="id"
            loading={loading}
            grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
            dataSource={['', ...list]}
            renderItem={item =>
              item ? (
                <List.Item key={item.id}>
                  <Card
                    hoverable
                    className={styles.card}
                    actions={[
                      <Link to={`/parcel/list?id=${item.id}`}>列表</Link>,
                      <a onClick={e => {
                        e.preventDefault();
                        this.showEditModal(item);
                      }}
                      >
                        编辑
                      </a>,
                    ]}
                  >
                    <Card.Meta
                      avatar={<img alt="" className={styles.cardAvatar} src={item.avatar} />}
                      title={<a>{item.title}</a>}
                      description={
                        <Ellipsis className={styles.item} lines={3}>
                          {item.description}
                        </Ellipsis>
                      }
                    />
                  </Card>
                </List.Item>
              ) : (
                <List.Item>
                  <Button type="dashed" onClick={this.showModal} className={styles.newButton}>
                    <Icon type="plus" /> 新增项目
                  </Button>
                </List.Item>
              )
            }
          />
        </div>
        <Modal
          title={done ? null : `项目${current ? '编辑' : '添加'}`}
          className={styles.standardListForm}
          width={640}
          bodyStyle={done ? { padding: '72px 0' } : { padding: '28px 0 0' }}
          destroyOnClose
          visible={visible}
          {...modalFooter}
        >
          {getModalContent()}
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default CardList;
