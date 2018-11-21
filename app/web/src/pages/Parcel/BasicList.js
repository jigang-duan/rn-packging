import React, { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
import moment from 'moment';
import { connect } from 'dva';
import {
  List,
  Card,
  Row,
  Col,
  Radio,
  Input,
  Progress,
  Button,
  Icon,
  Dropdown,
  Menu,
  Avatar,
  Modal,
  Form,
  Select,
  InputNumber,
} from 'antd';
import QRCode from 'qrcode.react';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Result from '@/components/Result';

import styles from './BasicList.less';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const SelectOption = Select.Option;
const { Search } = Input;

@connect(({ pack, loading }) => ({
  pack,
  loading: loading.models.pack,
}))
@Form.create()
class BasicList extends PureComponent {
  state = { visible: false, done: false };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  get currentParcel() {
    const { pack } = this.props;
    return pack.parent;
  }

  showModal = () => {
    this.setState({
      visible: true,
      current: undefined,
    });
  };

  showEditModal = item => {
    this.setState({
      visible: true,
      current: item,
    });
  };

  showQRCodeModal = item => {
    this.setState({
      qrcode: true,
      visible: true,
      current: item,
    });
  };

  handleDone = () => {
    setTimeout(() => this.addBtn.blur(), 0);
    this.setState({
      done: false,
      visible: false,
    });
  };

  handleError = () => {
    const { dispatch } = this.props;
    setTimeout(() => this.addBtn.blur(), 0);
    dispatch({
      type: 'pack/reportError',
      payload: null,
    });
  };

  handleCancel = () => {
    setTimeout(() => this.addBtn.blur(), 0);
    this.setState({
      visible: false,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { current } = this.state;
    const id = current ? current.id : '';

    setTimeout(() => this.addBtn.blur(), 0);
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        done: true,
      });
      const { version1, version2, version3, ...fields } = fieldsValue;
      const version = `${version1}.${version2}.${version3}`;
      const parentID = this.currentParcel.id;
      dispatch({
        type: 'pack/submit',
        payload: { id, parentID, version, ...fields },
      });
    });
  };

  deleteItem = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'pack/submit',
      payload: { id },
    });
  };

  handleChoose = e => {
    const environment = e.target.value;
    const { dispatch } = this.props;
    const { id } = this.currentParcel;
    dispatch({
      type: 'pack/fetchWithEnvironment',
      payload: { id, params: { environment } },
    });
  };

  render() {
    const {
      pack: { list, packing, envs, error },
      loading,
    } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { visible, done, qrcode, current = {} } = this.state;
    const visibleModal = visible || (error !== null);

    const editAndDelete = (key, currentItem) => {
      if (key === 'qrcode') this.showQRCodeModal(currentItem);
      else if (key === 'delete') {
        Modal.confirm({
          title: '删除包',
          content: '确定删除该包吗？',
          okText: '确认',
          cancelText: '取消',
          onOk: () => this.deleteItem(currentItem.id),
        });
      }
    };

    const modalFooter =
      done || qrcode || error
        ? { footer: null, onCancel: this.handleDone }
        : { okText: '确定', onOk: this.handleSubmit, onCancel: this.handleCancel };

    const Info = ({ title, value, bordered }) => (
      <div className={styles.headerInfo}>
        <span>{title}</span>
        <p>{value}</p>
        {bordered && <em />}
      </div>
    );

    const extraContent = (
      <div className={styles.extraContent}>
        <RadioGroup onChange={this.handleChoose} defaultValue="all">
          <RadioButton value="开发环境">开发环境</RadioButton>
          <RadioButton value="测试环境">测试环境</RadioButton>
          <RadioButton value="生产环境">生产环境</RadioButton>
        </RadioGroup>
        <Search className={styles.extraContentSearch} placeholder="请输入" onSearch={() => ({})} />
      </div>
    );

    const paginationProps = {
      // showSizeChanger: true,
      // showQuickJumper: true,
      pageSize: 5,
      // total: 50,
    };

    const ListContent = ({ data: { version, environment, createdAt, percent, status } }) => (
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <span>{version}</span>
          <p>{environment}</p>
        </div>
        <div className={styles.listContentItem}>
          <span>构建时间</span>
          <p>{moment(createdAt).format('YYYY-MM-DD HH:mm')}</p>
        </div>
        <div className={styles.listContentItem}>
          <Progress percent={percent} status={status} strokeWidth={6} style={{ width: 180 }} />
        </div>
      </div>
    );

    const MoreBtn = props => (
      <Dropdown
        overlay={
          <Menu onClick={({ key }) => editAndDelete(key, props.current)}>
            <Menu.Item key="qrcode">二维码</Menu.Item>
            <Menu.Item key="download">
              <a download="app" href={props.current.resource}>
                下载
              </a>
            </Menu.Item>
            <Menu.Item key="delete">删除</Menu.Item>
          </Menu>
        }
      >
        <a>
          更多 <Icon type="down" />
        </a>
      </Dropdown>
    );

    const getModalContent = () => {
      if (done) {
        return (
          <Result
            type="success"
            title="开始打包"
            description="开始打包，一次只能有一个工程打包"
            actions={
              <Button type="primary" onClick={this.handleDone}>
                知道了
              </Button>
            }
            className={styles.formResult}
          />
        );
      }
      if (error) {
        return (
          <Result
            type="error"
            title={error.id}
            description="打包失败"
            actions={
              <Button type="primary" onClick={this.handleError}>
                知道了
              </Button>
            }
            className={styles.formResult}
          />
        );
      }
      if (qrcode) {
        return (
          <QRCode value={current.resource} size={256} fgColor="#A36209" className={styles.qrcode} />
        );
      }
      return (
        <Form onSubmit={this.handleSubmit}>
          <FormItem label="操作系统" {...this.formLayout}>
            {getFieldDecorator('os', {
              rules: [{ required: true, message: '请选择操作系统' }],
              initialValue: current.os,
            })(
              <Select placeholder="请选择">
                <SelectOption value="Android">Android</SelectOption>
                <SelectOption value="IOS">IOS</SelectOption>
              </Select>
            )}
          </FormItem>
          <FormItem label="环境变量" {...this.formLayout}>
            {getFieldDecorator('environment', {
              rules: [{ required: true, message: '请选择环境' }],
              initialValue: current.environment,
            })(
              <Select placeholder="请选择">
                <SelectOption value="开发环境">开发环境</SelectOption>
                <SelectOption value="测试环境">测试环境</SelectOption>
                <SelectOption value="生产环境">生产环境</SelectOption>
              </Select>
            )}
          </FormItem>
          <FormItem label="打包格式" {...this.formLayout}>
            {getFieldDecorator('format', {
              rules: [{ required: true, message: '请选择打包格式' }],
              initialValue: '未压缩',
            })(
              <Select placeholder="请选择">
                <SelectOption value="ZIP">ZIP</SelectOption>
                <SelectOption value="未压缩">未压缩</SelectOption>
              </Select>
            )}
          </FormItem>
          <FormItem label="版本号" {...this.formLayout}>
            <div>
              {getFieldDecorator('version1', {
                rules: [{ required: true, message: '1~9' }],
                initialValue: current.version1,
              })(<InputNumber size="small" min={1} max={9} />)}
              {getFieldDecorator('version2', {
                rules: [{ required: true, message: '0~99' }],
                initialValue: current.version2,
              })(<InputNumber size="small" min={0} max={99} />)}
              {getFieldDecorator('version3', {
                rules: [{ required: true, message: '0~999' }],
                initialValue: current.version3,
              })(<InputNumber size="small" min={0} max={999} />)}
            </div>
          </FormItem>
          <FormItem label="发布策略" {...this.formLayout}>
            {getFieldDecorator('release', {
              rules: [{ required: true, message: '请选择发布策略' }],
              initialValue: '立即发布',
            })(
              <Select placeholder="请选择">
                <SelectOption value="立即发布">立即发布</SelectOption>
                <SelectOption value="指定发布">指定发布</SelectOption>
              </Select>
            )}
          </FormItem>
          <FormItem label="升级策略" {...this.formLayout}>
            {getFieldDecorator('upgrade', {
              rules: [{ required: true, message: '请选择升级策略' }],
              initialValue: '强制升级',
            })(
              <Select placeholder="请选择">
                <SelectOption value="强制升级">强制升级</SelectOption>
                <SelectOption value="推荐升级">推荐升级</SelectOption>
              </Select>
            )}
          </FormItem>
        </Form>
      );
    };
    return (
      <PageHeaderWrapper>
        <div className={styles.standardList}>
          <Card bordered={false}>
            <Row>
              {envs.map(item => (
                <Col key={item.env} sm={8} xs={24}>
                  <Info title={item.env} value={item.count} bordered />
                </Col>
              ))}
            </Row>
          </Card>

          <Card
            className={styles.listCard}
            bordered={false}
            title={this.currentParcel.title}
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            extra={extraContent}
          >
            <Button
              type="dashed"
              style={{ width: '100%', marginBottom: 8 }}
              icon="plus"
              onClick={this.showModal}
              ref={component => {
                /* eslint-disable */
                this.addBtn = findDOMNode(component);
                /* eslint-enable */
              }}
              loading={packing}
            >
              打包
              {packing && '中'}
            </Button>
            <List
              size="large"
              rowKey="id"
              loading={loading}
              pagination={paginationProps}
              dataSource={list}
              renderItem={item => (
                <List.Item
                  actions={[
                    <a
                      onClick={e => {
                        e.preventDefault();
                        this.showQRCodeModal(item);
                      }}
                    >
                      二维码
                    </a>,
                    <MoreBtn current={item} />,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={item.logo} shape="square" size="large" />}
                    title={<a href={item.href}>{item.title}</a>}
                    description={item.description}
                  />
                  <ListContent data={item} />
                </List.Item>
              )}
            />
          </Card>
        </div>
        <Modal
          title={done || qrcode || error ? null : `打包${current ? '编辑' : '添加'}`}
          className={styles.standardListForm}
          width={640}
          bodyStyle={done || qrcode || error ? { padding: '72px 0' } : { padding: '28px 0 0' }}
          destroyOnClose
          visible={visibleModal}
          {...modalFooter}
        >
          {getModalContent()}
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default BasicList;
