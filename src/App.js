import React from "react";
import "./App.css";
// import TextFileReader from "./TextFileReader.js";
// import { render } from "@testing-library/react";

const FILE = require("./dataset/database.txt");

function read_text_file(file) {
  var rawFile = new XMLHttpRequest();
  var allText = "";
  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = () => {
    if (rawFile.readyState === 4) {
      if (rawFile.status === 200 || rawFile.status === 0) {
        allText = rawFile.responseText;
      }
    }
  };
  rawFile.send(null);
  return allText;
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.text_to_show = [];
    this.state = { value: "", text: [], show_text: this.text_to_show };

    this.handleChange = this.handleChange.bind(this);
    this.find_identical_match = this.find_identical_match.bind(this);
    this.show_text = this.show_text.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  find_identical_match(word, text_list, punctuation_list = []) {
    console.log("In find_idential_match function");
    // Find the sentence with matching word
    if (punctuation_list.length === 0) {
      text_list.forEach((text, key) => {
        var index = text.indexOf(word);

        if (index !== -1) {
          var starting_index = text.indexOf(":") + 2;

          this.text_to_show.push(
            <tr key={key}>
              <td>{this.text_to_show.length + 1}</td>
              <td>{text.slice(0, text.indexOf(":"))}</td>
              <td>{text.slice(starting_index, text.indexOf(word))}</td>
              <td style={{ color: "red" }}>{word}</td>
              <td>
                {text.slice(text.indexOf(word) + word.length, text.length)}
              </td>
            </tr>
          );
          this.setState({
            show_text: this.text_to_show,
          });
        }
      });
    } else {
      word = word.trim().slice(0, word.indexOf("["));

      text_list.forEach((text, key) => {
        var index = text.indexOf(word);

        if (
          index !== -1 &&
          punctuation_list.includes(text[index + word.length])
        ) {
          var starting_index = text.indexOf(":") + 2;
          this.text_to_show.push(
            <tr key={key}>
              <td>{this.text_to_show.length + 1}</td>
              <td>{text.slice(0, text.indexOf(":"))}</td>
              <td>{text.slice(starting_index, text.indexOf(word))}</td>
              <td style={{ color: "red" }}>{word}</td>
              <td>
                {text.slice(text.indexOf(word) + word.length, text.length)}
              </td>
            </tr>
          );
          this.setState({
            show_text: this.text_to_show,
          });
        }
      });
    }
  }

  find_any_number_inbetweem(word, text_list, punctuation_list = []) {
    // X*Y find X and Y and any number of words inbetween
    var X_index = word.indexOf("*") - 1;
    var Y_index = word.indexOf("*") + 1;

    var X = word[X_index];
    var Y = word.slice(Y_index);

    if (punctuation_list.length === 0) {
      text_list.forEach((text, key) => {
        var x_index = text.indexOf(X);
        var y_index = text.indexOf(Y);
        console.log(text.slice(x_index, y_index + 1))
        var starting_index = text.indexOf(":") + 2;

        if (x_index !== -1 && y_index !== -1) {
          if (x_index < y_index) {
            this.text_to_show.push(
              <tr key={key}>
                <td>{this.text_to_show.length + 1}</td>
                <td>{text.slice(0, text.indexOf(":"))}</td>
                <td>{text.slice(starting_index, x_index)}</td>
                <td>
                  <span>
                    <strong style={{ color: "red" }}>{X}</strong>
                    {text.slice(x_index+1, y_index)}
                    <strong style={{ color: "red" }}>{Y}</strong>
                  </span>
                </td>
                <td>{text.slice(y_index + 1, text.length)}</td>
              </tr>
            );

            this.setState({
              show_text: this.text_to_show,
            });
          }
        }
      });
    } else {
      text_list.forEach((text, key) => {
        var x_index = text.indexOf(X);
        var y_index = text.indexOf(Y);
        
        var starting_index = text.indexOf(":") + 2;

        if (x_index !== -1 && y_index !== -1) {
          if (
            x_index < y_index &&
            punctuation_list.includes(text[y_index + 1])
          ) {
            this.text_to_show.push(
              <tr key={key}>
                <td>{this.text_to_show.length + 1}</td>
                <td>{text.slice(0, text.indexOf(":"))}</td>
                <td>{text.slice(starting_index, x_index)}</td>
                <td>
                  <span>
                    <strong style={{ color: "red" }}>{X}</strong>
                    {text.slice(x_index+1, y_index)}
                    <strong style={{ color: "red" }}>{Y}</strong>
                  </span>
                </td>
                <td>{text.slice(y_index + 1, text.length)}</td>
              </tr>
            );
            this.setState({
              show_text: this.text_to_show,
            });
          }
        }
      });
    }
  }

  find_only_1_word_inbetween(word, text_list, punctuation_list = []) {
    //X.Y - find X and Y with only 1 word inbetweem
    var X_index = word.indexOf(".") - 1;
    var Y_index = word.indexOf(".") + 1;

    var X = word[X_index];
    var Y = word.slice(Y_index);

    if (punctuation_list.length !== 0) {
      text_list.forEach((text, key) => {
        var x_index = text.indexOf(X);
        var y_index = text.indexOf(Y);

        var starting_index = text.indexOf(":") + 2;

        if (x_index !== -1 && y_index !== -1) {
          if (
            y_index - x_index === 2 &&
            punctuation_list.includes(text[y_index + 1])
          ) {
            this.text_to_show.push(
              <tr key={key}>
                <td>{this.text_to_show.length + 1}</td>
                <td>{text.slice(0, text.indexOf(":"))}</td>
                <td>{text.slice(starting_index, x_index)}</td>
                <td>
                  <span>
                    <strong style={{ color: "red" }}>{X}</strong>
                    {text.slice(x_index+1, y_index)}
                    <strong style={{ color: "red" }}>{Y}</strong>
                  </span>
                </td>
                <td>{text.slice(y_index+1, text.length)}</td>
              </tr>
            );

            this.setState({
              show_text: this.text_to_show,
            });
          }
        }
      });
    } else {
      text_list.forEach((text, key) => {
        var x_index = text.indexOf(X);
        var y_index = text.indexOf(Y);

        var starting_index = text.indexOf(":") + 2;

        if (x_index !== -1 && y_index !== -1) {
          if (y_index - x_index === 2) {
            this.text_to_show.push(
              <tr key={key}>
                <td>{this.text_to_show.length + 1}</td>
                <td>{text.slice(0, text.indexOf(":"))}</td>
                <td>{text.slice(starting_index, x_index)}</td>
                <td>
                  <span>
                    <strong style={{ color: "red" }}>{X}</strong>
                    {text.slice(x_index+1, y_index)}
                    <strong style={{ color: "red" }}>{Y}</strong>
                  </span>
                </td>
                <td>{text.slice(y_index+1, text.length)}</td>
              </tr>
            );

            this.setState({
              show_text: this.text_to_show,
            });
          }
        }
      });
    }
  }

  find_only_2_word_inbetween(word, text_list, punctuation_list = []) {
    //X..Y - find X and Y with only 2 word inbetweem
    var X_index = word.indexOf("..") - 1;
    var Y_index = word.indexOf("..") + 2;

    var X = word[X_index];
    var Y = word.slice(Y_index);

    if (punctuation_list.length !== 0) {
      text_list.forEach((text, key) => {
        var x_index = text.indexOf(X);
        var y_index = text.indexOf(Y);

        var starting_index = text.indexOf(":") + 2;

        if (x_index !== -1 && y_index !== -1) {
          if (
            y_index - x_index === 3 &&
            punctuation_list.includes(text[y_index + 1])
          ) {
            this.text_to_show.push(
              <tr key={key}>
                <td>{this.text_to_show.length + 1}</td>
                <td>{text.slice(0, text.indexOf(":"))}</td>
                <td>{text.slice(starting_index, x_index)}</td>
                <td>
                  <span>
                    <strong style={{ color: "red" }}>{X}</strong>
                    {text.slice(x_index+1, y_index)}
                    <strong style={{ color: "red" }}>{Y}</strong>
                  </span>
                </td>
                <td>{text.slice(y_index+1, text.length)}</td>
              </tr>
            );

            this.setState({
              show_text: this.text_to_show,
            });
          }
        }
      });
    } else {
      text_list.forEach((text, key) => {
        var x_index = text.indexOf(X);
        var y_index = text.indexOf(Y);

        var starting_index = text.indexOf(":") + 2;

        if (x_index !== -1 && y_index !== -1) {
          if (y_index - x_index === 3) {
            this.text_to_show.push(
              <tr key={key}>
                <td>{this.text_to_show.length + 1}</td>
                <td>{text.slice(0, text.indexOf(":"))}</td>
                <td>{text.slice(starting_index, x_index)}</td>
                <td>
                  <span>
                    <strong style={{ color: "red" }}>{X}</strong>
                    {text.slice(x_index+1, y_index)}
                    <strong style={{ color: "red" }}>{Y}</strong>
                  </span>
                </td>
                <td>{text.slice(y_index+1, text.length)}</td>
              </tr>
            );

            this.setState({
              show_text: this.text_to_show,
            });
          }
        }
      });
    }
  }

  find_only_3_word_inbetween(word, text_list, punctuation_list = []) {
    //X...Y - find X and Y with only 3 word inbetweem
    var X_index = word.indexOf("...") - 1;
    var Y_index = word.indexOf("...") + 3;

    var X = word[X_index];
    var Y = word.slice(Y_index);

    if (punctuation_list.length !== 0) {
      text_list.forEach((text, key) => {
        var x_index = text.indexOf(X);
        var y_index = text.indexOf(Y);

        var starting_index = text.indexOf(":") + 2;

        if (x_index !== -1 && y_index !== -1) {
          if (
            y_index - x_index === 4 &&
            punctuation_list.includes(text[y_index + 1])
          ) {
            this.text_to_show.push(
              <tr key={key}>
                <td>{this.text_to_show.length + 1}</td>
                <td>{text.slice(0, text.indexOf(":"))}</td>
                <td>{text.slice(starting_index, x_index)}</td>
                <td>
                  <span>
                    <strong style={{ color: "red" }}>{X}</strong>
                    {text.slice(x_index+1, y_index)}
                    <strong style={{ color: "red" }}>{Y}</strong>
                  </span>
                </td>
                <td>{text.slice(y_index+1, text.length)}</td>
              </tr>
            );

            this.setState({
              show_text: this.text_to_show,
            });
          }
        }
      });
    } else {
      text_list.forEach((text, key) => {
        var x_index = text.indexOf(X);
        var y_index = text.indexOf(Y);

        var starting_index = text.indexOf(":") + 2;

        if (x_index !== -1 && y_index !== -1) {
          if (y_index - x_index === 4) {
            this.text_to_show.push(
              <tr key={key}>
                <td>{this.text_to_show.length + 1}</td>
                <td>{text.slice(0, text.indexOf(":"))}</td>
                <td>{text.slice(starting_index, x_index)}</td>
                <td>
                  <span>
                    <strong style={{ color: "red" }}>{X}</strong>
                    {text.slice(x_index+1, y_index)}
                    <strong style={{ color: "red" }}>{Y}</strong>
                  </span>
                </td>
                <td>{text.slice(y_index+1, text.length)}</td>
              </tr>
            );

            this.setState({
              show_text: this.text_to_show,
            });
          }
        }
      });
    }
  }

  start_with_char(word, text_list, punctuation_list = []) {
    //wX - Starts with w
    var starting_words = word.slice(1);

    if (punctuation_list.length === 0) {
      text_list.forEach((text, key) => {
        var starting_index = text.indexOf(":") + 2;

        if (text.substring(starting_index).startsWith(starting_words)) {
          this.text_to_show.push(
            <tr key={key}>
              <td>{this.text_to_show.length + 1}</td>
              <td>{text.slice(0, text.indexOf(":"))}</td>
              <td> </td>
              <td>
                <span>
                  <strong style={{ color: "red" }}>{starting_words}</strong>
                </span>
              </td>
              <td>
                {text.slice(
                  starting_index + starting_words.length,
                  text.length
                )}
              </td>
            </tr>
          );

          this.setState({
            show_text: this.text_to_show,
          });
        }
      });
    } else {
      var index_to_cut = 0 - punctuation_list.length - 2;
      starting_words = starting_words.slice(0, index_to_cut);
      text_list.forEach((text, key) => {
        var starting_index = text.indexOf(":") + 2;

        if (
          text.substring(starting_index).startsWith(starting_words) &&
          punctuation_list.includes(
            text[starting_index + starting_words.length]
          )
        ) {
          this.text_to_show.push(
            <tr key={key}>
              <td>{this.text_to_show.length + 1}</td>
              <td>{text.slice(0, text.indexOf(":"))}</td>
              <td> </td>
              <td>
                <span>
                  <strong style={{ color: "red" }}>{starting_words}</strong>
                </span>
              </td>
              <td>
                {text.slice(
                  starting_index + starting_words.length,
                  text.length
                )}
              </td>
            </tr>
          );

          this.setState({
            show_text: this.text_to_show,
          });
        }
      });
    }
  }

  ends_with_char(word, text_list, punctuation_list = []) {
    //Xw - Ends with X
    var ending_words = word.slice(0, -1);
    const punctuation = [".", "?", "!", "。"];

    if (punctuation_list.length === 0) {
      text_list.forEach((text, key) => {
        var starting_index = text.indexOf(":") + 2;

        if (punctuation.includes(text.trim().slice(-1))) {
          var new_text = text.trim().slice(1, -1);
          if (new_text.endsWith(ending_words)) {
            this.text_to_show.push(
              <tr key={key}>
                <td>{this.text_to_show.length + 1}</td>
                <td>{text.slice(0, text.indexOf(":"))}</td>
                <td>
                  {text.slice(starting_index, text.indexOf(ending_words))}
                </td>
                <td>
                  <span>
                    <strong style={{ color: "red" }}>{ending_words}</strong>
                  </span>
                </td>
                <td> </td>
              </tr>
            );

            this.setState({
              show_text: this.text_to_show,
            });
          }
        } else if (text.endsWith(ending_words)) {
          this.text_to_show.push(
            <tr key={key}>
              <td>{this.text_to_show.length + 1}</td>
              <td>{text.slice(0, text.indexOf(":"))}</td>
              <td>{text.slice(starting_index, text.indexOf(ending_words))}</td>
              <td>
                <span>
                  <strong style={{ color: "red" }}>{ending_words}</strong>
                </span>
              </td>
              <td> </td>
            </tr>
          );

          this.setState({
            show_text: this.text_to_show,
          });
        }
      });
    } else {
      ending_words = ending_words.slice(0, 0 - punctuation_list.length - 2);
      text_list.forEach((text, key) => {
        var starting_index = text.indexOf(":") + 2;
        if (punctuation_list.includes(text.trim().slice(-1))) {
          var new_text = text.trim().slice(1, -1);

          if (new_text.endsWith(ending_words)) {
            console.log("Here!");
            this.text_to_show.push(
              <tr key={key}>
                <td>{this.text_to_show.length + 1}</td>
                <td>{text.slice(0, text.indexOf(":"))}</td>
                <td>
                  {text.slice(starting_index, text.indexOf(ending_words))}
                </td>
                <td>
                  <span>
                    <strong style={{ color: "red" }}>{ending_words}</strong>
                  </span>
                </td>
                <td> </td>
              </tr>
            );

            this.setState({
              show_text: this.text_to_show,
            });
          }
        }
      });
    }
  }

  pair_words(word, text_list, punctuation_list = []) {
    //X&Y - returns all sentences with XY in them
    var pair = word.replace("&", "");

    if (punctuation_list.length === 0) {
      text_list.forEach((text, key) => {
        var starting_index = text.indexOf(":") + 2;

        if (text.includes(pair)) {
          this.text_to_show.push(
            <tr key={key}>
              <td>{this.text_to_show.length + 1}</td>
              <td>{text.slice(0, text.indexOf(":"))}</td>
              <td>{text.slice(starting_index, text.indexOf(pair))}</td>
              <td>
                <span>
                  <strong style={{ color: "red" }}>{pair}</strong>
                </span>
              </td>
              <td>
                {text.slice(text.indexOf(pair) + pair.length, text.length)}
              </td>
            </tr>
          );

          this.setState({
            show_text: this.text_to_show,
          });
        }
      });
    } else {
      pair = pair.trim().slice(0, 0 - punctuation_list.length - 2);
      text_list.forEach((text, key) => {
        var starting_index = text.indexOf(":") + 2;
        if (
          text.includes(pair) &&
          punctuation_list.includes(text[text.indexOf(pair) + pair.length])
        ) {
          this.text_to_show.push(
            <tr key={key}>
              <td>{this.text_to_show.length + 1}</td>
              <td>{text.slice(0, text.indexOf(":"))}</td>
              <td>{text.slice(starting_index, text.indexOf(pair))}</td>
              <td>
                <span>
                  <strong style={{ color: "red" }}>{pair}</strong>
                </span>
              </td>
              <td>
                {text.slice(text.indexOf(pair) + pair.length, text.length)}
              </td>
            </tr>
          );

          this.setState({
            show_text: this.text_to_show,
          });
        }
      });
    }
  }

  double_words(text_list) {
    //For XX - Returns all sentences with pair words
    text_list.forEach((text, key) => {
      var dictionary = {};
      for (let i = text.indexOf(":") + 2; i < text.length; i++) {
        if (dictionary[text[i]]) {
          if (dictionary[text[i]] + 1 === i) {
            this.text_to_show.push(
              <tr key={key}>
                <td>{this.text_to_show.length + 1}</td>
                <td>{text.slice(0, text.indexOf(":"))}</td>
                <td>
                  {text.slice(text.indexOf(":") + 2, text.indexOf(text[i]))}
                </td>
                <td>
                  <span>
                    <strong style={{ color: "red" }}>
                      {text[i - 1]}
                      {text[i]}
                    </strong>
                  </span>
                </td>
                <td>{text.slice(text.indexOf(text[i]) + 2, text.length)}</td>
              </tr>
            );
            break;
          }
        } else {
          dictionary[text[i]] = i;
        }
      }
    });
  }

  middle_words(word, text_list){
    console.log(word)
    if (word.length === 1){
      text_list.forEach((text, key) => {
        var word_index = text.indexOf(word);
        if (text[word_index-1] === text[word_index+1]) {
          console.log(`Sentenced found! - ${text}`);
          this.text_to_show.push(
            <tr key={key}>
              <td>{this.text_to_show.length + 1}</td>
              <td>{text.slice(0, text.indexOf(":"))}</td>
              <td>
                {text.slice(text.indexOf(":") + 2, word_index-1)}
              </td>
              <td>
                <span>
                  <strong style={{ color: "red" }}>
                    {text[word_index-1]}{text[word_index]}{text[word_index+1]}
                  </strong>
                </span>
              </td>
              <td>{text.slice(word_index+2, text.length)}</td>
            </tr>
          );
        }
      })
    } else{
      text_list.forEach((text, key) =>{
        var word_starting_index = text.indexOf(word[0]);
        var word_ending_index = word_starting_index + word.length;

        if(text[word_starting_index-1] === text[word_ending_index + 1] ){
          console.log(`Sentenced found! - ${text}`);
          this.text_to_show.push(
          <tr key={key}>
          <td>{this.text_to_show.length + 1}</td>
          <td>{text.slice(0, text.indexOf(":"))}</td>
          <td>
            {text.slice(text.indexOf(":") + 2, word_starting_index-1)}
          </td>
          <td>
            <span>
              <strong style={{ color: "red" }}>
                {text[word_starting_index-1]}{word}{text[word_ending_index + 1]}
              </strong>
            </span>
          </td>
          <td>{text.slice(word_ending_index +2, text.length)}</td>
        </tr>
          )
        }
      })
    }

  }

  show_text(input) {
    this.text_to_show = [];
    var allText = read_text_file(FILE);

    var text_list = allText.split("\n");

    this.setState({
      text: text_list,
    });

    if (input.indexOf("[") > 0 && input.indexOf("]") > input.indexOf("[")) {
      var first_ele = input.indexOf("[") + 1;
      var last_ele = input.indexOf("]") - 1;
      const punctuation_list = [];

      //Account for X[,!.?] punctuations at the end
      // for (var i = first_ele; i <= last_ele; i++) {
      //   punctuation_list.push(input[i]);
      // }

      let word = "";
      for (var i = first_ele; i <= last_ele; i++) {
        console.log(`input[i] = ${input[i]}`);
        if (input[i] === " ") {
          punctuation_list.push(word);
          word = "";
        } else {
          word = word + input[i];
          console.log(`word = ${word}`);
        }
      }

      punctuation_list.push(word);
      if (input.indexOf("*") > 0) {
        this.find_any_number_inbetweem(
          input,
          this.state.text,
          punctuation_list
        );
      } else if (input.indexOf("...") > 0) {
        this.find_only_3_word_inbetween(
          input,
          this.state.text,
          punctuation_list
        );
      } else if (input.indexOf("..") > 0) {
        this.find_only_2_word_inbetween(
          input,
          this.state.text,
          punctuation_list
        );
      } else if (input.indexOf(".") > 0) {
        this.find_only_1_word_inbetween(
          input,
          this.state.text,
          punctuation_list
        );
      } else if (input.indexOf("w") === 0) {
        this.start_with_char(input, this.state.text, punctuation_list);
      } else if (input[input.indexOf("[") - 1] === "w") {
        this.ends_with_char(input, this.state.text, punctuation_list);
      } else if (input.indexOf("&") > 0) {
        this.pair_words(input, this.state.text, punctuation_list);
      } else {
        this.find_identical_match(input, this.state.text, punctuation_list);
      }
    } else {
      if (input === "XX") {
        this.double_words(this.state.text);
      } else if(input[0] === 'X' && input[input.length - 1] ==='X'){
        this.middle_words(input.slice(1, input.length -1) ,this.state.text);
      } 
      else if (input.indexOf("*") > 0) {
        this.find_any_number_inbetweem(input, this.state.text);
      } else if (input.indexOf("...") > 0) {
        this.find_only_3_word_inbetween(input, this.state.text);
      } else if (input.indexOf("..") > 0) {
        this.find_only_2_word_inbetween(input, this.state.text);
      } else if (input.indexOf(".") > 0) {
        this.find_only_1_word_inbetween(input, this.state.text);
      } else if (input.indexOf("w") === 0) {
        this.start_with_char(input, this.state.text);
      } else if (input.slice(-1) === "w") {
        this.ends_with_char(input, this.state.text);
      } else if (input.indexOf("&") > 0) {
        this.pair_words(input, this.state.text);
      } else {
        this.find_identical_match(input, this.state.text);
      }
    }
  }

  render() {
    return (
      <div className="wrap">
        <div className="search">
          <input
            type="text"
            className="searchTerm"
            placeholder="Enter keyword..."
            value={this.state.value}
            onChange={this.handleChange}
          />
          <button
            className="searchButton"
            onClick={() => this.show_text(this.state.value)}
          >
            Search
          </button>
        </div>
        <br />
        <table className="container">
          <thead>
            <tr>
              <th>No.</th>
              <th>Speaker ID</th>
              <th>Before</th>
              <th>Word</th>
              <th>After</th>
            </tr>
          </thead>
          <tbody>{this.text_to_show}</tbody>
        </table>
      </div>
    );
  }
}

export default App;
