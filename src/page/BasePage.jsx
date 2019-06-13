import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { SearchGroup } from './SearchGroup'
import { TablePreset } from './Table'
import { ButtonGroup } from './ButtonGroup'
import { objectTools } from '@/utils'

export default class BasePage extends PureComponent {
  constructor() {
    super()
    this.selectedRowsPageList = []
  }
  static propTypes = {
    title: PropTypes.string,
    topBtn: PropTypes.element,
    children: PropTypes.any,
    queryListAPI: PropTypes.func,
    queryConditions: PropTypes.object,
    searchConfig: PropTypes.object,
    tableConfig: PropTypes.object,
    extraParams: PropTypes.object,
    buttonConfig: PropTypes.object,
  }
  state = {
    queryConditions: {},
    pagination: {
      page: 1,
      pageSize: 20,
    },
    loading: false,
    selectedRowKeys: [],
    selectedRows: [],
    dataSource: [],
  }
  setRowSelection = (selectedRowKeys, selectedRows) => {
    if (selectedRowKeys) {
      this.setState({
        selectedRowKeys,
      })
      const { page } = this.state.pagination
      this.selectedRowsPageList[page - 1] = selectedRows
    }
    if (selectedRows) {
      this.setState({
        selectedRows,
      })
    }
  }
  resetRowSelection = () => {
    this.setState({
      selectedRowKeys: [],
      selectedRows: [],
    })
    this.selectedRowsPageList = []
  }
  pageChangeHandle = (page, pageSize) => {
    const _pagination = {}
    if (page) {
      _pagination.page = page
    }
    if (pageSize) {
      _pagination.pageSize = pageSize
    }
    const newPagination = Object.assign({}, this.state.pagination, _pagination)
    this.setState({pagination: newPagination}, this.queryList)
  }
  queryList = async () => {
    const { queryListAPI } = this.props
    const params = this.getSearchBarParams()
    this.setState({
      loading: true
    })
    return queryListAPI(params)
      .then(data => {
        if (data) {
          if (data.rows instanceof Array) {
            this.setState({
              dataSource: data.rows,
              total: data.total,
            })
          } else if(data instanceof Array) {
            this.setState({
              dataSource: data,
            })
          }
        }
        this.setState({
          loading: false
        })
        return data
      })
      .catch(err => {
        this.setState({
          loading: false
        })
      })
  }
  getSearchBarParams = () => {
    const { extraParams } = this.props
    const { pagination } = this.state
    const { queryConditions } = this
    const mergePageCondition = Object.assign({}, queryConditions, pagination, extraParams)
    return objectTools.filterUndefined(mergePageCondition)
  }
  setSearchBarParams = params => this.queryConditions = params
  resetSearchForm = () => {
    const { form: { resetFields, getFieldsValue } } = this.searchRef.props
    resetFields()
    this.setSearchBarParams(objectTools.filterUndefined(getFieldsValue()))
  }
  render() {
    const { searchConfig, tableConfig, buttonConfig } = this.props
    const {
      dataSource,
      total,
      loading,
      selectedRowKeys,
      selectedRows,
      pagination: { page, pageSize }
    } = this.state
    return (
      <div className="basePage-root">
        <SearchGroup
          {...searchConfig}
          wrappedComponentRef={ref => this.searchRef = ref}
          setSearchBarParams={this.setSearchBarParams}
          getSearchBarParams={this.getSearchBarParams}
          queryList={this.queryList}
          resetRowSelection={this.resetRowSelection}
          pageChange={this.pageChangeHandle}
          resetSearchForm={this.resetSearchForm}
        >

        </SearchGroup>
        <ButtonGroup
          {...buttonConfig}
          selectedRowKeys={selectedRowKeys}
          selectedRows={selectedRows}
          resetRowSelection={this.resetRowSelection}
          queryList={this.queryList}
          setRowSelection={this.setRowSelection}
          setSearchBarParams={this.setSearchBarParams}
          resetSearchForm={this.resetSearchForm}
          resetHandle={() => this.searchRef.resetHandle()}
        >
        </ButtonGroup>
        <TablePreset
          {...tableConfig}
          loading={loading}
          dataSource={dataSource}
          queryList={this.queryList}
          rowSelection={
            !tableConfig.rowSelection? null :
              {
                selectedRowKeys,
                onChange: this.setRowSelection,
                ...(typeof tableConfig.rowSelection === 'object' ? tableConfig.rowSelection : {}),
              }
          }
          pagination={{
            current: page,
            defaultPageSize: pageSize,
            total: total,
            showTotal: total => `共 ${total} 条`,
            onChange: this.pageChangeHandle,
            onShowSizeChange: this.pageChangeHandle,
          }}
        >
        </TablePreset>
      </div>
    )
  }
}

export {
  BasePage,
}
