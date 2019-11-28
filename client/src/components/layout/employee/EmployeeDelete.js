import React from "react";
import { connect } from "react-redux";
import Modal from "../../Modal";
import { removeUser } from "../../../actions";

/**
 * A modal to handle the remove action of an user
 */
class EmployeeDelete extends React.Component {
  state = { show: false };

  // Initially the modal is set to false
  hideModal = () => {
    this.setState({ show: false });
  };

  // If delete user button is hit, then the modal will be shown
  showModal = () => {
    this.setState({ show: true });
  };

  // Contain the removeUser action and a cancel button
  renderActions() {
    const userID = { usr_id: this.props.employee.ID };
    return (
      <React.Fragment>
        <button
          onClick={() => this.props.removeUser(userID, 3)}
          className="ui negative button"
        >
          Delete
        </button>
        <button onClick={this.hideModal} className="ui button">
          Cancel
        </button>
      </React.Fragment>
    );
  }

  renderContent() {
    const employee = this.props.employee;

    if (!employee) {
      return "Are you sure you want to delete this employee?";
    }
    return `Are you sure you want to delete ${employee.Family_Name} ${employee.Given_Name}?`;
  }

  renderDeleteButton() {
    if (this.props.adminLevel >= 5) {
      return (
        <React.Fragment>
          <button
            type="button"
            onClick={this.showModal}
            className="ui right floated negative small button"
          >
            <i className="delete icon"></i>
            Delete User
          </button>
          <Modal
            show={this.state.show}
            handleClose={this.hideModal}
            title="Delete User"
            content={this.renderContent()}
            actions={this.renderActions()}
          />
        </React.Fragment>
      );
    }
  }

  render() {
    return <React.Fragment>{this.renderDeleteButton()}</React.Fragment>;
  }
}

// To gain access of the state from the reducers
const mapStateToProps = (state, ownProps) => {
  return {
    adminLevel: state.auth.adminLevel,
    employee: state.datas[ownProps.id]
  };
};

export default connect(
  mapStateToProps,
  { removeUser }
)(EmployeeDelete);
