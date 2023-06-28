/* Dashboard.js */
import React, { Component } from "react";
import classnames from "classnames";
import Loading from "./Loading";
import Panel from "./Panel";
import axios from "axios";
import {
  getTotalInterviews,
  getLeastPopularTimeSlot,
  getMostPopularDay,
  getInterviewsPerDay
} from "../helpers/selectors";

class Dashboard extends Component {
  state = {
    loading: true,
    focused: null,
    days: [],
    appointments: {},
    interviewers: {}
  };

  componentDidMount() {
    const focused = JSON.parse(localStorage.getItem("focused"));

    if (focused) {
      this.setState({ focused });
    }

    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ]).then(([days, appointments, interviewers]) => {
      this.setState({
        loading: false,
        days: days.data,
        appointments: appointments.data,
        interviewers: interviewers.data
      });
    });
  }

  componentDidUpdate(previousProps, previousState) {
    if (previousState.focused !== this.state.focused) {
      localStorage.setItem("focused", JSON.stringify(this.state.focused));
    }
  }

  selectPanel(id) {
    this.setState((prevState) => ({
      focused: prevState.focused !== id ? id : null
    }));
  }

  render() {
    const { loading, focused, days, appointments, interviewers } = this.state;

    const dashboardClasses = classnames("dashboard", {
      "dashboard--focused": focused
    });

    if (loading) {
      return <Loading />;
    }

    const data = [
      {
        id: 1,
        label: "Total Interviews",
        getValue: getTotalInterviews
      },
      {
        id: 2,
        label: "Least Popular Time Slot",
        getValue: getLeastPopularTimeSlot
      },
      {
        id: 3,
        label: "Most Popular Day",
        getValue: getMostPopularDay
      },
      {
        id: 4,
        label: "Interviews Per Day",
        getValue: getInterviewsPerDay
      }
    ];

    const panels = data.map((panel) => (
      <Panel
        key={panel.id}
        label={panel.label}
        value={panel.getValue({ days, appointments, interviewers })}
        onSelect={() => this.selectPanel(panel.id)}
      />
    ));

    return <main className={dashboardClasses}>{panels}</main>;
  }
}

export default Dashboard;
