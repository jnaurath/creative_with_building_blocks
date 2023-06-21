<template>
    <v-container class="bg-surface-variant">
        <v-row no-gutters>
          <v-col
            cols="12"
            sm="8"
          >
            <v-sheet class="ma-2">
              <canvas class="canvas" ref="canvas"></canvas>
            </v-sheet>
          </v-col>
          <v-col
            cols="12"
            sm="4"
            >
            <v-sheet class="ma-2 pa-2">
                <v-row no-gutters>
                    <v-col
                        sm="2"
                    >
                        <v-sheet class="ma-2">
                            <button @click="layer_down">down</button>
                        </v-sheet>
                    </v-col>
                    <v-col
                        sm="6"
                    >
                        <v-sheet class="ma-2">
                            <h2>Layer {{ layer + 1 }}</h2>
                        </v-sheet>
                    </v-col>
                    <v-col
                        sm="2"
                    >
                        <v-sheet class="ma-2">
                           <button @click="layer_up">up</button>
                        </v-sheet>
                    </v-col>

                    <v-col
                        sm="2"
                    >
                        <v-sheet class="ma-2">
                            <button @click="clearLayer">delete</button>
                        </v-sheet>
                    </v-col>
                </v-row>
                
                
                
                <v-color-picker
                    class="ma-2"
                    v-model="activeColor"
                ></v-color-picker>
                <!-- <button @click="changeColor('#E93E27')">red</button>
                <button @click="changeColor('#2737E9')">blue</button> -->
                <div>
                    <div v-for="(row, rowIndex) in matrix[layer]" :key="rowIndex" class="matrix-row">
                        <div v-for="(cell, colIndex) in row" :key="colIndex" :style="{ backgroundColor: cell.color }"
                            class="matrix-cell" @click="selectCell(rowIndex, colIndex)"
                            @mousemove="handleMouseMove(rowIndex, colIndex)" @mousedown="isMouseDown = true"
                            @mouseup="isMouseDown = false">
                        </div>
                    </div>
                </div>
            </v-sheet>
          </v-col>
        </v-row>
    </v-container>
</template>

<script>
import * as BABYLON from 'babylonjs'

export default {
    data() {
        return {
            matrix: [],
            matrixSize: 15,
            layer: 0,
            isMouseDown: false,
            emptyColor: "#FFFFFF",
            defaultColor: "#EEEEEE",
            activeColor: "#EEEEEE",
            materials: {}
        };
    },
    mounted() {
        this.initializeScene();
        this.createMatrix();
    },
    methods: {
        changeColor(hexCode) {
            this.activeColor = hexCode;
        },

        layer_down() {
            if (this.layer) {
                this.layer--
            }
        },

        layer_up() {
            if (this.layer < this.matrixSize - 1) {
                this.layer++
            }
        },

        clearLayer() {
            for (let i = 0; i < this.matrix[this.layer].length; i++) {
                for (let j = 0; j < this.matrix[this.layer][i].length; j++) {
                    this.disableCell(i, j, true);
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

            var material = new BABYLON.StandardMaterial("defaultMaterial", scene);
            material.alpha = 1;
            var color = this.hexToRgb(this.activeColor)
            material.diffuseColor = new BABYLON.Color3(color.r, color.g, color.b);
            this.materials[this.activeColor] = material;

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

        hexToRgb(hex) {
            hex = hex.replace("#", "");
            console.log("hex", hex);
            console.log("hex.substring(0, 2)", hex.substring(0, 2));
            console.log("hex.substring(2, 4)", hex.substring(2, 4));
            console.log("hex.substring(4, 6)", hex.substring(4, 6));
            const r = parseInt(hex.substring(0, 2), 16) / 255;
            const g = parseInt(hex.substring(2, 4), 16) / 255;
            const b = parseInt(hex.substring(4, 6), 16) / 255;
            return { r, g, b };
        },

        addCube(layer, rowIndex, colIndex) {
            var box_id = 'box_' + colIndex + '_' + rowIndex + '_' + layer;
            this.matrix[layer][rowIndex][colIndex]["box"] = BABYLON.MeshBuilder.CreateBox(box_id, { size: 1 }, this.scene);
            this.matrix[layer][rowIndex][colIndex]["box"].position = new BABYLON.Vector3(colIndex, layer + .5, -rowIndex);

            if (!this.materials[this.activeColor]) {
                this.createNewMaterial();
            }
            this.matrix[layer][rowIndex][colIndex]["box"].material = this.materials[this.activeColor];
        },

        createNewMaterial() {
            var material = new BABYLON.StandardMaterial(this.activeColor);
            material.alpha = 1;
            var color = this.hexToRgb(this.activeColor)
            material.diffuseColor = new BABYLON.Color3(color.r, color.g, color.b);
            this.materials[this.activeColor] = material;
        },

        deleteCube(layer, rowIndex, colIndex) {
            this.matrix[layer][rowIndex][colIndex]["box"].dispose()
            this.matrix[layer][rowIndex][colIndex]["box"] = null
        },

        createMatrix() {
            for (let i = 0; i < this.matrixSize; i++) {
                const zAxis = [];

                for (let j = 0; j < this.matrixSize; j++) {
                    const yAxis = [];

                    for (let k = 0; k < this.matrixSize; k++) {
                        yAxis.push({
                            active: false,
                            box: null,
                            color: this.emptyColor
                        });
                    }
                    zAxis.push(yAxis);
                }
                this.matrix.push(zAxis);
            }
        },

        enableCell(rowIndex, colIndex) {
            if (!this.matrix[this.layer][rowIndex][colIndex]["box"]) {
                this.addCube(this.layer, rowIndex, colIndex);
            }
            if (this.matrix[this.layer][rowIndex][colIndex].color != this.activeColor) {
                this.changeCubeColor(rowIndex, colIndex);
            }
            this.matrix[this.layer][rowIndex][colIndex].active = true;
            this.matrix[this.layer][rowIndex][colIndex].color = this.activeColor;
        },

        disableCell(rowIndex, colIndex, force) {
            if (this.matrix[this.layer][rowIndex][colIndex]["box"]) {
                if (this.matrix[this.layer][rowIndex][colIndex].color != this.activeColor && !force) {
                    this.changeCubeColor(rowIndex, colIndex);
                } else {
                    this.deleteCube(this.layer, rowIndex, colIndex);
                    this.matrix[this.layer][rowIndex][colIndex].active = false;
                    this.matrix[this.layer][rowIndex][colIndex].color = this.emptyColor
                }
            }
        },

        changeCubeColor(rowIndex, colIndex) {
            this.matrix[this.layer][rowIndex][colIndex].color = this.activeColor;
            this.deleteCube(this.layer, rowIndex, colIndex);
            this.addCube(this.layer, rowIndex, colIndex);

        },

        selectCell(rowIndex, colIndex) {
            if (this.matrix[this.layer][rowIndex][colIndex].active) {
                if (this.matrix[this.layer][rowIndex][colIndex].color != this.activeColor) {
                    this.changeCubeColor(rowIndex, colIndex);
                } else {
                    this.disableCell(rowIndex, colIndex, false);
                }
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
    width: 100%;
}
</style>
