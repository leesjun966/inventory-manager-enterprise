import _ from "lodash";
import React from "react";
import { connect } from "react-redux";
import { fetchData, editData } from "../../../actions";
import EmployeeForm from "./EmployeeForm";
import Footer from "../Footer";

/**
 * A page to edit the employee information
 * Contain fetchData and editData actions
 */
class EmployeeEdit extends React.Component {
  // fetchData => action is called everytime before the page is rendered
  // so that the information will not lost after the user refresh the page
  componentDidMount() {
    const employeeID = { usr_id: this.props.match.params.id };
    this.props.fetchData(employeeID, "/admin/getUser");
  }

  // editData => action is called once the user clicked on the proceed button
  // the new value that has been edited is sent to the backend
  onSubmit = formValues => {
    const editSelected = {
      newVal: formValues,
      usr_id: this.props.match.params.id
    };

    this.props.editData(editSelected, "/admin/editUser", 3);
  };

  render() {
    const item = this.props.employee;
    if (!this.props.employee) {
      return <div> Loading ... </div>;
    }

    return (
      <div className="main ui container">
        <EmployeeForm
          initialValues={{
            username: item.Username,
            fam_name: item.Family_Name,
            giv_name: item.Given_Name,
            position: item.Position,
            admin_level: item.Admin_Level
          }}
          id={this.props.match.params.id}
          action="edit"
          onSubmit={this.onSubmit}
        />
        <Footer />
      </div>
    );
  }
}

// To gain access of the state from the reducers
const mapStateToProps = (state, ownProps) => {
  return { employee: state.datas[ownProps.match.params.id] };
};

export default connect(
  mapStateToProps,
  { fetchData, editData }
)(EmployeeEdit);
