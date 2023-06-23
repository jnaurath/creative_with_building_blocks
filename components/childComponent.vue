<template>
    <div>
        <h2>Child Component</h2>
        <p>Name: {{ dataObject.name }}</p>
        <p>Age: {{ dataObject.age }}</p>
        <p>Email: {{ dataObject.email }}</p>
        <button @click="callParentFunction">Call Parent Function</button>
    </div>
</template>

<script>
export default {
    props: {
        dataObject: {
            type: Object,
            required: true
        }
    },
    methods: {
        callParentFunction() {
            this.$emit('childFunction')
        },
        childFunction() {
            console.log('Child function called from Parent')
        }
    }
}
</script>
