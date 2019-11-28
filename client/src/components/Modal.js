import React from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { qrDownload } from "../actions";

/**
 * A pop up fragment to receive user actions
 * @param {String} props
 */
const Modal = props => {
  if (!props.show) {
    return null;
  }
  return ReactDOM.createPortal(
    <div
      onClick={props.handleClose}
      className="ui dimmer modals visible active"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="ui standard modal visible active"
      >
        <div className="header">{props.title}</div>
        <div className="content">{props.content}</div>
        <div className="actions">{props.actions}</div>
      </div>
    </div>,
    document.querySelector("#modal")
  );
};

// To gain access of the state from the reducers
const mapStateToProps = state => {
  return {
    qr: state.qr.qrcode
  };
};

export default connect(
  mapStateToProps,
  { qrDownload }
)(Modal);
