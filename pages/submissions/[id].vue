<template>
    <h1>Page for submission with ID : {{ submissionID }}</h1>
    <p>creator: {{submissionData.creator}}</p>
    <p>createdOn: {{ submissionData.createdOn }}</p>
    <BabylonViewer :matrix="matrix" :activeColor="activeColor" ref="babylonViewer"/>
</template>

<script>
import { doc, onSnapshot } from "firebase/firestore";
import { ref } from 'vue'

export default {
    data() {
        return {
            submissionID: useRoute().params.id,
            submissionData: ref({ creator: '', createdOn: '', data: [] }),
            matrix: [],
            matrixSize: 15,
            activeColor: "#EEEEEE",
        }
    },
    async mounted() {
        console.log("0")

        this.createMatrix();
        await this.getSubmissionData();
        console.log("3")

        console.log(this.matrix);
        
    },
    methods: {
        getSubmissionData() {
            const { firestore } = useFirebase();
            const docRef = doc(firestore, `submissions`, this.submissionID);

            onSnapshot(docRef, (snap) => {
                this.submissionData = snap.data();
                console.log(this.submissionData);
                console.log("1")
                this.fillMatrix();
            });
            console.log("2")
        },
        fillMatrix() {
            console.log(this.submissionData.data)
            this.submissionData.data.forEach(element => {
                console.log(element);
                this.matrix[element.layer][element.row][element.col].active = true;
                this.matrix[element.layer][element.row][element.col].color = this.activeColor;
                this.$refs.babylonViewer.addCube(element.layer, element.row, element.col, element.color);
            });
            console.log(this.matrix);
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
    }
}
</script>