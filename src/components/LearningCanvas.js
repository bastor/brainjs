import React from "react";
import every from "lodash/every";
import css from "./LearningCanvas.css";
import { CANVAS_HEIGHT, CANVAS_WIDTH, CELL_SIZE } from "../sizes";

const FONT_SIZE = 300;

export default class LearningCanvas extends React.Component {
  
  componentDidMount() {
    this.drawLetter(this.props.x, this.props.y);
  }
  
  componentDidUpdate() {
    const context = this.canvasRef.getContext("2d");
    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    this.drawLetter(this.props.x, this.props.y);
  }
  
  
  fillCell(x, y) {
    const context = this.canvasRef.getContext("2d");
    context.beginPath();
    context.moveTo(x * CELL_SIZE, y * CELL_SIZE);
    context.lineTo((x + 1) * CELL_SIZE, y * CELL_SIZE);
    context.lineTo((x + 1) * CELL_SIZE, (y + 1) * CELL_SIZE);
    context.lineTo(x * CELL_SIZE, (y + 1) * CELL_SIZE);
    context.lineTo(x * CELL_SIZE, y * CELL_SIZE);
    context.fill();
  }

  isCellEmpty(x, y) {
    const context = this.canvasRef.getContext("2d");
    const cellData = Array.from(
      context.getImageData(
        x * CELL_SIZE + 1,
        y * CELL_SIZE + 1,
        CELL_SIZE - 1,
        CELL_SIZE - 1
      ).data
    );
    return every(cellData, d => d === 0);
  }

  sampleLetterData() {
    const data = [];
    for (let y = 0; y * CELL_SIZE < CANVAS_HEIGHT; y += 1) {
      for (let x = 0; x * CELL_SIZE <= CANVAS_WIDTH; x += 1) {
        if (this.isCellEmpty(x, y)) {
          data.push(0);
        } else {
          this.fillCell(x, y);
          data.push(1);
        }
      }
    }
    return data;
  }

  
  drawGrid() {
    const context = this.canvasRef.getContext("2d");
    for (let y = 0; y <= CANVAS_HEIGHT; y += CELL_SIZE) {
      for (let x = 0; x <= CANVAS_WIDTH; x += CELL_SIZE) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, CANVAS_HEIGHT);
        context.stroke();
        
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(CANVAS_WIDTH, y);
        context.stroke();
      }
    }
  }
  
  drawLetter(offsetX = 0, offsetY = 0) {
    const context = this.canvasRef.getContext("2d");
    const { letter, font } = this.props;
    context.font = `${FONT_SIZE}px ${font}`;
    context.fillText(`${letter}`, 50 + offsetX * CELL_SIZE, CANVAS_HEIGHT - 50 + offsetY * CELL_SIZE );
  }

  render() {
    return (
      <div>
        <canvas
          ref={r => {
            this.canvasRef = r;
          }}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className={css.LearningCanvas}
        />
      </div>
    );
  }
}
