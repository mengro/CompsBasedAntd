import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Input } from 'antd'

export default class FormUpload extends Component {
  static propTypes = {
    action: PropTypes.string,
  }

  render() {
    const { action } = this.props
    return (
      <form name="upload" action={action}  method="post" encType="multipart/form-data">
        <Input type="file" name="importFile" />
        <Button htmlType="submit">提交</Button>
      </form>
    )
  }
}

export {
  FormUpload
}
