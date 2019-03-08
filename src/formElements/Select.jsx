import React, { PureComponent }  from 'react'
import { Select } from 'antd'
import PropTypes from 'prop-types'

const Option = Select.Option

class SelectShell extends PureComponent {
  constructor() {
    super()
  }
  searchHandle = value => {
    const { onSearch } = this.props
    onSearch && onSearch(value)
  }
  render() {
    const defaultAntdOptions = {
      allowClear: true,
    }
    const { value, width, data, idKey = 'id', valueKey = 'value', labelKey = 'label', antdOptions, onChange } = this.props
    const mergedOptions = Object.assign({}, defaultAntdOptions, antdOptions)
    return (
      <Select
        allowClear
        value={typeof value === 'number' ? String(value) : value}
        onChange={onChange}
        style={{width: '100%', minWidth: width ? width : '200px'}}
        onSearch={this.searchHandle}
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

SelectShell.propTypes = {
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
}

export default SelectShell

export {
  SelectShell,
}
