import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Upload, Icon, message } from 'antd'
import {
  uploadImage,
} from '@/service/apis/commonApi'
import * as classNames from './UploadImage.less'

class UploadImage extends Component {
  static propTypes = {
    value: PropTypes.any,
    limitWidthAndHeight: PropTypes.any,
    onChange: PropTypes.func,
    antdOptions: PropTypes.object,
    allowTypeList: PropTypes.array,
  }
  uploadFn = async ({ onSuccess, onError, file }) => {
    const data = new FormData()
    data.append('file', file)
    uploadImage(data)
      .then(resData => {
        this.props.onChange(resData.url)
        onSuccess()
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
  render() {
    const { value, antdOptions } = this.props
    return (
      <Upload
        listType="picture-card"
        customRequest={this.uploadFn}
        beforeUpload={this.beforeUpload}
        showUploadList={false}
        {...antdOptions}
      >
        {
          value &&
          <div className={classNames.imageContainer}>
            <img src={value}/>
          </div>
        }
        {
          !value &&
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
  UploadImage
}
