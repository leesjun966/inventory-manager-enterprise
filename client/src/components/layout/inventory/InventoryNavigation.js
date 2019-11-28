import React from "react";
import { Tab, Input, Menu } from "semantic-ui-react";
import RenderTable from "./RenderTable";
import { Link } from "react-router-dom";

// Switching from warehouse, production to employee tab
const panes = [
  {
    menuItem: "Inventory",
    render: () => (
      <Tab.Pane>
        <RenderTable term="Inventory" baseURL="/crud/getInventory" />
      </Tab.Pane>
    )
  },
  {
    menuItem: "Warehouse",
    render: () => (
      <Tab.Pane>
        <RenderTable term="Warehouse" baseURL="/crud/getTable" />
      </Tab.Pane>
    )
  },
  {
    menuItem: "Production",

    render: () => (
      <Tab.Pane>
        <RenderTable term="Production" baseURL="/crud/getTable" />
      </Tab.Pane>
    )
  },
  {
    menuItem: "Employee",
    render: () => (
      <Tab.Pane>
        <RenderTable term="Employee" baseURL="/admin/getUsers" />
      </Tab.Pane>
    )
  }
];

/**
 * Navigation tab for inventory page
 */
class InventoryNavigation extends React.Component {
  state = { activeIndex: this.getState() };

  getState() {
    const defaultIndex = this.props.defaultIndex;
    if (defaultIndex > 0) {
      return defaultIndex;
    }
    return 0;
  }

  handleTabChange = (e, { activeIndex }) => this.setState({ activeIndex });

  render() {
    const { activeIndex } = this.state;

    return (
      <div>
        <Tab
          activeIndex={activeIndex}
          menu={{
            color: "blue",
            secondary: true,
            pointing: true
          }}
          onTabChange={this.handleTabChange}
          panes={panes}
        />
      </div>
    );
  }
}

export default InventoryNavigation;
