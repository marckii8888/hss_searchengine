import React from "react";

class Search extends React.Component {
  constructor(props) {
    super(props);
    console.log(props.location.state);
    this.state = {
      current: props.location.state.current,
      prev: props.location.state.prev,
      next: props.location.state.next,
      word: props.location.state.word,
    };
  }

  render() {
    console.log(this.state.word);
    return (
      <div className="wrap">
        <table className="container">
          <thead>
            <tr>
              <th>No.</th>
              <th>Speaker ID</th>
              <th>Concordance</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>{this.state.prev.slice(0, this.state.prev.indexOf(":"))}</td>
              <td>{this.state.prev.slice(this.state.prev.indexOf(":") + 2)}</td>
            </tr>
            <tr>
              <td>2</td>
              <td>
                {this.state.current.slice(0, this.state.current.indexOf(":"))}
              </td>
              <td>
                {this.state.current.slice(
                  this.state.current.indexOf(":") + 2,
                  this.state.current.indexOf(this.state.word)
                )}
                <div style={{ color: "red" }}>{this.state.word}</div>
                {this.state.current.slice(
                  this.state.current.indexOf(this.state.word) +
                    this.state.word.length
                )}
              </td>
            </tr>
            <tr>
              <td>3</td>
              <td>{this.state.next.slice(0, this.state.next.indexOf(":"))}</td>
              <td>{this.state.next.slice(this.state.next.indexOf(":") + 2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default Search;
