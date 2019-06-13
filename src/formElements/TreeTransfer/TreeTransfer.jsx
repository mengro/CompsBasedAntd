import React, { Component } from 'react'
import { Tree, Button } from 'antd'
import { PropTypes } from 'prop-types'
import { arrayTools } from '@/utils'
import * as classNames from './TreeTransfer.css'
import { commonProps } from './settings'

const { TreeNode } = Tree

export default class TreeTransfer extends Component {
  static propTypes = {
    value: PropTypes.array,
    height: PropTypes.number,
    loadData: PropTypes.func,
    onChange: PropTypes.func,
  }
  state = {
    dataSource: [],
    leftSelectedKeys: [],
    rightSelectedKeys: [],
  }
  componentWillMount() {
    this.init()
  }
  componentWillReceiveProps(nextProps) {
    const { value } = this.props
    if (!arrayTools.looseEqual(nextProps.value, value)) {
      const { dataSource } = this.state
      this.updateTreeState(dataSource, nextProps.value)
    }
  }
  init = async () => {
    const { loadData, value } = this.props
    const dataSource = await loadData()
    if (dataSource) {
      this.updateTreeState(dataSource, value)
      this.setState({
        dataSource,
      })
    }
  }
  _loadData = async (treeNode, side) => {
    if (treeNode.props.children) {
      return
    }
    const { loadData } = this.props
    const id = treeNode.props.dataRef.value
    const data = await loadData(id)
    if (data) {
      treeNode.props.dataRef.children = data
    }
    this.setState({
      dataSource: [...this.state.dataSource],
    },() => {
      if (side === 'right') {
        const { onChange, value } = this.props
        const newValueMergedChildren = value.concat(data.map(item => item.value))
        onChange(newValueMergedChildren)
      }
    })
  }

  updateTreeState = (data, value) => {
    if (!(data instanceof Array)) {
      return false
    }
    const resultList = []
    data.forEach(node => {
      if (node.children) {
        const result = this.updateTreeState(node.children, value)
        if (result.childrenAllChecked) {
          node.side = 'right'
          resultList.push('right')
        } else if (result.childrenAllNotChecked) {
          node.side = 'left'
          resultList.push('left')
        } else {
          node.side = 'both'
          resultList.push('both')
        }
      } else {
        if (value.findIndex(i => String(i) === String(node.value)) > -1) {
          node.side = 'right'
          resultList.push('right')
        } else {
          node.side = 'left'
          resultList.push('left')
        }
      }
    })
    return {
      childrenAllChecked: resultList.every(item => item === 'right'),
      childrenAllNotChecked: resultList.every(item => item === 'left'),
    }
  }

  onTreeCheckHandle = (checkedKeys, side) => {
    if (side === 'left') {
      this.setState({
        leftSelectedKeys: checkedKeys,
      })
    } else if (side === 'right') {
      this.setState({
        rightSelectedKeys: checkedKeys,
      })
    }
  }

  buttonClickHandle = deriction => {
    const { leftSelectedKeys, rightSelectedKeys, dataSource } = this.state
    const { value, onChange } = this.props
    let result
    if (deriction === 'toRight') {
      this.setState({
        leftSelectedKeys: [],
      })
      result = leftSelectedKeys.concat(value)
      onChange && onChange(result)
    } else if (deriction === 'toLeft') {
      this.setState({
        rightSelectedKeys: [],
      })
      result = value.filter(i => rightSelectedKeys.findIndex(j => String(j) === String(i)) < 0)
      onChange && onChange(result)
    }
    this.updateTreeState(dataSource, result)
    this.setState({ dataSource })
  }

  renderLeftTreeNodes = data => data.filter(i => i.side !== 'right').map((item) => {
    return (
      <TreeNode
        title={item.label}
        key={item.value}
        isLeaf={item.isLeaf}
        dataRef={item}
        side={item.side}
      >
        {
          item.children &&
          this.renderLeftTreeNodes(item.children)
        }
      </TreeNode>
    )
  })

  renderRightTreeNodes = data =>  data.filter(i => i.side !== 'left').map((item) => {
    return (
      <TreeNode
        title={item.label}
        key={item.value}
        isLeaf={item.isLeaf}
        dataRef={item}
        side={item.side}
      >
        {
          item.children &&
          this.renderRightTreeNodes(item.children)
        }
      </TreeNode>
    )
  })

  filterResult = () => {
    const resultList = []
    const _filterResult = (node) => {
      if (node.props.side === 'right') {
        resultList.push(node.key)
      } else {
        const { children } = node.props
        children && children.forEach(_filterResult)
      }
    }
    _filterResult(this.rightTreeRef)
    return resultList
  }

  render() {
    const { height } = this.props
    const { dataSource, leftSelectedKeys, rightSelectedKeys } = this.state
    const _height = height ? height : 240
    const treeItemStyle = {
      height: `${(_height - 40)}px`
    }
    return (
      <div
        style={{
          height: `${_height}px`,
        }}
        className={classNames.container}
      >
        <div className={classNames.treeContainer}>
          <h3 className={classNames.title}>可选类目</h3>
          <div style={treeItemStyle} className={classNames.treeItem}>
            <Tree
              loadData={node => this._loadData(node, 'left')}
              selectedKeys={[]}
              checkedKeys={leftSelectedKeys}
              onCheck={(checkedKeys, e) => this.onTreeCheckHandle(checkedKeys, 'left')}
              {...commonProps}
            >
              {this.renderLeftTreeNodes(dataSource)}
            </Tree>
          </div>
        </div>
        <div className={classNames.buttonGroup}>
          <Button
            disabled={leftSelectedKeys.length <= 0}
            className={classNames.button}
            size="small"
            type="primary"
            onClick={e => this.buttonClickHandle('toRight')}
          >
            {'>'}
          </Button>
          <Button
            disabled={rightSelectedKeys.length <= 0}
            className={classNames.button}
            size="small"
            type="primary"
            onClick={e => this.buttonClickHandle('toLeft')}
          >
            {'<'}
          </Button>
        </div>
        <div className={classNames.treeContainer}>
          <h3 className={classNames.title}>已选类目</h3>
          <div style={treeItemStyle} className={classNames.treeItem}>
            <Tree
              ref={ref => this.rightTreeRef = ref}
              loadData={node => this._loadData(node, 'right')}
              selectedKeys={[]}
              checkedKeys={rightSelectedKeys}
              onCheck={(checkedKeys, e) => this.onTreeCheckHandle(checkedKeys, 'right')}
              {...commonProps}
            >
              {this.renderRightTreeNodes(dataSource)}
            </Tree>
          </div>
        </div>
      </div>
    )
  }
}
