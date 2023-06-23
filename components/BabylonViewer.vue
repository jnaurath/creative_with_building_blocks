<template>
    <div>
        <canvas class="canvas" ref="canvas"></canvas>
    </div>
</template>

<script>
import * as BABYLON from 'babylonjs'

export default {
    props: {
        matrix: {
            type: Array,
            required: true
        },
        activeColor: {
            type: String,
            required: false
        },
    },
    data() {
        return {
            materials: {},
        };
    },
    mounted() {
        this.initializeScene();
    },
    methods: {

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
            const r = parseInt(hex.substring(0, 2), 16) / 255;
            const g = parseInt(hex.substring(2, 4), 16) / 255;
            const b = parseInt(hex.substring(4, 6), 16) / 255;
            return { r, g, b };
        },

        addCube(layer, rowIndex, colIndex, activeColor) {
            var box_id = 'box_' + colIndex + '_' + rowIndex + '_' + layer;
            this.matrix[layer][rowIndex][colIndex]["box"] = BABYLON.MeshBuilder.CreateBox(box_id, { size: 1 }, this.scene);
            this.matrix[layer][rowIndex][colIndex]["box"].position = new BABYLON.Vector3(colIndex, layer + .5, -rowIndex);
            debugger
            if (!this.materials[activeColor]) {
                this.createNewMaterial(activeColor);
            }
            this.matrix[layer][rowIndex][colIndex]["box"].material = this.materials[activeColor];
        },

        createNewMaterial(activeColor) {
            var material = new BABYLON.StandardMaterial(activeColor);
            material.alpha = 1;
            var color = this.hexToRgb(activeColor)
            material.diffuseColor = new BABYLON.Color3(color.r, color.g, color.b);
            this.materials[activeColor] = material;
        },

        deleteCube(layer, rowIndex, colIndex) {
            this.matrix[layer][rowIndex][colIndex]["box"].dispose()
            this.matrix[layer][rowIndex][colIndex]["box"] = null
        }
    }
}

</script>

<style>

.canvas {
    width: 100%;
}
</style>