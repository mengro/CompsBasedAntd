import React, { Component } from 'react'
import { DatePicker } from 'antd'
import moment from 'moment'

import PropTypes from 'prop-types'

const RangePicker = DatePicker.RangePicker

class RangePickerShell extends Component {
  static propTypes = {
    antdOptions: PropTypes.object,
    onChange: PropTypes.func,
    value: PropTypes.any,
  }
  changeHandle = (values) => {
    this.props.onChange(values.map(item => item.format('YYYY-MM-DD HH:mm:ss')))
  }
  render() {
    const { antdOptions, value } = this.props
    const _value = value && value instanceof Array && value.map(item => moment(item))
    const defaultOptions = {
      format: 'YYYY-MM-DD HH:mm:ss',
    }
    const mergedOptions = Object.assign({}, defaultOptions, antdOptions)
    return (
      <RangePicker style={{width: '100%'}} value={_value} onChange={this.changeHandle}  {...mergedOptions} />
    )
  }
}
export {
  RangePickerShell,
}
