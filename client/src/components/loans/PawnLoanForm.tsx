<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div class="space-y-2">
      <label for="itemName" class="block text-sm font-medium">Item Name</label>
      <input 
        id="itemName"
        v-model="form.itemName"
        type="text"
        class="w-full p-2 border rounded"
        required
      />
    </div>

    <div class="space-y-2">
      <label for="itemValue" class="block text-sm font-medium">Item Value</label>
      <input 
        id="itemValue"
        v-model.number="form.itemValue"
        type="number"
        class="w-full p-2 border rounded"
        required
        min="0"
      />
    </div>

    <div class="space-y-2">
      <label for="loanAmount" class="block text-sm font-medium">Loan Amount</label>
      <input 
        id="loanAmount"
        v-model.number="form.loanAmount"
        type="number"
        class="w-full p-2 border rounded"
        required
        min="0"
        :max="form.itemValue"
      />
    </div>

    <button 
      type="submit"
      class="w-full bg-primary text-white py-2 rounded hover:bg-primary-dark"
    >
      Submit Application
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLoanStore } from '@/stores/loanStore'
import { useToast } from 'vue-toastification'

const router = useRouter()
const store = useLoanStore()
const toast = useToast()

const form = ref({
  itemName: '',
  itemValue: 0,
  loanAmount: 0
})

const handleSubmit = async () => {
  try {
    const newApplication = store.createApplication({
      itemName: form.value.itemName,
      itemValue: form.value.itemValue,
      loanAmount: form.value.loanAmount
    })
    
    toast.success('Application submitted successfully!')
    router.push('/applications')
  } catch (error) {
    toast.error('Failed to submit application')
    console.error('Application submission error:', error)
  }
}
</script>
