/* eslint-disable react/prop-types */
import React, { useState } from "react";
// import "./App.css";

// Functional Component - new way (preferred)
const FunctionalCard = () => {
  return (
    <div style={{ border: "1px solid black", padding: "10px", margin: "10px" }}>
      <h3>Functional Component:</h3>
      <pre style={{ textAlign: "left" }}>
        {`
          const FunctionalCard = () => {
            return <h2>This is a functional component</h2>;
          };
        `}
      </pre>
    </div>
  );
};

// Class Component - old way
class ClassCard extends React.Component {
  render() {
    return (
      <div
        style={{ border: "1px solid black", padding: "10px", margin: "10px" }}
      >
        <h3>Class Component:</h3>
        <pre style={{ textAlign: "left" }}>
          {`
            class ClassCard extends React.Component {
              render() {
                return <h2>This is a class component</h2>;
              }
            }
          `}
        </pre>
      </div>
    );
  }
}

const Card = ({ title }) => {
  return (
    <div className="card">
      <h2>{title}</h2>
    </div>
  );
};

const App = () => {
  return (
    <section className="card-container" id="">
      <Card
        title="Limitless"
        actors={[{ name: "Bradley" }]}
        isCool={true}
        rating={5}
      />
      <Card title="Forest Gump" />
      <Card title="The Matrix" />
      <Card title="Fight Club" />
    </section>
  );
};

export default App;
