<template>
    <h1>Submissions</h1>
    <div>
        <ul>
            <li v-for="submission in submissionData" :key="submission.id">
                {{ submission.creator }}
            </li>
        </ul>
    </div>
</template>

<script>
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
export default {
    data() {
        return {
            submissionData: []
        }
    },
    async mounted() {
        const { firestore } = useFirebase();


        const collectionRef = collection(firestore, "submissions");
        const unsubscribe = onSnapshot(collectionRef, (collectionSnapshot) => {
            this.submissionData = [];
            collectionSnapshot.forEach((doc) => {
                this.submissionData.push(doc.data());
            });
            // console.log("Current cities in CA: ", cities.join(", "));
        });


        // const submissionCol = collection(firestore, 'submissions');
        
        // const citySnapshot = await getDocs(submissionCol);
        // this.submissionData = citySnapshot.docs.map(doc => doc.data());
        // console.log(this.submissionData);
    }
}
</script>