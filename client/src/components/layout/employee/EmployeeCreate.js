import React from "react";
import { connect } from "react-redux";
import { createEmployee } from "../../../actions";
import EmployeeForm from "./EmployeeForm";
import Modal from "../../Modal";
import Footer from "../Footer";

/**
 * A page to create employee
 * Contain createEmployee action
 */
class EmployeeCreate extends React.Component {
  renderActions() {
    return (
      <React.Fragment>
        <button className="ui primary button">Create</button>
        <button className="ui button">Cancel</button>
      </React.Fragment>
    );
  }

  // Call the action and send the parameters to database
  onSubmit = formValues => {
    console.log(formValues);
    this.props.createEmployee(formValues, 3);
  };

  render() {
    return (
      <div className="main ui container">
        <EmployeeForm action="create" onSubmit={this.onSubmit} />
        {/* <Modal
          title="Create Employee"
          content="Are you sure you want to add this employee?"
          actions={this.renderActions()}
          onDismiss={() => history.push("/dashboard/employee/new")}
        /> */}
        <Footer />
      </div>
    );
  }
}

export default connect(
  null,
  { createEmployee }
)(EmployeeCreate);
