import React from "react";
import brain from "brain.js";
import flatten from "lodash/flatten";
import LearningCanvas from "./components/LearningCanvas";
import DrawingCanvas from "./components/DrawingCanvas";
import css from "./App.css";

const letters = "O<>".split("");
const fonts = ["Ariel", "Comic Sans MS", "Courier", "Times"];

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.net = new brain.NeuralNetwork();
    this.lettersRef = [];
    this.learningData = [];
    this.state = {
      learning: false,
      x: -3,
      y: -3,
    };
    this.positions = [];
    for (let x=-3;x<=3;x+=1) {
      for (let y = -3; y <= 3; y += 1) {
        this.positions.push({x, y})
      }
    }
  }
  
  startLearning() {
    this.setState({learning: true, x: -3, y: -3})
    this.interval = setInterval((() => this.draw()), 250)
  }
  
  stopLearning() {
    clearInterval(this.interval);
    this.setState({learning: false})
    this.net.train(flatten(this.learningData));
  }

  draw() {
      if (this.positions.length > 0) {
        const {x, y} = this.positions.pop()
        this.setState({x,y}, () => {
          const trainingData = []
          trainingData.push(
            fonts.map(font =>
              letters.map(letter => {
                const data = this.lettersRef[font][letter].sampleLetterData();
                this.lettersRef[font][letter].drawLetter(x, y);
                return {input: data, output: {[letter]: 1}};
              })
            )
          );
          this.learningData = [...this.learningData, flatten(...trainingData)];
        })
      }
  }
  
  guessLetter(data) {
    const result = this.net.run(data)
    this.setState({ result });
  }

  drawResults() {
    return this.state.result
      ? letters.map((letter) => `${letter}: ${Number(this.state.result[letter]* 100).toFixed(2)}%`).join(',')
      : ''
  }
  
  renderLearningCanvas(font) {
    return (
      <div className={css.learningContainer} key={`${font}`}>
        {letters.map(letter => (
          <LearningCanvas key={`${font}${letter}`}
                          x={this.state.x}
                          y={this.state.y}
                          ref={r => {
                            this.lettersRef[font] = this.lettersRef[font] || [];
                            this.lettersRef[font][letter] = r;
                          }}
                          letter={letter}
                          font={font}
          />
        ))}
      </div>
    );
  }
  
  render() {
    return (
      <div>
        <div>
          <DrawingCanvas onChange={data => this.guessLetter(data)} />
          {!this.state.learning && <div>You most probably draw letter: {this.drawResults()}</div>}
          <button onClick={() => this.startLearning()}>Start Learning</button>
          <button onClick={() => this.stopLearning()}>Stop learning</button>
        </div>
        {fonts.map(font => this.renderLearningCanvas(font))}
      </div>
    );
  }
}
