import React, { PureComponent }  from 'react'
import { Select } from 'antd'
import PropTypes from 'prop-types'

const Option = Select.Option

class InputWithResult extends PureComponent {
  constructor() {
    super()
  }
  searchHandle = value => {
    const { onSearch, onChange, onBlur } = this.props
    onSearch(value)
    onChange && onChange(value)
    onBlur && onBlur(value)
  }
  onChange = value => {
    if (value === undefined) {
      this.props.onChange('')
    }
  }
  render() {
    const defaultAntdOptions = {
      allowClear: true,
    }
    const { value, width, data, idKey = 'id', valueKey = 'value', labelKey = 'label', antdOptions } = this.props
    const mergedOptions = Object.assign({}, defaultAntdOptions, antdOptions)
    return (
      <Select
        allowClear
        value={typeof value === 'number' ? String(value) : value}
        style={{width: '100%', minWidth: width ? width : '200px'}}
        showSearch={true}
        showArrow={false}
        onSearch={this.searchHandle}
        onChange={this.onChange}
        {...mergedOptions}
      >
        {
          data && data.map(i =>
            <Option
              key={i[idKey] || i[valueKey]}
              value={typeof i[valueKey] === 'number' ? String(i[valueKey]) : i[valueKey]}
            >
              { i[labelKey]}
            </Option>
          )
        }
      </Select>
    )
  }
}

InputWithResult.propTypes = {
  data: PropTypes.array,
  antdOptions: PropTypes.object,
  onChange: PropTypes.func,
  propKey: PropTypes.string,
  idKey: PropTypes.string,
  valueKey: PropTypes.string,
  labelKey: PropTypes.string,
  width: PropTypes.string,
  value: PropTypes.any,
  onSearch: PropTypes.any,
  onBlur: PropTypes.any,
}

export default InputWithResult

export {
  InputWithResult,
}
