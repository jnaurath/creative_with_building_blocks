<template>
    <v-container class="bg-surface-variant">
        <v-row no-gutters>
          <v-col
            cols="12"
            sm="8"
          >
            <v-sheet class="ma-2">
              <BabylonViewer :matrix="matrix" :activeColor="activeColor" ref="babylonViewer"/>
              <v-text-field v-model="artistName" label="Label" variant="outlined" placeholder="anonymous artist" persistent-clear @click:clear="onClear" clearable></v-text-field>
              <button @click="submit">submit</button>
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
import { addDoc, collection } from 'firebase/firestore';
import BabylonViewerComponent from '~/components/BabylonViewer.vue'


export default {
    components: {
        BabylonViewerComponent
    },
    data() {
        return {
            matrix: [],
            matrixSize: 15,
            layer: 0,
            isMouseDown: false,
            emptyColor: "#FFFFFF",
            defaultColor: "#EEEEEE",
            activeColor: "#EEEEEE",
            materials: {},
            artistName: "anonymous artist"
        };
    },
    mounted() {
        this.createMatrix();
    },
    methods: {
        changeColor(hexCode) {
            this.activeColor = hexCode;
        },

        async submit() {
            console.log('submit')
            console.log(this.matrix)
            
            const { firestore } = useFirebase();

            // Add a new document with a generated id.
            const docRef = await addDoc(collection(firestore, "submissions"), {
                creator: this.artistName,
                data: this.getActiveFields(),
                createdOn: new Date()
            });
        },

        getActiveFields() {
            let activeFieldsValue = []
            for (let layer = 0; layer < this.matrixSize; layer++) {
                for (let i = 0; i < this.matrix[layer].length; i++) {
                    for (let j = 0; j < this.matrix[layer][i].length; j++) {
                        if (this.matrix[layer][i][j].active) {
                            console.log('active')
                            console.log(layer, i, j, this.matrix[layer][i][j].color)
                            activeFieldsValue.push({'layer':layer, 'row': i, 'col': j, 'color': this.matrix[layer][i][j].color})
                        }
                    }
                }
            }
            console.log(activeFieldsValue)
            return activeFieldsValue;
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
                this.$refs.babylonViewer.addCube(this.layer, rowIndex, colIndex, this.activeColor);
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
                    this.$refs.babylonViewer.deleteCube(this.layer, rowIndex, colIndex);
                    this.matrix[this.layer][rowIndex][colIndex].active = false;
                    this.matrix[this.layer][rowIndex][colIndex].color = this.emptyColor
                }
            }
        },

        changeCubeColor(rowIndex, colIndex) {
            this.matrix[this.layer][rowIndex][colIndex].color = this.activeColor;
            this.$refs.babylonViewer.deleteCube(this.layer, rowIndex, colIndex);
            this.$refs.babylonViewer.addCube(this.layer, rowIndex, colIndex, this.activeColor);

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

</style>
