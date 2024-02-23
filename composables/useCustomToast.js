import { useToast } from 'primevue/usetoast';
export function useCustomToast() {
    const $toast = useToast();
  
    function showSuccessToast(title, message) {
      $toast.add({ severity: 'success', summary: title || 'Success', detail: message })
    }
  
    function showErrorToast(title, message) {
      $toast.add({ severity: 'error', summary: title || 'Error', detail: message, life: 3000 })
    }
  
    return {
      showSuccessToast,
      showErrorToast
    }
}