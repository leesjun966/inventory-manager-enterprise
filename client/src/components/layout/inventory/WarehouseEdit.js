import _ from "lodash";
import React from "react";
import { connect } from "react-redux";
import { fetchData, editData } from "../../../actions";
import InventoryForm from "./InventoryForm";
import Spinner from "../Spinner";

/**
 * A page to edit the selected item
 * Contain fetchData and editData actions
 */
class WarehouseEdit extends React.Component {
  // fetchData => action is called everytime before the page is rendered
  // so that the information will not lost after the user refresh the page
  componentDidMount() {
    const itemSelect = {
      col_id: this.props.match.params.id,
      table: "Warehouse"
    };
    this.props.fetchData(itemSelect, "/crud/getRow");
  }

  onSubmit = formValues => {
    const editSelected = {
      table: "Warehouse",
      newVal: formValues,
      id: this.props.match.params.id
    };

    this.props.editData(editSelected, "/crud/editItem", 1);
  };

  render() {
    const item = this.props.warehouse;
    if (!this.props.warehouse) {
      return (
        <div>
          <Spinner />
        </div>
      );
    }
    return (
      <div>
        <InventoryForm
          term="Warehouse"
          initialValues={{
            Quantity: item.Quantity,
            Register_By: item.Register_By,
            Supply_By: item.Supply_By
          }}
          onSubmit={this.onSubmit}
        />
      </div>
    );
  }
}

// To gain access of the state from the reducers
const mapStateToProps = (state, ownProps) => {
  return { warehouse: state.datas[ownProps.match.params.id] };
};

export default connect(
  mapStateToProps,
  { fetchData, editData }
)(WarehouseEdit);
