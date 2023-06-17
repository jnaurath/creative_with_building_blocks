<template>
  <div class="content-container">
    <div class="viewer-container">
      <canvas class="canvas" ref="canvas"></canvas>
    </div>
    <div class="buttons-container">      
      <button @click="layer_down">down</button>
      <h2>Layer {{layer + 1}}</h2>
      <button @click="layer_up">up</button>
      <div class="matrix">
        <div v-for="(row, rowIndex) in matrix[layer]" :key="rowIndex" class="row">
          <div
            v-for="(cell, colIndex) in row"
            :key="colIndex"
            class="cell"
            :class="{ active: cell.active }"
            @click="toggleCellActive(rowIndex, colIndex)"
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
      layer: 0
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
      var box_id = 'box_' + x + '_' + y + '_' + z;
      this.matrix[z][y][x]["box"] = BABYLON.MeshBuilder.CreateBox(box_id, { size: 1 }, this.scene);
      this.matrix[z][y][x]["box"].position = new BABYLON.Vector3(x, y + .5, -z);
    },
    deleteCube(x, y, z) {
      this.matrix[z][y][x]["box"].dispose()
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
    toggleCellActive(rowIndex, colIndex) {
      // debugger;
      if (this.matrix[this.layer][rowIndex][colIndex].active) {
        this.deleteCube(colIndex, this.layer, rowIndex);
      } else {
        this.addCube(colIndex, this.layer, rowIndex);
      }
      this.matrix[this.layer][rowIndex][colIndex].active = !this.matrix[this.layer][rowIndex][colIndex].active;
      
    },
  }
}
</script>

<style>
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
.matrix {
  display: flex;
  flex-wrap: wrap;
}

.row {
  display: flex;
}

.cell {
  width: 20px;
  height: 20px;
  border: 1px solid #000;
  background-color: #fff;
}

.cell.active {
  background-color: #000;
}

</style>
