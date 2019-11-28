import React from "react";
import logo from "../download.png";

/**
 * A footer which will be shown in every pages
 */
class Footer extends React.Component {
  render() {
    return (
      <div className="ui section divider">
        <div className="ui vertical footer bottom segment">
          <div className="ui center aligned container">
            <img src={logo} className="ui centered mini image" />
            <div className="ui horizontal  small divided link list">
              <a className="item" href="#">
                Powered by HeartCore
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Footer;
