import _ from "lodash";
import React from "react";
import { connect } from "react-redux";
import { fetchData, editData } from "../../../actions";
import InventoryForm from "./InventoryForm";
import Spinner from "../Spinner";
import Footer from "../Footer";

/**
 * A page to edit the selected item
 * Contain fetchData and editData actions
 */
class InventoryEdit extends React.Component {
  // fetchData => action is called everytime before the page is rendered
  // so that the information will not lost after the user refresh the page
  componentDidMount() {
    const itemSelect = {
      col_id: this.props.match.params.id,
      table: "Inventory"
    };
    this.props.fetchData(itemSelect, "/crud/getRow");
  }

  // editData => action is called once the user clicked on the proceed button
  // the new value that has been edited is sent to the backend
  onSubmit = formValues => {
    const editSelected = {
      table: "Inventory",
      newVal: formValues,
      id: this.props.match.params.id
    };

    this.props.editData(editSelected, "/crud/editItem");
  };

  render() {
    const item = this.props.inventory;
    if (!this.props.inventory) {
      return (
        <div>
          <Spinner />
        </div>
      );
    }
    return (
      <div className="main ui container">
        <InventoryForm
          term="Inventory"
          initialValues={{
            Description: item.Description,
            Warehouse_Quantity: item.Warehouse_Quantity,
            Production_Quantity: item.Production_Quantity
          }}
          onSubmit={this.onSubmit}
        />
        <Footer />
      </div>
    );
  }
}

// To gain access of the state from the reducers
const mapStateToProps = (state, ownProps) => {
  return { inventory: state.datas[ownProps.match.params.id] };
};

export default connect(
  mapStateToProps,
  { fetchData, editData }
)(InventoryEdit);
