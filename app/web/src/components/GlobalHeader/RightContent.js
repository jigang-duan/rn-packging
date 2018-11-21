import React, { PureComponent } from 'react';
import { formatMessage } from 'umi/locale';
import { Icon, Tooltip } from 'antd';
import HeaderSearch from '../HeaderSearch';
import SelectLang from '../SelectLang';
import styles from './index.less';

export default class GlobalHeaderRight extends PureComponent {
  render() {
    const { theme } = this.props;
    let className = styles.right;
    if (theme === 'dark') {
      className = `${styles.right}  ${styles.dark}`;
    }
    return (
      <div className={className}>
        <HeaderSearch
          className={`${styles.action} ${styles.search}`}
          placeholder={formatMessage({ id: 'component.globalHeader.search' })}
          dataSource={[
            formatMessage({ id: 'component.globalHeader.search.example1' }),
            formatMessage({ id: 'component.globalHeader.search.example2' }),
            formatMessage({ id: 'component.globalHeader.search.example3' }),
          ]}
          onSearch={value => {
            console.log('input', value); // eslint-disable-line
          }}
          onPressEnter={value => {
            console.log('enter', value); // eslint-disable-line
          }}
        />
        <Tooltip title={formatMessage({ id: 'component.globalHeader.help' })}>
          <a
            target="_blank"
            href="https://angry-kitchen.github.io/cocina-website/"
            rel="noopener noreferrer"
            className={styles.action}
          >
            <Icon type="file-word" />
          </a>
        </Tooltip>
        <Tooltip title="logs">
          <a
            target="_blank"
            href="http://192.168.11.1:7001/__logs"
            rel="noopener noreferrer"
            className={styles.action}
          >
            <Icon type="file" />
          </a>
        </Tooltip>
        <SelectLang className={styles.action} />
      </div>
    );
  }
}
