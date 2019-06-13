import React, { PureComponent } from 'react'
import { TreeSelect } from 'antd'
import { PropTypes } from 'prop-types'

const { TreeNode } = TreeSelect

export default class TreeSelectShell extends PureComponent {
  static propTypes = {
    value: PropTypes.array,
    treeData: PropTypes.array,
    antdOptions: PropTypes.object,
    onChange: PropTypes.func,
    labelKey: PropTypes.string,
    valueKey: PropTypes.string,
    childrenKey: PropTypes.string,
    leafKey: PropTypes.string,
  }
  state = {
    leftSelectedKeys: [],
    rightSelectedKeys: [],
    spinning: false,
  }

  renderTreeNodes = data => data.map((item) => {
    const { labelKey, valueKey, childrenKey, leafKey } = this.props
    return (
      <TreeNode
        title={item[labelKey]}
        key={item[valueKey]}
        value={item[valueKey]}
        isLeaf={item[leafKey]}
      >
        {
          item[childrenKey] &&
          this.renderTreeNodes(item[childrenKey])
        }
      </TreeNode>
    )
  })

  render() {
    const { treeData, value, onChange, antdOptions = {} } = this.props
    return (
      <TreeSelect
        value={value}
        onChange={onChange}
        {...antdOptions}
      >
        {this.renderTreeNodes(treeData)}
      </TreeSelect>
    )
  }
}
