import React from "react";
import { Field, reduxForm } from "redux-form";
import HeaderMenu from "../HeaderMenu";
import { connect } from "react-redux";
import EmployeeDelete from "./EmployeeDelete";
import history from "../../Route/History";

/**
 * To create a redux-form that can be used with create and edit user
 */
class EmployeeForm extends React.Component {
  // The form field will turn red if there is an error
  renderError({ error, touched }) {
    if (touched && error) {
      return <div className="ui red input">{error}</div>;
    }
  }

  // To render the form with user input type
  renderInput = ({ input, label, meta, placeholder, autocomplete, type }) => {
    const className = `field ${meta.error && meta.touched ? "error" : ""}`;
    return (
      <div className={className}>
        <label>{label}</label>
        <input
          type={type}
          autoComplete={autocomplete}
          placeholder={placeholder}
          {...input}
        />
        {this.renderError(meta)}
      </div>
    );
  };

  // To render the form with selection type
  renderSelect = ({ input, label, meta, children }) => {
    const className = `field ${meta.error && meta.touched ? "error" : ""}`;
    return (
      <div className={className}>
        <label>{label}</label>
        <select className="ui search selection dropdown" {...input}>
          {children}
        </select>
        {this.renderError(meta)}
      </div>
    );
  };

  onSubmit = formValues => {
    this.props.onSubmit(formValues);
  };

  // To render the form with password type
  renderPassword() {
    return (
      <Field
        name="password"
        label="Password"
        placeholder="Password"
        type="password"
        autocomplete="new-password"
        component={this.renderInput}
      />
    );
  }

  // To make only the highest level of administrative will show the password field
  // or when the user is in creating mode
  renderEmployeePassword() {
    if (this.props.action === "create") {
      return this.renderPassword();
    }
    if (
      this.props.adminLevel === 10 ||
      this.props.user === this.props.employee.Username
    ) {
      return this.renderPassword();
    }
  }

  // Only editing mode will show the delete user button
  renderDelete() {
    if (this.props.action === "edit") {
      return <EmployeeDelete id={this.props.id} />;
    }
  }

  renderCancel() {
    if (this.props.action === "edit") {
      return (
        <React.Fragment>
          <button
            type="button"
            onClick={() => history.goBack()}
            className="ui button"
          >
            Cancel
          </button>
        </React.Fragment>
      );
    }
  }

  render() {
    return (
      <div className="main ui container" style={{ marginTop: "10px" }}>
        <HeaderMenu />
        {this.renderDelete()}

        <div className="ui segment" style={{ marginTop: "60px" }}>
          <form
            onSubmit={this.props.handleSubmit(this.onSubmit)}
            className="ui form error"
          >
            <h4 className="ui dividing header">Employee Information</h4>

            <div className="two fields">
              <Field
                name="username"
                label="Username"
                placeholder="Username"
                type="text"
                autocomplete="off"
                component={this.renderInput}
              />

              {this.renderEmployeePassword()}
            </div>

            <div className="field">
              <label>Name</label>
              <div className="two fields">
                <Field
                  name="fam_name"
                  placeholder="Family Name"
                  type="text"
                  autocomplete="off"
                  component={this.renderInput}
                />
                <Field
                  name="giv_name"
                  placeholder="Given Name"
                  type="text"
                  autocomplete="off"
                  component={this.renderInput}
                />
              </div>
            </div>
            <div className="fields">
              <Field
                name="position"
                label="Position"
                placeholder="Position"
                component={this.renderSelect}
              >
                <option />
                />
                <option value="Warehouse Helper">Warehouse Helper</option>
                <option value="Warehouse Manager">Warehouse Manager</option>
                <option value="Warehouse Tester">Warehouse Tester</option>
              </Field>
              <Field
                name="admin_level"
                label="Admin Level"
                placeholder="Select Admin Level"
                component={this.renderSelect}
              >
                <option />
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
              </Field>
            </div>

            <button type="submit" className="ui button primary">
              Submit
            </button>
            {this.renderCancel()}
          </form>
        </div>
      </div>
    );
  }
}

// If any of the input is empty, will show errors
const validate = formValues => {
  const errors = {};

  if (!formValues.username) {
    errors.username = "*Username is required";
  }
  if (!formValues.password) {
    errors.password = "*Password is required";
  }
  if (!formValues.fam_name) {
    errors.fam_name = "*Family Name is required";
  }
  if (!formValues.giv_name) {
    errors.giv_name = "*Given Name is required";
  }
  if (!formValues.position) {
    errors.position = "*Position is required";
  }
  if (!formValues.admin_level) {
    errors.admin_level = "*Admin Level is required";
  }
  return errors;
};

// To gain access of the state from the reducers
const mapStateToProps = (state, ownProps) => {
  return {
    adminLevel: state.auth.adminLevel,
    user: state.auth.user,
    employee: state.datas[ownProps.id]
  };
};

const formWrapped = reduxForm({
  form: "EmployeeForm",
  validate
})(EmployeeForm);

export default connect(mapStateToProps)(formWrapped);
