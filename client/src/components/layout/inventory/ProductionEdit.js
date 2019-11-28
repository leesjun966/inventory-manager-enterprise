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
class ProductionEdit extends React.Component {
  componentDidMount() {
    const itemSelect = {
      col_id: this.props.match.params.id,
      table: "Production"
    };
    this.props.fetchData(itemSelect, "/crud/getRow");
  }

  onSubmit = formValues => {
    const editSelected = {
      table: "Production",
      newVal: formValues,
      id: this.props.match.params.id
    };

    this.props.editData(editSelected, "/crud/editItem", 2);
  };

  render() {
    const item = this.props.production;
    if (!this.props.production) {
      return (
        <div>
          <Spinner />
        </div>
      );
    }
    return (
      <div>
        <InventoryForm
          term="Production"
          initialValues={{
            Quantity: item.Quantity,
            Employee: item.Employee
          }}
          onSubmit={this.onSubmit}
        />
      </div>
    );
  }
}

// To gain access of the state from the reducers
const mapStateToProps = (state, ownProps) => {
  return { production: state.datas[ownProps.match.params.id] };
};

export default connect(
  mapStateToProps,
  { fetchData, editData }
)(ProductionEdit);
