import React from "react";
import { Field, reduxForm } from "redux-form";
import HeaderMenu from "../HeaderMenu";
import history from "../../Route/History";
/**
 * To create a redux-form that can be used with ProductionEdit, WarehouseEdit, and InventoryEdit
 */
class InventoryForm extends React.Component {
  renderError({ error, touched }) {
    if (touched && error) {
      return <div className="ui red input">{error}</div>;
    }
  }

  // To render the form with user input type
  renderInput = ({
    input,
    label,
    meta,
    placeholder,
    autocomplete,
    type,
    maxLength
  }) => {
    const className = `field ${meta.error && meta.touched ? "error" : ""}`;
    return (
      <div className={className}>
        <label>{label}</label>
        <input
          type={type}
          autoComplete={autocomplete}
          placeholder={placeholder}
          maxLength={maxLength}
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
        <select className="ui fluid search dropdown" {...input}>
          {children}
        </select>
        {this.renderError(meta)}
      </div>
    );
  };

  onSubmit = formValues => {
    this.props.onSubmit(formValues);
  };

  // render the information that can be edit based on either warehouse, production or inventory
  renderForm() {
    if (this.props.term === "Warehouse") {
      return (
        <React.Fragment>
          <div className="four wide field">
            <Field
              name="Quantity"
              label="Quantity"
              placeholder="Quantity"
              type="text"
              autocomplete="off"
              component={this.renderInput}
              maxLength="11"
            />
          </div>

          <div className=" four wide field">
            <Field
              name="Register_By"
              label="Register_By"
              placeholder="Register_By"
              type="text"
              autocomplete="off"
              component={this.renderInput}
              maxLength="4"
            />
          </div>
          <div className=" four wide field">
            <Field
              name="Supply_By"
              label="Supply_By"
              placeholder="Supply_By"
              type="text"
              autocomplete="off"
              component={this.renderInput}
              maxLength="4"
            />
          </div>
        </React.Fragment>
      );
    } else {
      if (this.props.term === "Production") {
        return (
          <React.Fragment>
            <div className="four wide field">
              <Field
                name="Quantity"
                label="Quantity"
                placeholder="Quantity"
                type="text"
                autocomplete="off"
                component={this.renderInput}
                maxLength="11"
              />
            </div>

            <div className=" four wide field">
              <Field
                name="Employee"
                label="Employee"
                placeholder="Employee"
                type="text"
                autocomplete="off"
                component={this.renderInput}
                maxLength="4"
              />
            </div>
          </React.Fragment>
        );
      }
    }

    if (this.props.term === "Inventory") {
      return (
        <div className="four wide field">
          <Field
            name="Description"
            label="Description"
            placeholder="Description"
            type="text"
            autocomplete="off"
            component={this.renderInput}
            maxLength="11"
          />
        </div>
      );
    }
  }

  render() {
    return (
      <div className="main ui container" style={{ marginTop: "10px" }}>
        <HeaderMenu />
        <div className="ui segment" style={{ marginTop: "30px" }}>
          <form
            onSubmit={this.props.handleSubmit(this.onSubmit)}
            className="ui form error"
          >
            <h4 className="ui dividing header">
              {`${this.props.term} Information`}
            </h4>
            {this.renderForm()}
            <div>
              <button className="ui button primary">Submit</button>
              <button
                type="button"
                onClick={() => history.goBack()}
                className="ui button"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

// If any of the input is empty, will show errors
const validate = formValues => {
  const errors = {};

  if (!formValues.quantity) {
    errors.quantity = "*Quantity is required";
  }
  if (!formValues.employee) {
    errors.employee = "*Employee is required";
  }
  // if (!formValues.fam_name) {
  //   errors.fam_name = "*Family Name is required";
  // }
  // if (!formValues.giv_name) {
  //   errors.giv_name = "*Given Name is required";
  // }
  // if (!formValues.position) {
  //   errors.position = "*Position is required";
  // }
  // if (!formValues.admin_level) {
  //   errors.admin_level = "*Admin Level is required";
  // }
  return errors;
};

export default reduxForm({
  form: "inventoryForm",
  validate
})(InventoryForm);
