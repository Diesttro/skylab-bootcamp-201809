function Button(props) {
    return <button onClick={props.onClick}>{props.operation}</button>
}

class App extends React.Component {
    state = { numberA: '', numberB: '', result: '' }

    keepNumberA = event => {
        const numberA = event.target.value

        this.setState({ numberA })
    }

    keepNumberB = event => {
        const numberB = event.target.value

        this.setState({ numberB })
    }

    add = () => {
        const numberA = parseFloat(this.state.numberA)
        const numberB = parseFloat(this.state.numberB)

        const result = numberA + numberB

        this.setState({ result })
    }

    subtract = () => {
        const numberA = parseFloat(this.state.numberA)
        const numberB = parseFloat(this.state.numberB)

        const result = numberA - numberB

        this.setState({ result })
    }

    multiply = () => {
        const numberA = parseFloat(this.state.numberA)
        const numberB = parseFloat(this.state.numberB)

        const result = numberA * numberB

        this.setState({ result })
    }

    divide = () => {
        const numberA = parseFloat(this.state.numberA)
        const numberB = parseFloat(this.state.numberB)

        const result = numberA / numberB

        this.setState({ result })
    }

    render() {
        return <div>
            <input value={this.state.numberA} type="number" onChange={this.keepNumberA} />

            <Button operation="+" onClick={this.add}></Button>
            <Button operation="-" onClick={this.subtract}></Button>
            <Button operation="*" onClick={this.multiply}></Button>
            <Button operation="/" onClick={this.divide}></Button>

            <input value={this.state.numberB} type="number" onChange={this.keepNumberB} />

            =<input value={this.state.result} type="result" disabled />
        </div>
    }
}

ReactDOM.render(<App />, document.getElementById('root'))