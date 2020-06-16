import { DO_MIX_COLORS } from '../actions'
import { COLORS, CELL_COUNT } from '../../Params'

export default function mixColors(state = COLORS, action) {
    if (action.type === DO_MIX_COLORS) {
        let newState = []

        for (let index = 0; index < CELL_COUNT; index++) {
            let randomColor = state[Math.floor(Math.random() * state.length)]
            let countColor  = newState.filter((color) => color === randomColor);

            if (countColor.length < 2) {
                newState.push(randomColor)
            } else {
                index--
            }
        }

        return newState
    }

    return state
}

