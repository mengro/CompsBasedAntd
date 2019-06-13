import React, { PureComponent } from 'react'
import { Table } from 'antd'
import PropTypes from 'prop-types'
import './TablePreset.less'

const defaultProps = {
  pagination: {
    showQuickJumper: true,
    showSizeChanger: true,
    pageSizeOptions: ['20', '30', '50'],
    defaultPageSize: 20,
  },
  bordered: true,
  scroll: { x: 1300 },
}

class TablePreset extends PureComponent {
  constructor(props) {
    super(props)
  }
  static propTypes = {
    columns: PropTypes.array,
    dataSource: PropTypes.array,
    pagination: PropTypes.any,
    children: PropTypes.any,
    scroll: PropTypes.any,
    rowSelection: PropTypes.object,
    queryListHandle: PropTypes.func,
    rowKey: PropTypes.any,
    loading: PropTypes.bool,
    bordered: PropTypes.bool,
  }
  selectedRowsPageList = []
  render() {
    const {
      columns,
    } = this.props
    // setColumnClass
    columns.forEach(item => {
      item.className = 'antdPreset-table-cell'
      if (item.singleLine) {
        item.className = 'antdPreset-table-cell antdPreset-table-cell-singleLine'
        item.align = 'center'
      }
      if (item.mutipleLine) {
        item.className = 'antdPreset-table-cell antdPreset-table-cell-mutipleLine'
      }
    })
    const columnsLength = columns.length
    const actionColumn = columns[columnsLength - 1]
    if (actionColumn.key === 'action' && !actionColumn.nofix) {
      actionColumn.fixed = 'right'
      actionColumn.align = 'center'
      actionColumn.className += ` antdPreset-table-action-container ${actionColumn.direction || 'horizontal'}`
      if (!actionColumn.width) {
        actionColumn.width = 160
      }
    }
    const mergedPagination = Object.assign({}, defaultProps.pagination, this.props.pagination)
    const mergedProps = Object.assign({}, defaultProps, this.props)
    mergedProps.pagination = mergedPagination
    if (mergedProps.rowKey instanceof Array) {
      const newKey = mergedProps.rowKey.join('-')
      mergedProps.dataSource = mergedProps.dataSource.map(item => ({
        ...item,
        [newKey]: mergedProps.rowKey.map(i => item[i]).join('&connect&')
      }))
      mergedProps.rowKey = newKey
    }
    return(
      <div className="table-root">
        <div className="table-container">
          <Table
            {...mergedProps}
          >
          </Table>
        </div>
      </div>
    )
  }
}

export {
  TablePreset,
}

