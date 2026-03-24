import { push as toast, createNotivue } from 'notivue'
import 'notivue/notification.css'
import 'notivue/animations.css'

const toastProvider = createNotivue()

export { toast, toastProvider }
