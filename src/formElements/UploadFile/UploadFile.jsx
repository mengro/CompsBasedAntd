import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Upload, Icon, message, Button } from 'antd'
import * as classNames from './UploadFile.less'

class UploadFile extends Component {
  static propTypes = {
    limit: PropTypes.any,
    callback: PropTypes.func,
    uploadHandle: PropTypes.func,
    onChange: PropTypes.func,
    value: PropTypes.any,
    action: PropTypes.string,
    antdOptions: PropTypes.object,
    allowTypeList: PropTypes.array,
  }
  state = {
    fileList: [],
    uploading: false,
  }
  componentWillUnmount() {
    this.setState({
      fileList: [],
      uploading: false,
    })
  }
  uploadFn = async () => {
    const { fileList } = this.state
    const formData = new FormData()
    fileList.forEach((file) => {
      formData.append('importFile', file)
    })
    this.props.uploadHandle(formData)
      .then(res => {
        message.success('上传成功')
        return res
      })
      .then(this.props.callback)
      .catch(err => {
        this.setState({
          uploading: false,
        })
        message.error('上传失败')
      })
  }
  onRemove = file => {
    this.setState((state) => {
      const index = state.fileList.indexOf(file)
      const newFileList = state.fileList.slice()
      newFileList.splice(index, 1)
      return {
        fileList: newFileList,
      }
    })
  }
  beforeUpload = (file) => {
    const { allowTypeList, limit = null } = this.props
    const type = file.name.slice(file.name.lastIndexOf('.') + 1).toLowerCase()
    if (allowTypeList instanceof Array && allowTypeList.indexOf(type) < 0) {
      return message.error(`请上传${allowTypeList.join('、')}格式的文件`)
    }
    if (limit && this.state.fileList.length > limit) {
      return false
    }
    const fileList = [...this.state.fileList, file]
    this.props.onChange(fileList.map(item => item.name))
    this.setState({
      fileList,
    })
    return false
  }
  render() {
    const { action, antdOptions, limit } = this.props
    const { fileList } = this.state
    return (
      <Upload
        name="uploadFile"
        action={action}
        fileList={fileList}
        beforeUpload={this.beforeUpload}
        onRemove={this.onRemove}
        {...antdOptions}
        className={classNames.container}
      >
        <Button
          className={classNames.button}
          disabled={limit <= fileList.length}
        >
          <Icon type="upload" /> 上传
        </Button>
      </Upload>
    )
  }
}

export {
  UploadFile
}
