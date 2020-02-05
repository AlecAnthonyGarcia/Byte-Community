import React from 'react';

import { connect } from 'react-redux';

import { register } from '../authActions';

import { Modal, Form, Input, Button, Icon, Alert } from 'antd';

import AnalyticsUtil from '../../utils/AnalyticsUtil';

class SignupModal extends React.Component {
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
		const { form, register, googleToken } = this.props;

		e.preventDefault();

		form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				this.setState({ loading: true });

				const params = {
					...values,
					googleToken
				};

				register(params).then(response => {
					this.setState({ loading: false });

					const { error } = response;

					if (error) {
						this.handleError(error);
					} else {
						AnalyticsUtil.track('Signup');
					}
				});
			}
		});
	};

	handleError = error => {
		const { code } = error;

		switch (code) {
			case 1300:
				this.setState({
					errorMessageText: 'The Google code you provided was invalid.'
				});
				break;
			case 1402:
				this.setState({
					errorMessageText: 'This username is already taken.'
				});
				break;
			default:
				this.setState({
					errorMessageText: 'There was an unknown error.'
				});
		}
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

		form.setFieldsValue({ username: '' });
	};

	render() {
		const { isOpen, form } = this.props;
		const { getFieldDecorator } = form;
		const { loading, errorMessageText } = this.state;

		return (
			<Modal
				visible={isOpen}
				title="Create your account"
				centered
				footer={null}
				onCancel={this.onCancel}
			>
				<Form onSubmit={this.handleSubmit}>
					{errorMessageText !== null && (
						<Alert message={errorMessageText} type="error" />
					)}

					<div>
						<Form.Item>
							{getFieldDecorator('username', {
								rules: [
									{
										required: true,
										message: 'Username cannot be empty.'
									}
								]
							})(
								<Input
									prefix={
										<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
									}
									placeholder="Username"
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
								Sign me up
							</Button>
						</Form.Item>

						<span>
							By signing up you are agreeing to the{' '}
							<a href="https://byte.co/terms">byte terms of service</a>
						</span>
					</div>
				</Form>
			</Modal>
		);
	}
}

function mapStateToProps(state) {
	const { authReducer } = state;
	const { googleToken } = authReducer;
	return {
		googleToken
	};
}

const WrappedForm = Form.create({ name: 'signup' })(SignupModal);

export default connect(mapStateToProps, { register })(WrappedForm);
