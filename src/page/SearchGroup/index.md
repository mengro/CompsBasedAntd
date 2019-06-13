### searchGroup组件（细节未完善）

+ 基于antd进行二次封装；
+ 用于react后台中table的搜索模块

### 栗子
##### 配置
```
    this.state = {
      sourceData: [
        {
          //  下拉框
          key: 'auditStatus',
          type: 'select',
          label: '审核状态',
          data: [
            {
              key: 'gegejia', // 可省略
              label: '格格家',
              value: 'gegejia',
            },
            {
              key: 'bushou',
              label: '环球捕手',
              value: 'bushou',
            }
          ],
        },{
          //  可搜索下拉框
          key: 'brand',
          type: 'select',
          label: '品牌',
          antdOptions: {
            showSearch: true,
            optionFilterProp: 'children',
          },
          data: [
            {
              key: 'gegejia', // 可省略
              label: '格格家',
              value: 'gegejia',
            },
            {
              key: 'bushou',
              label: '环球捕手',
              value: 'bushou',
            }
          ],
        },{
          //  输入框
          key: 'propertyId',
          type: 'input',
          label: '属性项ID',
        },{
          //  日期范围选择（两个组合在一起，第二个不传label）
          key: 'commitAuditTimeStart',
          type: 'dateTime',
          label: '提交审核时间',
        },{
          key: 'commitAuditTimeEnd',
          type: 'dateTime',
        },{
          //  多选框组
          key: 'propertyType',
          type: 'checkbox',
          label: '属性项类型',
          data: [
            {
              value: 'mainProp',
              label: '关键属性',
            }, {
              value: 'saleProp',
              label: '销售属性',
            }, {
              value: 'goodsProp',
              label: '商品属性',
            }
          ],
        },
        {
          key: 'filterCategory',
          label: '筛选类目',
          type: 'linkageSelect',
          option: {
            getDataList: this.getCategoryData,
            length: 4,
            initCode: '0',
          },
        },
      ]
    }

    getCategoryData(code) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          let result = null
          switch(code) {
          case '0':
            result = [{label: '111', value: '111'}, {label: '222', value: '222'}]
            break
          case '111':
            result = [{label: 'qqq', value: 'qqq'}, {label: 'eee', value: 'eee'}]
            break
          case 'qqq':
            result = [{label: '666', value: '666'}, {label: '777', value: '777'}]
            break
          case '777':
            result = [{label: 'uuu', value: 'uuu'}, {label: 'jjj', value: 'jjj'}]
            break
          }
          resolve(result)
        })
      })
    }
```
##### 调用
```
  render() {
    const { sourceData } = this.state
    return (
      <SearchGroup 
        sourceData={sourceData}
      >
      </SearchGroup>
    )
  }
```
### 说明

+ 通过antdOptions字段接收antd组件的配置项
