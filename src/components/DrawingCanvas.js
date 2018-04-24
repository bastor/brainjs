import React from "react";
import every from "lodash/every";
import css from "./DrawingCanvas.css";

import { CANVAS_HEIGHT, CANVAS_WIDTH, CELL_SIZE } from "../sizes";

export default class DrawingCanvas extends React.Component {
  constructor(props) {
    super(props);
    this.flag = false;
    this.prevX = 0;
    this.currX = 0;
    this.prevY = 0;
    this.currY = 0;
  }

  handleMouse(eventType, x, y) {
    const canvas = this.canvasRef;
    const context = this.canvasRef.getContext("2d");
    if (eventType === "down") {
      this.prevX = this.currX;
      this.prevY = this.currY;
      this.currX = x - canvas.offsetLeft;
      this.currY = y - canvas.offsetTop;
      this.flag = true;
    }
    if (eventType === "up" || eventType === "out") {
      this.flag = false;
    }
    if (eventType === "move") {
      if (this.flag) {
        this.prevX = this.currX;
        this.prevY = this.currY;
        this.currX = x - canvas.offsetLeft;
        this.currY = y - canvas.offsetTop;
        context.beginPath();
        context.moveTo(this.prevX, this.prevY);
        context.lineTo(this.currX, this.currY);
        context.strokeStyle = "black";
        context.lineWidth = CELL_SIZE;
        context.stroke();
        context.closePath();
      }
    }
    this.props.onChange(this.sampleLetterData());
  }

  sampleLetterData() {
    const data = [];
    for (let y = 0; y * CELL_SIZE < CANVAS_HEIGHT; y += 1) {
      for (let x = 0; x * CELL_SIZE <= CANVAS_WIDTH; x += 1) {
        if (this.isCellEmpty(x, y)) {
          data.push(0);
        } else {
          data.push(1);
        }
      }
    }
    return data;
  }

  clearCanvas() {
    const context = this.canvasRef.getContext("2d");
    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
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

  render() {
    return (
      <div>
        <canvas
          ref={r => {
            this.canvasRef = r;
          }}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className={css.DrawingCanvas}
          onMouseDown={e => this.handleMouse("down", e.clientX, e.clientY)}
          onMouseUp={e => this.handleMouse("up", e.clientX, e.clientY)}
          onMouseOut={e => this.handleMouse("out", e.clientX, e.clientY)}
          onMouseMove={e => this.handleMouse("move", e.clientX, e.clientY)}
        />
        <button onClick={() => this.clearCanvas()}>Clear</button>
      </div>
    );
  }
}
