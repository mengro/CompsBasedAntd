import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Input, Checkbox, Button, Form, DatePicker, Row, Col } from 'antd'
import {
  CascaderEcho,
  RangePickerShell,
  SelectShell,
  InputWithResult,
} from '@/components/formElements/'

import { formItemLayout, searchGroupLayout } from './setting'
import * as classNames from './searchGroup.less'

const FormItem = Form.Item
const CheckboxGroup = Checkbox.Group
const create = Form.create

@create()
class SearchGroup extends PureComponent {
  static propTypes = {
    config: PropTypes.array,
    supportExport: PropTypes.any,
    form: PropTypes.object.isRequired,
    resetSearchBar: PropTypes.func,
    location: PropTypes.any,
    searchGroupLayout: PropTypes.any,
    pageChange: PropTypes.func,
    resetRowSelection: PropTypes.func,
    setSearchBarParams: PropTypes.func,
    getSearchBarParams: PropTypes.func,
    exportHandle: PropTypes.func,
    resetSearchForm: PropTypes.func,
  }
  state = {
    exportting: false,
  }
  componentDidMount() {
    this.echoSearchBar()
  }
  echoSearchBar = () => {
    // const store = this.props.store
    // const { form: { setFieldsValue } } = this.props
    // // 查询条件
    // if (store.search.keepParams) {
    //   setFieldsValue(store.search.params)
    //   setTimeout(() => {
    //     this.cascaderRef && this.cascaderRef.runEcho()
    //   }, 100)
    //   store.setSearchBarBoolKeepState(false)
    // }
    // // 下拉框数据源
    // const { commonStore } = store.rootStore
    // if (!commonStore.select.keepDataSource) {
    //   commonStore.reset()
    // }
    this.searchHandle()
  }
  setSearchParams = () => {
    const { form: { getFieldsValue }, setSearchBarParams } = this.props
    const values = getFieldsValue()
    let params = JSON.parse(JSON.stringify(values))
    setSearchBarParams && setSearchBarParams(params)
  }
  searchHandle = () => {
    this.setSearchParams()
    const {
      pageChange,
      resetRowSelection,
    } = this.props
    resetRowSelection && resetRowSelection()
    pageChange && pageChange(1)
  }
  exportHandle = () => {
    this.setSearchParams()
    const { exportHandle, getSearchBarParams } = this.props
    const _params = getSearchBarParams()
    console.log(_params)
    if (exportHandle) {
      this.setState({
        exportting: true,
      })
      exportHandle(_params)
        .then(res => {
          this.setState({
            exportting: false,
          })
        })
    }
  }
  resetHandle = () => {
    const {
      pageChange,
      resetRowSelection,
      resetSearchForm,
    } = this.props
    resetSearchForm()
    pageChange && pageChange(1)
    resetRowSelection && resetRowSelection()
  }
  render() {
    const { exportting } = this.state
    const { config, supportExport } = this.props
    const { getFieldDecorator} = this.props.form
    const mergedSearchGroupLayout = Object.assign({}, searchGroupLayout, this.props.searchGroupLayout)
    return (
      <Form>
        <Row>
          {
            config && config.map(item => {
              const { type, label, key, initialValue } = item
              const options = {
                rules: item.rules,
              }
              if (initialValue !== undefined) {
                options.initialValue = initialValue
              }
              return (
                <Col
                  key={key}
                  {...mergedSearchGroupLayout}
                >
                  <FormItem
                    label={(
                      label && <span>
                        { label }
                      </span>
                    )}
                    {...formItemLayout}
                  >
                    {
                      getFieldDecorator(item.key, options)(
                        (() => {
                          switch(type) {
                          case 'input':
                            return <Input {...item.antdOptions}></Input>
                          case 'select':
                            return (
                              <SelectShell propKey={item.key} {...item}></SelectShell>
                            )
                          case 'inputWithResult':
                            return (
                              <InputWithResult propKey={item.key} {...item}></InputWithResult>
                            )
                          case 'cascader':
                            return (
                              <CascaderEcho ref={ref => this.cascaderRef = ref} {...item}/>
                            )
                          case 'checkbox':
                            return (
                              <CheckboxGroup {...item.antdOptions} options={item.data}></CheckboxGroup>
                            )
                          case 'dateTime':
                            return (
                              <DatePicker
                                {...item.antdOptions}
                                showTime={true}
                              />
                            )
                          case 'rangePicker':
                            return (
                              <RangePickerShell
                                antdOptions={{
                                  format: 'YY/MM/DD HH:mm',
                                  ...item.antdOptions,
                                }}
                              />
                            )
                          default:
                            return <Input allowClear {...item.antdOptions}></Input>
                          }
                        })()
                      )
                    }
                  </FormItem>
                </Col>
              )
            })
          }
        </Row>
        {
          config &&
          <FormItem className={classNames.buttonRow}>
            <Button
              className={classNames.btn}
              onClick={this.searchHandle}
              type="primary"
            >
              查询
            </Button>
            {
              supportExport &&
              <Button
                className={classNames.btn}
                onClick={this.exportHandle}
                loading={exportting}
              >
                导出结果
              </Button>
            }
            <Button
              className={classNames.btn}
              onClick={this.resetHandle}
            >
              重置
            </Button>
          </FormItem>
        }
      </Form>
    )
  }
}

export {
  SearchGroup,
}
