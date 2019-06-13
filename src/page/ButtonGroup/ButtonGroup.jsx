import React from 'react'
import PropTypes from 'prop-types'
import { Button, message, Modal } from 'antd'
import * as classNames from './ButtonGroup.less'

const buttonClickHandle = (btn, {
  selectedRowKeys,
  selectedRows,
  resetRowSelection,
  queryList,
  setRowSelection,
  setSearchBarParams,
  resetSearchForm,
  resetHandle,
}) => {
  if (btn.checkSelection && selectedRowKeys.length <= 0) {
    return message.error('请先选择数据')
  }
  const callback = () => {
    if (btn.handle) {
      const returnValue = btn.handle({
        selectedRowKeys,
        selectedRows,
        resetRowSelection,
        queryList,
        setRowSelection,
        setSearchBarParams,
        resetSearchForm,
        resetHandle,
      })
      if (returnValue instanceof Promise) {
        returnValue
          .then(result => {
            resetRowSelection()
            if (btn.autoUpdateList) {
              queryList()
            }
          })
          .catch(err => console.log(err))
      }
    }
  }
  if (btn.requireConfirm) {
    Modal.confirm({
      content: btn.renderContent ? btn.renderContent(selectedRowKeys.length) : `已选择${selectedRowKeys.length}条数据，是否确认${btn.name}？`,
      onOk: close => {
        callback()
        close()
      },
      onCancel: close => close()
    })
  }else {
    callback()
  }
}

function ButtonGroup({
  config = [],
  selectedRowKeys,
  selectedRows,
  resetRowSelection,
  queryList,
  setRowSelection,
  setSearchBarParams,
  resetSearchForm,
  resetHandle,
}) {
  return (
    <div className={classNames.buttonGroupContainer}>
      {
        config instanceof Array && config.map(btn => {
          if (!btn) {
            return
          }
          if (btn.render) {
            return btn.render({
              selectedRowKeys,
              selectedRows,
              resetRowSelection,
              setRowSelection,
              queryList,
              setSearchBarParams,
              resetSearchForm,
              resetHandle,
            })
          }
          const ele = (
            <Button
              {...(btn.antdOptions || {})}
              onClick={e => buttonClickHandle(btn,
                {
                  selectedRowKeys,
                  selectedRows,
                  resetRowSelection,
                  queryList,
                  setRowSelection,
                  setSearchBarParams,
                  resetSearchForm,
                  resetHandle,
                }
              )}
              key={btn.key}
            >
              {btn.name}
            </Button>
          )
          return ele
        })
      }
    </div>
  )
}

ButtonGroup.propTypes = {
  config: PropTypes.array,
  selectedRowKeys: PropTypes.array,
  selectedRows: PropTypes.array,
  resetRowSelection: PropTypes.func,
  queryList: PropTypes.func,
  setRowSelection: PropTypes.func,
  setSearchBarParams: PropTypes.func,
  resetSearchForm: PropTypes.func,
  resetHandle: PropTypes.func,
}

export default ButtonGroup
export {
  ButtonGroup,
}
