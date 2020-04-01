import React from "react";
import ReactExport from "react-export-excel";
import "./App.css";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const App = () => {
  let type;
  let startDate, endDate;
  let responseData;
  var questions = [];
  var answers = [];
  var columns = [];
  var data = [];
  const formTypeHandler = e => {
    type = e.target.value;
  };
  const startDateHandler = e => {
    startDate = e.target.value;
  };
  const endDateHandler = e => {
    endDate = e.target.value;
  };
  const formDetailHandler = async event => {
    event.preventDefault();
    try {
      const response = await fetch(`http://localhost:7000/form`, {
        method: "POST",
        body: JSON.stringify({
          form_type: type,
          start_date: startDate + " 00:00:00",
          end_date: endDate + " 23:59:59"
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });
      responseData = await response.json();
      for (var j in responseData.data) {
        let i = 1;
        for (var k in responseData.data[j]) {
          if (i !== 1 && k === "answer") answers.push(responseData.data[j][k]);
          else if (k === "question") questions.push(responseData.data[j][k]);
          i++;
        }
      }
      for (var col in responseData.data[0])
        if (col !== "question" && col !== "answer") columns.push(col);
      for (var t in responseData.data) {
        var temp = [];
        for (var dat in responseData.data[t]) {
          if (dat !== "question" && dat !== "answer") {
            temp.push(responseData.data[t][dat]);
          }
        }
        data.push(temp);
      }
    } catch (err) {
      throw err;
    }
    columns = columns + questions;
    data = data + answers;
  };
  const multiDataSet = [
    {
      columns: columns,
      data: data
    }
  ];
  return (
    <React.Fragment>
      <ExcelFile element={<button>Download Data</button>}>
        <ExcelSheet dataSet={multiDataSet} name="Form Details" />
      </ExcelFile>
      <div className="form">
        <form onSubmit={formDetailHandler}>
          <div className="formtype">
            <input type="text" onInput={formTypeHandler} />
            <input type="text" onInput={startDateHandler} />
            <input type="text" onInput={endDateHandler} />
          </div>
          <div className="button">
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </React.Fragment>
  );
};

export default App;
