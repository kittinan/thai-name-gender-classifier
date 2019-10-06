import React from "react";
import logo from "./logo.svg";
import "./App.css";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";

import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";

import * as tf from "@tensorflow/tfjs";

const thai_characters = [
  "",
  "ก",
  "ข",
  "ฃ",
  "ค",
  "ฅ",
  "ฆ",
  "ง",
  "จ",
  "ฉ",
  "ช",
  "ซ",
  "ฌ",
  "ญ",
  "ฎ",
  "ฏ",
  "ฐ",
  "ฑ",
  "ฒ",
  "ณ",
  "ด",
  "ต",
  "ถ",
  "ท",
  "ธ",
  "น",
  "บ",
  "ป",
  "ผ",
  "ฝ",
  "พ",
  "ฟ",
  "ภ",
  "ม",
  "ย",
  "ร",
  "ฤ",
  "ล",
  "ว",
  "ศ",
  "ษ",
  "ส",
  "ห",
  "ฬ",
  "อ",
  "ฮ",
  "ะ",
  "ั",
  "า",
  "ำ",
  "ิ",
  "ี",
  "ึ",
  "ื",
  "ุ",
  "ู",
  "เ",
  "แ",
  "โ",
  "ใ",
  "ไ",
  "็",
  "่",
  "้",
  "๊",
  "๋",
  "์"
];

var pad_array = function(arr, len, fill) {
  return arr.concat(Array(len).fill(fill)).slice(0, len);
};

const useStyles = makeStyles({
  card: {
    minWidth: 275
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  }
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "ประยุทธ์",
      text_result: "",
      logs: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.onClickPredict = this.onClickPredict.bind(this);
  }

  async componentDidMount() {
    this.model = await tf.loadLayersModel("./tfjs_model/model.json");
  }

  async handleChange(event) {
    this.setState({ name: event.target.value });
  }

  async onClickPredict() {
    this.setState({ text_result: "" });
    const { name } = this.state;
    const input = this.createInput(name);
    console.log(name, input);

    const result = await this.model.predict(tf.stack([tf.tensor1d(input)]));
    const result_prob = await result.data();

    const isMale = result_prob[0] > 0.5;

    const text_result = isMale ? "Male" : "Female";

    let { logs } = this.state;

    logs.push({ name: name, gender: text_result, prob: result_prob[0] });
    this.setState({ text_result, logs });

    console.log(result_prob[0], "is male: " + isMale);
  }

  createInput(name, pad_length = 15) {
    //console.log(name);
    let input = [];
    for (var i = 0; i < name.length; i++) {
      const c = name.charAt(i);
      let pos = thai_characters.indexOf(c);
      if (pos == -1) {
        pos = 999;
      }
      //console.log(c, pos);
      input.push(pos);
    }
    return pad_array(input, pad_length, 0);
  }

  render() {
    const { text_result, logs } = this.state;

    const log_list = logs.map((v, i) => (
      <div>
        {v.name}: {v.gender}
      </div>
    ));

    return (
      <div className="App">
        <header className="App-header">
          <Card id="card-input">
            <CardContent>
              <h3>ทำนายเพศจากชื่อ</h3>

              <TextField
                id="text-field-name"
                label="Name"
                value={this.state.name}
                onChange={this.handleChange}
                margin="normal"
                variant="outlined"
              />

              <div />

              <Button
                variant="contained"
                color="primary"
                onClick={this.onClickPredict}
              >
                Predict
              </Button>

              {text_result.length > 0 && (
                <div id="result">Result: {text_result}</div>
              )}

              {logs.length > 0 && (
                <div id="logs">
                  <div>Logs:</div>
                  <div>{log_list}</div>
                </div>
              )}
            </CardContent>
          </Card>
        </header>
      </div>
    );
  }
}

export default App;
