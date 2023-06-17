<template>
  <div class="content-container">
    <div class="viewer-container">
      <canvas class="canvas" ref="canvas"></canvas>
    </div>
    <div class="buttons-container">      
      <button @click="layer_down">down</button>
      <h2>Layer {{layer + 1}}</h2>
      <button @click="layer_up">up</button>
      <button @click="clearLayer">delete</button>
      <div>
        <div v-for="(row, rowIndex) in matrix[layer]" :key="rowIndex" class="matrix-row">
          <div
            v-for="(cell, colIndex) in row"
            :key="colIndex"
            :class="['matrix-cell', { selected: cell.active }]"
            @click="selectCell(rowIndex, colIndex)"
            @mousemove="handleMouseMove(rowIndex, colIndex)"
            @mousedown="isMouseDown = true"
            @mouseup="isMouseDown = false"
          >
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import * as BABYLON from 'babylonjs'

export default {
  data() {
    return {
      matrix: [],
      matrixSize: 15,
      layer: 0,
      isMouseDown: false
    };
  },
  mounted() {
    this.initializeScene();
    this.createMatrix();
  },
  methods: {
    layer_down() {
      if (this.layer) {
        this.layer--
      }
    },
    layer_up() {
      if (this.layer < this.matrixSize-1) {
        this.layer++
      }
    },
    clearLayer() {
      for (let i = 0; i < this.matrix[this.layer].length; i++) {
        for (let j = 0; j < this.matrix[this.layer][i].length; j++) {
          this.disableCell(i, j);
        }
      }
    },
    initializeScene() {
      const canvas = this.$refs.canvas

      // Initialize Babylon.js engine
      const engine = new BABYLON.Engine(canvas, true)

      // Create scene
      const scene = new BABYLON.Scene(engine)
      // scene.debugLayer.show()

      var plane = BABYLON.MeshBuilder.CreatePlane("plane", { height: 20, width: 20, sideOrientation: BABYLON.Mesh.DOUBLESIDE });
      plane.rotation.x = BABYLON.Tools.ToRadians(90)
      plane.position = new BABYLON.Vector3(7, 0, -7);

      // Create camera
      // Parameters: name, alpha, beta, radius, target position, scene
      const camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(10, 0, -10), scene);

      // Positions the camera overwriting alpha, beta, radius
      camera.setPosition(new BABYLON.Vector3(25, 20, -25));

      // This attaches the camera to the canvas
      camera.attachControl(canvas, true, true);

      // Create light
      const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), scene)

      // Render loop
      engine.runRenderLoop(() => {
        scene.render()
      })

      // Handle window resize
      window.addEventListener('resize', () => {
        engine.resize()
      })

      this.scene = scene
    },
    addCube(x, y, z) {
      if (!this.matrix[z][y][x]["box"]) {
        var box_id = 'box_' + x + '_' + y + '_' + z;
        this.matrix[z][y][x]["box"] = BABYLON.MeshBuilder.CreateBox(box_id, { size: 1 }, this.scene);
        this.matrix[z][y][x]["box"].position = new BABYLON.Vector3(x, y + .5, -z);
      }
    },
    deleteCube(x, y, z) {
      if (this.matrix[z][y][x]["box"]) {
        this.matrix[z][y][x]["box"].dispose()
        this.matrix[z][y][x]["box"] = null
      }
    },
    createMatrix() {
      for (let i = 0; i < this.matrixSize; i++) {
        const zAxis = [];

        for (let j = 0; j < this.matrixSize; j++) {
          const yAxis = [];

          for (let k = 0; k < this.matrixSize; k++) {
            yAxis.push({
                active: false,
                box: null
              });
          }
          zAxis.push(yAxis);
        }

        this.matrix.push(zAxis);
      }
    },
    enableCell(rowIndex, colIndex) {
      this.addCube(colIndex, this.layer, rowIndex);
      this.matrix[this.layer][rowIndex][colIndex].active = true;
    },
    disableCell(rowIndex, colIndex) {
      this.deleteCube(colIndex, this.layer, rowIndex);
      this.matrix[this.layer][rowIndex][colIndex].active = false;
    },

    selectCell(rowIndex, colIndex) {
      if (this.matrix[this.layer][rowIndex][colIndex].active) {
        this.disableCell(rowIndex, colIndex);
      } else {
        this.enableCell(rowIndex, colIndex);
      }
    },

    handleMouseMove(rowIndex, colIndex) {
      if (this.isMouseDown) {
        // Set the selected state of the cell while dragging
        this.enableCell(rowIndex, colIndex);
      }
    },
  }
}
</script>

<style>

.matrix-row {
  display: flex;
}

.matrix-cell {
  width: 20px;
  height: 20px;
  border: 1px solid #ccc;
  cursor: pointer;
}

.selected {
  background-color: #ccc;
}

.content-container {
  display: flex;
}
.viewer-container {
  flex: 7;
  align-items: center;
  justify-content: center;
  height: 80vh;
}

.buttons-container {
  flex: 3;
  align-items: center;
  justify-content: center;
}

.canvas {
  height: 100%;
}
/*.matrix-row {
  display: flex;
  flex-wrap: wrap;
}

.row {
  display: flex;
}

.matrix-cell {
  width: 20px;
  height: 20px;
  border: 1px solid #000;
  background-color: #fff;
}

.matrix-cell.active {
  background-color: #000;
}
*/
</style>
