import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { signOut } from "../../actions";

/**
 * A header menu to navigates user to different routes
 */
class Header extends React.Component {
  onSignOutClick = event => {
    event.preventDefault();
    this.props.signOut();
  };

  renderEmployee() {
    if (this.props.auth.adminLevel >= 5) {
      return (
        <Link to="/dashboard/employee/new" className=" item">
          Employee
        </Link>
      );
    }
  }

  render() {
    return (
      <div className="ui menu">
        <Link to="/dashboard" className=" item">
          Inventory
        </Link>
        {this.renderEmployee()}
        <Link to="/dashboard/Log" className="item">
          Log
        </Link>
        <div className="right menu">
          <a onClick={this.onSignOutClick} className="ui item">
            <i className="sign out alternate icon" />
            Logout
          </a>
        </div>
      </div>
    );
  }
}

Header.propTypes = {
  signOut: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

// To gain access of the state from the reducers
const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { signOut }
)(Header);
