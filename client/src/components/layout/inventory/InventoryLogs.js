import React from "react";
import RenderTable from "./RenderTable";
import HeaderMenu from "../HeaderMenu";
import Footer from "../Footer";

/**
 * A page to display the inventory logs
 */
class InventoryLogs extends React.Component {
  render() {
    return (
      <div className="main ui container" style={{ marginTop: "10px" }}>
        <HeaderMenu />
        <div className="ui segment">
          <RenderTable term="Log" baseURL="/crud/getTable" />
        </div>
        <Footer />
      </div>
    );
  }
}

export default InventoryLogs;
