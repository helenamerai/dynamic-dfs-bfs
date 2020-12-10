import { Component, OnInit } from '@angular/core';
import { calculatePath } from '../app/shared/path';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'FinderApp';
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  type: any;

  //grid size
  width = 50;
  height = 50;

  grids: any;
  gRow = 15;
  gCol = 15;
  maze = [];
  graphGrid: any;

  xSource = 0;
  ySource = 0;
  xEnd = 0;
  yEnd = 0;

  pathGraph: any;
  startPos: any;
  targetPos: any;

  rowEnd = [];
  colEnd = [];
  rowStart = [];
  colStart = [];

  ngOnInit() {
    this.xSource = 1;
    this.ySource = 1;
    this.xEnd = this.gCol;
    this.yEnd = this.gRow;
    this.initMaze();
    this.initGrid();
  }

  initMaze() {
    this.maze = [];

    for (let i = 0; i < this.gRow; i++) {
      this.maze[i] = [];
      for (let j = 0; j < this.gCol; j++) {
        this.maze[i][j] = 0;
      }
    }

    this.getRowCol();
  }

  initGrid() {
    this.grids = this.initCells(this.maze, this.width, this.height);
    this.graphGrid = this.onRenderGrid(this.grids, 'grid', 'white', '#383838');
    this.drawGrid(this.graphGrid, this.grids);
    this.startPos = `${this.ySource - 1},${this.xSource - 1}`;
    this.targetPos = `${this.yEnd - 1},${this.xEnd - 1}`;
    drawPath(this.graphGrid, makePoint(this.startPos), this.grids.cellWidth, this.grids.cellHeight, 'yellow');
    drawPath(this.graphGrid, makePoint(this.targetPos), this.grids.cellWidth, this.grids.cellHeight, 'green');
  }

  initCells(maze, width, height) {
    let data = {
      data: maze,
      width: maze[0].length,
      height: maze.length,
      cellWidth: width,
      cellHeight: height
    }

    return data;
  }

  onRenderGrid(maze, type, bgColor, cellColor) {

    this.canvas = <HTMLCanvasElement>document.getElementById(type);
    this.canvas.width = maze.cellWidth * maze.width;
    this.canvas.height = maze.cellHeight * maze.height;

    return {
      canvasEl: this.canvas,
      ctx: this.canvas.getContext('2d'),
      primaryColor: bgColor,
      secondaryColor: cellColor,
    };
  }

  drawGrid(renderGraph, maze) {
    let ctx = renderGraph.ctx;
    let canvas = renderGraph.canvasEl;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < maze.height; y++) {
      for (let x = 0; x < maze.width; x++) {
        let cellType = maze.data[y][x];
        if (cellType == 1) {
          ctx.fillStyle = renderGraph.secondaryColor;
        } else {
          ctx.fillStyle = renderGraph.primaryColor;
        }
        ctx.fillRect(x * maze.cellHeight, y * maze.cellWidth,
          maze.cellHeight, maze.cellWidth);
        ctx.strokeStyle = "black";
        ctx.strokeRect(x * maze.cellHeight, y * maze.cellWidth,
          maze.cellHeight, maze.cellWidth);
      }
    }
  }

  runPath = (num, path, optimal, renderer, map, startPos, targetPos) => {
    let pos = 0;
    function render() {
      if (pos < path.length) {
        drawPath(renderer, makePoint(path[pos]), map.cellWidth, map.cellHeight, '#FBD7F0');
      } else {
        drawPath(renderer, makePoint(targetPos), map.cellWidth, map.cellHeight, 'red');
        optimal.forEach((posi) => {
          drawPath(renderer, makePoint(posi), map.cellWidth, map.cellHeight, 'red');
        });
        return;
      }
      pos += 1;
      setTimeout(render, num);
    }
    renderer.ctx.globalAlpha = 0.55;
    return render();
  };

  getRowCol() {
    this.rowEnd = [];
    this.colEnd = [];

    for (let i = 1; i < this.gRow; i++) {
      this.rowEnd.push(i + 1);
    }

    for (let i = 1; i < this.gCol; i++) {
      this.colEnd.push(i + 1);
    }
  }

  onRunClick(type) {
    this.type = type;
    this.initGrid();
    this.pathGraph = calculatePath(this.grids, this.startPos, this.targetPos, type);
    this.runPath(100, this.pathGraph[0], this.pathGraph[1], this.graphGrid, this.grids, this.startPos, this.targetPos);
  }

  onGenerateMaze() {
    if (this.gRow > 0 && this.gCol > 0) {
      this.xSource = 1;
      this.ySource = 1;
      this.xEnd = this.gRow;
      this.yEnd = this.gCol;
      this.initMaze();
      this.initGrid();
    } else {
      if (this.gRow == 0)
        this.gRow = 10;
      if (this.gCol == 0)
        this.gCol = 10;
      alert('Minimun No. of Row and Column is 1')
    }
  }

  onUpdateStart() {
    if (this.xSource > 0 && this.ySource > 0) {
      if (this.xSource > this.gRow || this.ySource > this.gCol) {
        if (this.xSource > this.gRow) {
          this.xSource = 1;
          alert('Number entered is more than number of Row existed')
        }
        if (this.ySource > this.gCol) {
          this.ySource = 1;
          alert('Number entered is more than number of Column existed')
        }
      } else {
        this.initMaze();
        this.initGrid();
      }
    } else {
      if (this.xSource == 0)
        this.xSource = 1;
      if (this.ySource == 0)
        this.ySource = 1;
    }
  }

  onUpdateEnd() {
    if (this.xEnd > 0 && this.yEnd > 0) {
      if (this.xEnd === 1 && this.yEnd === 1) {
        alert('Invalid Position')
        this.xEnd = this.gRow;
      }

      if (this.xEnd > this.gRow || this.yEnd > this.gCol) {
        if (this.xEnd > this.gRow) {
          this.xEnd = this.gRow;
          alert('Number entered is more than number of Row existed')
        }
        if (this.yEnd > this.gCol) {
          this.yEnd = this.gCol;
          alert('Number entered is more than number of Column existed')
        }
      } else {
        this.initMaze();
        this.initGrid();
      }
    } else {
      if (this.xEnd == 0) {
        this.xEnd = this.gRow;
      }
      if (this.yEnd == 0)
        this.yEnd = this.gCol;
      alert('Minimun number entered is 1')
    }
  }

  onMouseDown(event) {
    let x = Math.floor(event.offsetY / 50);
    let y = Math.floor(event.offsetX / 50);

    if (this.maze[x][y] == 0) {
      this.maze[x][y] = 1;
    } else {
      this.maze[x][y] = 0;
    }

    this.initGrid();
  }

}

const drawPath = (renderer, point, width, height, color) => {
  renderer.ctx.fillStyle = color;
  renderer.ctx.fillRect(point[0] * width, point[1] * height, width, height);
  renderer.ctx.strokeStyle = "black";
  renderer.ctx.strokeRect(point[0] * width, point[1] * height, width, height);
};

const makePoint = (point) => (
  point.split(',').map((v) => {
    return v | 0;
  })
)
