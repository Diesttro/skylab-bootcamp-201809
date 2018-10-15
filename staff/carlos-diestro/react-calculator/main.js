const root = document.getElementById('root')

const title = React.createElement('h1', null, 'hello world')

// const register = React.createElement('button', null, 'Register')

// const login = React.createElement('button', null, 'Login')

// const landing = React.createElement('section', null, title, register, login)

// ReactDOM.render(landing, root)

const items = ['ana', 'maria', 'peter', 'john'].map(name =>
        React.createElement('li', null, name)
    )

const names = React.createElement('ul', null, items)

ReactDOM.render([title, names], root)


