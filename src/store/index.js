import { createStore } from 'redux'
import mix from './reducers/mix'

const store = createStore(mix)
export default store