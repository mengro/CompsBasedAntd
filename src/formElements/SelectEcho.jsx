import React, { PureComponent }  from 'react'
import { Select } from 'antd'
import PropTypes from 'prop-types'
import { history } from '@/index'

const Option = Select.Option

class SelectEcho extends PureComponent {
  constructor() {
    super()
  }
  checkEcho = () => {
    const { echoKey, query, onSearch, value, propKey } = this.props
    if (echoKey && query[echoKey] && query[propKey]) {
      onSearch(query[echoKey])
    } else if (!echoKey) {
      onSearch && onSearch(value)
    }
  }
  searchHandle = value => {
    const { onSearch, echoKey, query } = this.props
    if (echoKey) {
      history.push({
        pathname: window.location.hash.split('?')[0].slice(1),
        query: Object.assign({}, query, { [echoKey]: value }),
      })
    }
    onSearch(value)
  }
  componentWillMount() {
    this.checkEcho()
  }
  render() {
    const defaultAntdOptions = {
      allowClear: true,
    }
    const { value, data, idKey = 'id', valueKey = 'value', labelKey = 'label', antdOptions, onChange } = this.props
    const mergedOptions = Object.assign({}, defaultAntdOptions, antdOptions)
    return (
      <Select
        allowClear
        value={typeof value === 'number' ? String(value) : value}
        onChange={onChange}
        style={{width: '200px'}}
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

SelectEcho.propTypes = {
  data: PropTypes.array,
  antdOptions: PropTypes.object,
  onChange: PropTypes.func,
  propKey: PropTypes.string,
  idKey: PropTypes.string,
  valueKey: PropTypes.string,
  labelKey: PropTypes.string,
  value: PropTypes.any,
  echoKey: PropTypes.any,
  query: PropTypes.any,
  onSearch: PropTypes.any,
}

export default SelectEcho

export {
  SelectEcho,
}
