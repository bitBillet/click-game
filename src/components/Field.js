import React from 'react';
import { DO_MIX_COLORS } from '../store/actions'
import { connect } from 'react-redux'
import { CELL_COUNT } from '../Params'

/**
 * Основное поле игры
 */
class Field extends React.Component {
    constructor() {
        super()
        /** @type {Object} Последняя выбранная ячейка, DOM-элемент. */
        this.currentCell = null

        /** @type {string} Последний выбранный цвет для ячейки. */
        this.currentColor = null

        /** @type {int} Счетчик нажатий на ячейки. */
        this.clickIndex = 0

        /** @type {bool} разрешено ли действи клика. */
        this.canClick = true

        /** @type {int} Текущее кол-во пар успешно выбранных ячеек. */
        this.colorsPair = 0
    }

    componentDidMount() {
        this.props.mixColors()
    }

    /**
     * Проверка на совпадение цвета с текущим
     *
     * @param string color текущий цвет
     * 
     * @return bool
     */
    getStatus(color) {
        return this.currentColor === color
    }

    /**
     * Запуск анимации
     * 
     * @return void
     */
    doAnimate(event) {
        const isActive = Boolean(event.target.style.background)
        if (false === this.canClick || true === isActive){
            return
        }
        
        event.target.classList.add('animate')
    }

    /**
     * Обработка ячейки
     *
     * @param int index порядковый номер случайного цвета в сторе
     * 
     * @return void
     */
    compareColors(index, event) {
        this.clickIndex++
        const color = this.props.colors[index]

        if (this.clickIndex === 2 && this.getStatus(color)) {
            this.setSuccess(color, event.target)
        } else if (this.clickIndex === 1) {
            this.setFirstColor(color, event.target)
        } else {
            this.setError(color, event.target)
        }
    }

    /**
     * Установка цвета при первом выборе ячейки
     *
     * @param string color текущий цвет
     * @param Object cell  окрашиваемая ячейка
     * 
     * @return void
     */
    setFirstColor(color, cell) {
        cell.classList.remove('animate')
        cell.style.background = color
        this.currentCell      = cell
        this.currentColor     = color
    }

    /**
     * Установка цвета при успешном втором попадании
     *
     * @param string color текущий цвет
     * @param Object cell  окрашиваемая ячейка
     * 
     * @return void
     */
    setSuccess(color, cell) {
        this.colorsPair++
        cell.style.background = color
        this.currentCell      = null
        this.currentColor     = null
        this.clickIndex       = 0
        
        if (this.colorsPair === 8) {
            setTimeout(() => alert('Игра окончена'))
        }
    }

    /**
     * Сброс цвета при неудачном втором попадании
     *
     * @param string color текущий цвет
     * @param Object cell  окрашиваемая ячейка
     * 
     * @return void
     */
    setError(color, cell) {
        cell.style.background = color
        this.canClick = false;
        setTimeout(() => {
            cell.classList.remove('animate')
            cell.style.background             = ''
            this.currentCell.style.background = ''
            this.currentColor                 = null
            this.clickIndex                   = 0
            this.canClick                     = true
        }, 500)
    }

    /**
     * {Render}
     */
    render() {
        const tiles = [];
        for (let index = 0; index < CELL_COUNT; index++) {
            tiles.push(
                <div 
                    className="cell" 
                    key={index} 
                    onClick={this.doAnimate.bind(this)}
                    onAnimationEnd={this.compareColors.bind(this, index)}
                ></div>
            )
        }

        return (
        <div className="field">
            {tiles}
        </div>
        )
    }
}

export default connect(
    state => ({
        colors : state,
    }),
    dispatch => ({
        mixColors() {
            dispatch({type: DO_MIX_COLORS})
        },
    })
)(Field)