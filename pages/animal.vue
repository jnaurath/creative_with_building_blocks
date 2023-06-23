<script setup>
import { doc, onSnapshot, getDoc, updateDoc } from "firebase/firestore";

// Server Side
const { data } = useFetch('/api/animal');

// Client Side
onMounted(async () => {
    const { firestore } = useFirebase();
    const docRef = doc(firestore, `animals`, 'dog');
    onSnapshot(docRef, (snap) => {
        data.value = snap.data();
    });
});

const updateAnimal = async () => {
    const { firestore } = useFirebase();
    const docRef = doc(firestore, `animals`, 'dog');
    await updateDoc(docRef, {
        name: `dog-${Math.floor(Math.random() * 1000)}`,
    });
}
</script>

<template>
    <div>
        <h2>Data</h2>
        <pre>{{ data }}</pre>
        <button @click="updateAnimal">Update dog</button>
    </div>
</template>