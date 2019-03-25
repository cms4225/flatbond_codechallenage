import React from "react";
import { Button, Card, Form } from 'antd';
import { Redirect } from 'react-router';
const FormItem = Form.Item;

class ShowFlatbond extends React.Component {

  state = {
    create: false,
  }

  createFlatbond() {
    this.setState({
      create: true,
    });
  }

  render() {

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
          offset: 0,
        },
      },
    };

    if (this.state.create){
      return <Redirect to="/home"/>;
    }

    return (
      <React.Fragment>
        <Card className="card" title="Flatbond Information" bordered={false}>
          <Form >
            <Form.Item {...formTailLayout}>
              <Button onClick={this.createFlatbond.bind(this)}>Create New Flatbond</Button>
            </Form.Item>
            <Form.Item {...formItemLayout}
              label="Rent"
            >
              £{this.props.location.rent}
            </Form.Item>
            <Form.Item {...formItemLayout}
              label="Rent Frequency"
            >
              {this.props.location.rentFrequency}
            </Form.Item>
            <FormItem label="Membership fee" {...formItemLayout}>
              £{this.props.location.membershipfee}
            </FormItem>
            <FormItem label="Post code" {...formItemLayout}>
              {this.props.location.postcode}
            </FormItem>
          </Form>
        </Card>
      </React.Fragment>

    );
  }
}

export default Form.create()(ShowFlatbond);

