import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export interface LoanApplication {
  id: string
  itemName: string
  itemValue: number
  loanAmount: number
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  updatedAt: string
}

export interface ActiveLoan {
  id: string
  applicationId: string
  startDate: string
  endDate: string
  amount: number
  interestRate: number
  status: 'active' | 'paid' | 'defaulted'
}

const STORAGE_KEY_APPLICATIONS = 'loan_applications'
const STORAGE_KEY_LOANS = 'active_loans'

export const useLoanStore = defineStore('loan', () => {
  const applications = ref<LoanApplication[]>([])
  const activeLoans = ref<ActiveLoan[]>([])

  // Load initial data from localStorage
  const loadStoredData = () => {
    const storedApplications = localStorage.getItem(STORAGE_KEY_APPLICATIONS)
    const storedLoans = localStorage.getItem(STORAGE_KEY_LOANS)
    
    if (storedApplications) {
      applications.value = JSON.parse(storedApplications)
    }
    if (storedLoans) {
      activeLoans.value = JSON.parse(storedLoans)
    }
  }

  // Save data to localStorage
  const saveData = () => {
    localStorage.setItem(STORAGE_KEY_APPLICATIONS, JSON.stringify(applications.value))
    localStorage.setItem(STORAGE_KEY_LOANS, JSON.stringify(activeLoans.value))
  }

  // Create new loan application
  const createApplication = (application: Omit<LoanApplication, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
    const newApplication: LoanApplication = {
      ...application,
      id: crypto.randomUUID(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    applications.value.push(newApplication)
    saveData()
    return newApplication
  }

  // Get all applications
  const getAllApplications = computed(() => applications.value)

  // Get all active loans
  const getAllActiveLoans = computed(() => activeLoans.value)

  // Initialize store
  loadStoredData()

  return {
    applications,
    activeLoans,
    createApplication,
    getAllApplications,
    getAllActiveLoans
  }
})
