<template>
    <v-container>
        <v-row>
            <v-col
            v-for="submission in submissionData"
            :key="submission.id"
            cols="4"
            >
            <h3>{{n}}</h3>
            <NuxtLink :to="`/submissions/${submission.id}`">
                <v-card height="200">
                    <h3>{{ submission.creator }}</h3>
                </v-card>
            </NuxtLink>
            
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
export default {
    data() {
        return {
            submissionData: [],
            unsubscribe: null
        }
    },
    async mounted() {
        const { firestore } = useFirebase();


        const collectionRef = collection(firestore, "submissions");

        this.unsubscribe = onSnapshot(collectionRef, (collectionSnapshot) => {
            this.submissionData = [];
            this.submissionData = collectionSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))
            console.log("Current submissionData: ", this.submissionData);
        });
    },
    beforeDestroy() {
        if (this.unsubscribe) {
            console.log('unsubscribing')
            this.unsubscribe()
        }
    }
}
</script>