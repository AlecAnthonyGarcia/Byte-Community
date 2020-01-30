import React from 'react';

import { connect } from 'react-redux';

import { authenticate } from '../authActions';

import { Modal, Form, Input, Button, Icon, Alert } from 'antd';

class LoginModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.getInitialState();
	}

	getInitialState = () => {
		return {
			loading: false,
			errorMessageText: null
		};
	};

	handleSubmit = e => {
		const { form, authenticate } = this.props;

		e.preventDefault();

		form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				this.setState({ loading: true });

				authenticate(values).then(authToken => {
					this.setState({ loading: false });

					if (!authToken) {
						this.setState({
							errorMessageText: 'The Google code you provided was invalid.'
						});
					}
				});
			}
		});
	};

	onCancel = () => {
		const { onClose } = this.props;

		this.resetModal();

		if (onClose) {
			onClose();
		}
	};

	resetModal = () => {
		const { form } = this.props;

		this.setState(this.getInitialState());

		form.setFieldsValue({ code: '' });
	};

	render() {
		const { isOpen, form } = this.props;
		const { getFieldDecorator } = form;
		const { loading, errorMessageText } = this.state;

		return (
			<Modal
				visible={isOpen}
				title="Login to byte"
				centered
				footer={null}
				onCancel={this.onCancel}
			>
				<Form onSubmit={this.handleSubmit}>
					{errorMessageText !== null && (
						<Alert message={errorMessageText} type="error" />
					)}

					<p>Please paste the code that Google asked you to copy:</p>

					<Form.Item>
						{getFieldDecorator('code', {
							rules: [
								{
									required: true,
									message: 'Code cannot be empty.'
								},
								{
									pattern: new RegExp('^4/'),
									message: 'Invalid code format.'
								}
							]
						})(
							<Input
								prefix={
									<Icon type="google" style={{ color: 'rgba(0,0,0,.25)' }} />
								}
								placeholder="Code"
								size="large"
							/>
						)}
					</Form.Item>

					<Form.Item>
						<Button
							block
							size="large"
							type="primary"
							htmlType="submit"
							loading={loading}
						>
							Login
						</Button>
					</Form.Item>
				</Form>
			</Modal>
		);
	}
}

const WrappedForm = Form.create({ name: 'login' })(LoginModal);

export default connect(null, { authenticate })(WrappedForm);
