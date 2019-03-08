import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Cascader } from 'antd'

export default class CascaderEcho extends Component {
  static propTypes = {
    value: PropTypes.any,
    antdOptions: PropTypes.object,
    loadData: PropTypes.func,
    onChange: PropTypes.func,
  }
  state = {
    options: [],
  }
  loadData = async (selectedOptions = []) => {
    const targetOption = selectedOptions[selectedOptions.length - 1]
    targetOption.loading = true
    const options = await this.props.loadData(targetOption.value)
    targetOption.loading = false
    if (options) {
      targetOption.children = options
      this.setState({
        options: [...this.state.options],
      })
    }
    return options
  }
  init = async () => {
    const options = await this.props.loadData()
    if (options) {
      this.setState({
        options,
      })
    }
  }
  echo = async (echoValue, options) => {
    if (!echoValue || echoValue.length <= 0) {
      return
    }
    const selectedOptions = options.filter(item => String(echoValue[0]) === String(item.value))
    const childOptions = await this.loadData(selectedOptions)
    if (childOptions) {
      return this.echo(echoValue.slice(1), childOptions)
    }
  }
  runEcho = () => {
    this.compRef && this.echo(this.props.value, this.compRef.props.options)
  }
  changeHandle = value => {
    this.props.onChange(value)
  }
  componentWillMount() {
    this.init()
  }
  render() {
    const { antdOptions, value } = this.props
    const { options } = this.state
    return (
      <Cascader
        style={{ width: '100%' }}
        ref={ref => this.compRef = ref}
        {...antdOptions}
        loadData={this.loadData}
        options={options}
        onChange={this.changeHandle}
        value={value && value.map(item => Number(item))}
      />
    )
  }
}

export {
  CascaderEcho,
}
