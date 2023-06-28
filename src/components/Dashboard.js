/* Dashboard.js */import React, { Component } from "react";
import classnames from "classnames";
import Loading from "./Loading";
import Panel from "./Panel";

const data = [
  {
    id: 1,
    label: "Total Interviews",
    value: 6
  },
  {
    id: 2,
    label: "Least Popular Time Slot",
    value: "1pm"
  },
  {
    id: 3,
    label: "Most Popular Day",
    value: "Wednesday"
  },
  {
    id: 4,
    label: "Interviews Per Day",
    value: "2.3"
  }
];

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      focused: null
    };

    this.selectPanel = this.selectPanel.bind(this);
  }

  selectPanel(id) {
    this.setState((prevState) => ({
      focused: prevState.focused !== null ? null : id
    }));
  }

  render() {
    const { loading, focused } = this.state;

    const dashboardClasses = classnames("dashboard", {
      "dashboard--focused": focused
    });

    if (loading) {
      return <Loading />;
    }

    const panels = focused
      ? data
          .filter((panel) => panel.id === focused)
          .map((panel) => (
            <Panel
              key={panel.id}
              label={panel.label}
              value={panel.value}
              onSelect={this.selectPanel}
            />
          ))
      : data.map((panel) => (
          <Panel
            key={panel.id}
            label={panel.label}
            value={panel.value}
            onSelect={this.selectPanel}
          />
        ));

    return <main className={dashboardClasses}>{panels}</main>;
  }
}

export default Dashboard;
