import React from "react";
import HeaderMenu from "./HeaderMenu";
import Footer from "./Footer";
import InventoryNavigation from "./inventory/InventoryNavigation";
import InventoryNav from "./inventory/InventoryNav";

/**
 * The page rendered after user first logged in
 */
class HomePage extends React.Component {
  render() {
    return (
      <div className="main ui container" style={{ marginTop: "10px" }}>
        <HeaderMenu />
        <InventoryNavigation defaultIndex={this.props.location.state} />

        <Footer />
      </div>
    );
  }
}
export default HomePage;
