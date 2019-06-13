import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Upload, Icon, message } from 'antd'
import { arrayTools } from '@lib/goods-admin-utils'

class MultipleUploadImage extends Component {
  constructor() {
    super()
    this.state = {
      fileList: [],
    }
  }
  static propTypes = {
    value: PropTypes.any,
    limit: PropTypes.number,
    limitWidthAndHeight: PropTypes.any,
    onChange: PropTypes.func,
    antdOptions: PropTypes.object,
    allowTypeList: PropTypes.array,
  }
  componentWillUpdate(nextProps) {
    const { value } = this.props
    const nextValue = nextProps.value
    if (!(nextValue instanceof Array)) {
      return
    }
    if (!arrayTools.looseEqual(nextValue, value)) {
      this.setState({
        fileList: nextValue.map(item => ({
          uid: new Date().valueOf(),
          url: item,
        }))
      })
    }
  }
  uploadHandle = async ({ onSuccess, onError, file }) => {
    const data = new FormData()
    data.append('file', file)
    const { uploadAPI } = this.props
    uploadAPI && uploadAPI(data)
      .then(resData => {
        if (resData.url) {
          file.url = resData.url
          onSuccess(file)
        }
      })
      .catch(err => {
        onError()
      })
  }
  beforeUpload = (file) => {
    const { allowTypeList = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'] } = this.props
    const fileType = file.type
    if (allowTypeList.indexOf(fileType) < 0) {
      message.error(`请上传${allowTypeList.map(item => item.replace('image/', '')).join('、')}格式的图片`)
      return false
    }
    const { limitWidthAndHeight } = this.props
    if (limitWidthAndHeight) {
      let result = false
      const img = new Image()
      img.src = window.URL.createObjectURL(file)
      return new Promise((resolve, reject) => {
        img.onload = function(){
          const width = img.width
          const height=img.height
          if (limitWidthAndHeight instanceof Array) {
            limitWidthAndHeight.forEach(item => {
              if (item.width === width && item.height === height) {
                result = true
              }
            })
          } else {
            if (limitWidthAndHeight.width === width && limitWidthAndHeight.height === height) {
              result = true
            }
          }
          if (!result) {
            message.error('图片尺寸不合法，请重新上传')
            reject()
          }else {
            resolve()
          }
        }
      })
    }
    return true
  }
  handleChange = ({ file, fileList}) => {
    const { onChange, limit } = this.props
    fileList = fileList.slice(- limit)
    fileList = fileList.filter(file => {
      if (file.response) {
        file.url = file.response.url
      }
      return file
    })
    this.setState({ fileList })
    onChange && onChange(fileList.filter(item => item.url).map(i => i.url))
  }

  render() {
    const { fileList } = this.state
    const { antdOptions, limit = 1 } = this.props
    return (
      <Upload
        listType="picture-card"
        customRequest={this.uploadHandle}
        beforeUpload={this.beforeUpload}
        showUploadList={true}
        fileList={fileList}
        onChange={this.handleChange}
        multiple
        {...antdOptions}
      >
        {
          fileList.length < limit &&
          <div>
            <Icon type="plus" />
            <div className="ant-upload-text">Upload</div>
          </div>
        }
      </Upload>
    )
  }
}

export {
  MultipleUploadImage
}
