import React from "react";
import { Button, Card, Form, Icon, Input, InputNumber, Radio, Tooltip, Modal } from 'antd';
import { Redirect } from 'react-router';
import './home.css';
import agent from '../agent';
// import {inject, observer} from 'mobx-react';

let membershipInfo = {
  fixed_membership_fee: "",
  fixed_membership_fee_amount: "",
};

const FormItem = Form.Item;
const rentRange = {
  week: {
    min: 25,
    max: 2000,
  },
  month: {
    min: 110,
    max: 8660,
  }
};

// @inject("flatbondStore")
// @observer
class Home extends React.Component {

  state = {
    rent: null,
    membershipFee: null,
    postCode: "",
    rentRange: {
      min: rentRange.week.min,
      max: rentRange.week.max,
    },
    period: "week",
    show: false,
  }

  handleMembershipFee(value) {
    let vat = 0.2;
    let rent = value;
    let fee;
    if (rent <= 120 && rent >= 0) {
      rent = 120;
    } else if (membershipInfo.fixed_membership_fee) {
      rent = membershipInfo.fixed_membership_fee_amount/100;
    }
    if (this.state.period === "month") {
      fee = rent + ((rent / 4) * vat);
    } else if (this.state.period === "week") {
      fee = rent + (rent * vat);
    }
    this.setState({
      rent: value,
      membershipFee: fee.toFixed(2)
    });
  }

  validateRent = (rule, value, callback) => {
    let minRent = this.state.rentRange.min;
    let maxRent = this.state.rentRange.max;
    if (value < minRent || value > maxRent) {
      if (this.state.period === "week") {
        callback(`The week's rent should be between £${rentRange.week.min} and £${rentRange.week.max}`);
      } else if (this.state.period === "month") {
        callback(`The month's rent should be between £${rentRange.month.min} and £${rentRange.month.max}`);
      } 
    } else {
      callback();
    }
  }

  handleNumberChange = (value) => {
    let minRent = this.state.rentRange.min;
    let maxRent = this.state.rentRange.max;
    if (value >= minRent && value <= maxRent) {
      this.handleMembershipFee(value);
      return;
    }
    return;
  }

  handleRentPeriods = (e) => {
    this.props.form.resetFields('rent');
    if (e.target.value === "week") {
      this.setState({
        rent: {
          min: rentRange.week.min,
          max: rentRange.week.max,
        },
        membershipFee: null,
        period: "week"
      });
    } else if (e.target.value === "month") {
      this.setState({
        rentRange: {
          min: rentRange.month.min,
          max: rentRange.month.max,
        },
        membershipFee: null,
        period: "month"
      });
    }
  }

  onChangePostcode = (e) => {
    this.setState({ postCode: e.target.value });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.handleCreate();
      }
    });
  }
  
  handleCreate() {
    agent.post('https://cxynbjn3wf.execute-api.eu-west-2.amazonaws.com/production/flatbond')
      .then((res)=>{
        if (res.status === 'created') {
          this.setState({
            show: true,
          });
        } else {
          Modal.error({
            title: 'Error',
            content: 'Please ensure to your network connect.',
          });
        }
      });
  }

  getConfig() {
    agent.get('https://cxynbjn3wf.execute-api.eu-west-2.amazonaws.com/production/config')
      .then((res)=>{
        membershipInfo.fixed_membership_fee = res.fixed_membership_fee;
        membershipInfo.fixed_membership_fee_amount = res.fixed_membership_fee_amount;
      });
  }

  componentDidMount() {
    // TODO: Use observable is better.
    this.getConfig();
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 14 },
        sm: { span: 16 },
      },
    };

    const formTailLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 4,
        },
      },
    };

    if (this.state.show){
      return <Redirect to={{
        pathname: '/show',
        rent: this.state.rent,
        rentFrequency: this.state.period,
        membershipfee: this.state.membershipFee,
        postcode: this.state.postCode,
      }}
      />;
    }

    const btnPeriods =
      <Radio.Group defaultValue="week" onChange={this.handleRentPeriods}>
        <Radio.Button value="week">
          Weekly 
          <Tooltip title={`The week's rent should be between £${rentRange.week.min} and £${rentRange.week.max}`}>
            <Icon type="info-circle-o" />
          </Tooltip>
        </Radio.Button>
        <Radio.Button value="month">
          Monthly 
          <Tooltip title={`The month's rent should be between £${rentRange.month.min} and £${rentRange.month.max}`}>
            <Icon type="info-circle-o" />
          </Tooltip>
        </Radio.Button>
      </Radio.Group>;

    return (
      <React.Fragment>
        <Card className="card" title="Create Flatbond" bordered={false}>
          <Form id="bondInfo" onSubmit={this.handleSubmit}>
            <Form.Item {...formItemLayout}
              label="Rent"
            >
              {getFieldDecorator('rent', {
                rules: [{
                  required: true, message: 'Please input Rent!', type: 'number',
                },{
                  validator: this.validateRent,
                }
                ],
              })(
                <InputNumber
                  formatter={value => `£ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/£\s?|(,*)/g, '')}
                  onChange={this.handleNumberChange}
                  style={{ width: '25%', marginRight: '3%' }}
                />
              )}
              {btnPeriods}
            </Form.Item>
            <FormItem label="Membership fee" {...formItemLayout}>
              £{this.state.membershipFee}
            </FormItem>
            <FormItem label="Post code" {...formItemLayout}>
              {getFieldDecorator('postcode', {
                rules: [{
                  required: true, message: 'Please input Post code!',
                }],
              })(
                <Input
                  onChange={this.onChangePostcode}
                  type="text"
                  style={{ width: '25%', marginRight: '3%' }}
                />
              )}
            </FormItem>
            <Form.Item {...formTailLayout}>
              <Button
                type="primary"
                htmlType="submit"
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </React.Fragment>
    );
  }
}

export default Form.create()(Home);

