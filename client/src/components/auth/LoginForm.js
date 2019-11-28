import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { signIn } from "../../actions";
import logo from "../download.png";

/**
 * A login page for user to input their username and password
 * Contain signIn action
 */
class LoginForm extends React.Component {
  constructor() {
    super();

    this.state = {
      username: "",
      password: "",
      errors: null
    };
  }

  // If user has already logged in and user navigates to Login page, should redirect them to homepage
  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  // If the user sign in with a valid account, should prompt to the homepage
  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }

  onInputChange = event => {
    this.setState({ [event.target.id]: event.target.value });
  };

  // Send the username and password for verification with backend server
  onFormSubmit = event => {
    event.preventDefault();
    const userData = {
      username: this.state.username,
      password: this.state.password
    };

    this.props.signIn(userData);
  };

  // If the backend send an error either with invalid username or password
  // will prompt error to notify the user
  renderUserError() {
    if (this.props.errors === "User Does Not Exist") {
      return <p className="ui negative message">{this.state.errors}</p>;
    }
  }

  renderPasswordError() {
    if (this.props.errors === "Incorrect Password") {
      return <p className="ui negative message">{this.state.errors}</p>;
    }
  }

  render() {
    const { username, password } = this.state;
    return (
      <div
        style={{ marginTop: "180px" }}
        className="ui middle aligned center aligned page grid"
      >
        <div className="eight wide column ">
          <h2 className=" ui teal image header">
            <img alt="company logo" src={logo} className="image" />
            <div className="content">Log-in to your account</div>
          </h2>
          <form onSubmit={this.onFormSubmit} className="ui large form warning">
            <div className="ui stacked segment">
              {/*  Username input */}
              <div className="field">
                <div className="ui left icon input">
                  <i className="user icon" />
                  <input
                    onChange={this.onInputChange}
                    value={username}
                    autoComplete="off"
                    id="username"
                    type="text"
                    placeholder="Username"
                  />
                </div>
              </div>
              {this.renderUserError()}

              {/* Password input */}
              <div className="field">
                <div className="ui left icon input">
                  <i className="lock icon" />
                  <input
                    onChange={this.onInputChange}
                    value={password}
                    id="password"
                    type="password"
                    placeholder="Password"
                  />
                </div>
              </div>
              {this.renderPasswordError()}
              <button className="ui fluid large teal submit button">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

LoginForm.propTypes = {
  signIn: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

// To gain access of the state from the reducers
const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { signIn }
)(LoginForm);
