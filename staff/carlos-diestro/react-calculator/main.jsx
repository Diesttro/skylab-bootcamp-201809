const root = document.getElementById('root')

class Input extends React.Component {
    state = {
        type: '',
        value : ''
    }

    updateValue = (event) => {
        console.log(event)
        this.setState({ value: event.target.value })
    }

    render() {
        return <input type={this.props.type} value={this.state.value} onChange={this.updateValue} />
    }
}

class Button extends React.Component {
    state = { operation: this.props.operation }

    whenClicked = () => {
        this.props.whenClicked()
    }

    render() {
        return <button onClick={this.whenClicked}>{this.state.operation}</button>
    }
}

class App extends React.Component {
    render() {
        return <section>
            <Input type="number" />
            <Button operation="+" />
            <Button operation="-" />
            <Button operation="*" />
            <Button operation="/" />
        </section>
    }
}

ReactDOM.render(<App />, root)


