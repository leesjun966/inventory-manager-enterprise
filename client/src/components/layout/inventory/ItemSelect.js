import React from "react";
import RenderTable from "./RenderTable";
import HeaderMenu from "../HeaderMenu";
import Footer from "../Footer";

/**
 * To render only the specific item id
 */
class ItemSelect extends React.Component {
  renderItem(props) {
    if (props.term === "Log") {
      return (
        <RenderTable baseURL="crud/getFlow" term={props.term} id={props.id} />
      );
    } else {
      return (
        <RenderTable
          baseURL="crud/getSpecific"
          term={props.term}
          id={props.id}
        />
      );
    }
  }
  render() {
    const item = this.props.match.params;

    return (
      <div className="main ui container" style={{ marginTop: "10px" }}>
        <HeaderMenu />
        <div className="ui segment">{this.renderItem(item)}</div>
        <Footer />
      </div>
    );
  }
}

export default ItemSelect;
