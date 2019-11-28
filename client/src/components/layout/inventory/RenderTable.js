import React from "react";
import { connect } from "react-redux";
import { fetchDatas, qrDownload, fetchLabels } from "../../../actions";
import { Link } from "react-router-dom";
import _ from "lodash";

/**
 * To handle how the table is to be rendered
 * Contain fetchDatas, qrDownload, fetchLabels actions
 */
class RenderTable extends React.Component {
  // fetchDatas => action is called everytime before the page is rendered
  // fetchLabels => to get the title of every column of the table
  componentDidMount() {
    this.props.fetchDatas(
      { table: this.props.term, mat_id: this.props.id, batch: this.props.id },
      this.props.baseURL
    );
    this.props.fetchLabels(
      { table: this.props.term, mat_id: this.props.id, batch: this.props.id },
      this.props.baseURL
    );
  }

  // Listen to any new updates on rendering the other table
  componentDidUpdate(prevProps) {
    // listen to new props changed
    const newProps = this.props;
    if (prevProps.term !== newProps.term) {
      this.props.fetchDatas(
        { table: newProps.term, mat_id: newProps.id, batch: newProps.id },
        newProps.baseURL,
        {}
      );
      this.props.fetchLabels(
        { table: newProps.term, mat_id: newProps.id, batch: newProps.id },
        newProps.baseURL,
        {}
      );
    }
  }

  // Object.keys function is the built in javascript function to get
  // keys from any object
  // this.props.datas[0] because we only need the first object to retrieve all the keys
  getKeys = () => {
    // get the keys(labels) for every object
    return Object.keys(this.props.datas[0]);
  };

  getLabels = () => {
    return Object.values(this.props.labels);
  };

  // Iterate through the keys and return the <th> </th> element
  // as the heading for the header part
  getHeader = () => {
    const labels = this.getLabels();

    return labels.map((label, index) => {
      return <th key={index}>{label.toUpperCase()}</th>;
    });
  };

  // render Extra column for the button to edit and download
  renderExtraColumn(id) {
    if (this.props.term !== "Log") {
      if (this.props.term === "Inventory" || this.props.term === "Employee") {
        return <td className="center aligned">{this.renderAdminButton(id)}</td>;
      } else {
        if (this.props.adminLevel >= 5) {
          return (
            <td className="center aligned">{this.renderAdminButton(id)}</td>
          );
        }
      }
    }
  }

  // Iterate through all the list items and use the renderRow component created inside
  // so it would return all the row components
  getRowsData = () => {
    const items = this.props.datas;
    const keys = this.getKeys();
    return items.map((row, index) => {
      return (
        <tr key={index}>
          <RenderRow
            key={index}
            data={row}
            keys={keys}
            term={this.props.term}
          />
          {this.renderExtraColumn(row.ID)}
        </tr>
      );
    });
  };

  // render the edit button
  renderEditButton(term, id) {
    return (
      <Link to={`/dashboard/edit/${term}/${id}`}>
        <div className="ui small primary icon button">
          <i className="edit icon" />
        </div>
      </Link>
    );
  }

  // To render the download button
  renderDownloadButton(id) {
    return (
      <div
        className="ui small teal icon button"
        onClick={() => this.onQRdownloadSubmit(id)}
      >
        <i className="download icon" />
      </div>
    );
  }

  // To call the qrDownload action either from employee or inventory
  onQRdownloadSubmit = async id => {
    if (this.props.term === "Inventory") {
      const qrMatID = { mat_id: id };
      this.props.qrDownload("/crud/getMaterialQR", qrMatID);
    } else {
      const qrEmployeeID = { usr_id: id };
      this.props.qrDownload("/admin/generateQR", qrEmployeeID);
    }
  };

  // To allocate spaces for the last column either with only one button or two
  renderAdminHeader() {
    if (this.props.term !== "Log") {
      if (this.props.adminLevel >= 5) {
        if (this.props.term === "Inventory" || this.props.term === "Employee") {
          return <th className="two wide" />;
        }
        return <th className="one wide" />;
      }
      if (this.props.term === "Inventory" || this.props.term === "Employee") {
        return <th className="one wide" />;
      }
    }
  }

  // To render the buttons according to the admin level or specific table with specific functions
  renderAdminButton(id) {
    if (this.props.adminLevel >= 5) {
      if (this.props.term === "Inventory" || this.props.term === "Employee") {
        return (
          <div>
            {this.renderEditButton(this.props.term, id)}
            {this.renderDownloadButton(id)}
          </div>
        );
      } else {
        return <div>{this.renderEditButton(this.props.term, id)}</div>;
      }
    }
    if (this.props.term === "Inventory" || this.props.term === "Employee") {
      return <div>{this.renderDownloadButton(id)}</div>;
    }
  }

  renderFooter() {
    if (this.props.adminLevel >= 5 && this.props.term !== "Log") {
      return (
        <th colSpan={`${this.props.labels.length + 1}`}>
          <div className="ui right floated pagination menu">
            <a className="icon item">
              <i className="left chevron icon" />
            </a>
            <a className="item">1</a>
            <a className="item">2</a>
            <a className="item">3</a>
            <a className="item">4</a>
            <a className="icon item">
              <i className="right chevron icon" />
            </a>
          </div>
        </th>
      );
    }
    return (
      <th colSpan={`${this.props.labels.length}`}>
        <div className="ui right floated pagination menu">
          <a className="icon item">
            <i className="left chevron icon" />
          </a>
          <a className="item">1</a>
          <a className="item">2</a>
          <a className="item">3</a>
          <a className="item">4</a>
          <a className="icon item">
            <i className="right chevron icon" />
          </a>
        </div>
      </th>
    );
  }

  render() {
    console.log(this.props);
    if (this.props.datas.length === 0) {
      return <div>Loading...</div>;
    } else {
      return (
        <div>
          <table className="ui unstackable fixed celled striped table">
            <thead>
              <tr>
                {this.getHeader()}
                {this.renderAdminHeader()}
              </tr>
            </thead>
            <tbody>{this.getRowsData()}</tbody>
            <tfoot>
              <tr>{this.renderFooter()}</tr>
            </tfoot>
          </table>
        </div>
      );
    }
  }
}

// Passing row data and keys data to the component
// Iterate to the key values, data[keyValue] would give us the correspoding
// column value from the json
const RenderRow = props => {
  console.log(props);
  return props.keys.map((key, index) => {
    if (key === "Batch_ID" && props.term === "Log") {
      return (
        <td key={index}>
          <Link to={`/dashboard/${props.term}/${props.data.Batch_ID}`}>
            {props.data[key]}
          </Link>
        </td>
      );
    } else {
      if (key === "Material_ID" && props.term !== "Log") {
        return (
          <td key={index}>
            <Link to={`/dashboard/${props.term}/${props.data.Material_ID}`}>
              {props.data[key]}
            </Link>
          </td>
        );
      } else {
        return <td key={index}>{props.data[key]}</td>;
      }
    }
  });
};

// To gain access of the state from the reducers
const mapStateToProps = state => {
  return {
    datas: Object.values(state.datas),
    labels: state.labels,
    qr: state.qr,
    adminLevel: state.auth.adminLevel
  };
};

export default connect(
  mapStateToProps,
  { fetchDatas, qrDownload, fetchLabels }
)(RenderTable);
