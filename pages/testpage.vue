<template>
    <div>
        <h1>Parent Component</h1>
        <ChildComponent :dataObject="myDataObject" @childFunction="handleChildFunction" ref="child"/>
        <button @click="callChildFunction">Call Child Function</button>
    </div>
</template>

<script>
import ChildComponent from '~/components/childComponent.vue'

export default {
    components: {
        ChildComponent
    },
    data() {
        return {
            myDataObject: {
                name: 'John Doe',
                age: 30,
                email: 'john.doe@example.com'
            }
        }
    },
    methods: {
        handleChildFunction() {
            console.log('Child function called from Parent')
        },
        callChildFunction() {
            this.$refs.child.childFunction()
            this.$refs.childComponent.childFunction()
        }
    }
}
</script>
