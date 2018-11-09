

import { Component } from 'react'

class Particles extends Component {


    canvas = document.getElementById('canvas')

    container = document.getElementById('search')

    ctx = this.canvas.getContext('2d')
    
    nodes = []
    
    maxDist = 150
    
    totalPoints = 40

    
    generateNode() {

        let generateRand = () => {
            let rand = 1.5 - Math.random()
            return (rand > 1) ? rand : rand * (-1)
        }

        return {
            x: this.canvas.width * Math.random(),
            y: this.canvas.height * Math.random(),
            vx: generateRand(),
            vy: generateRand(),
            color: '#fff',
            border: '#000',
            radius: 2
        }
    }

    componentDidMount() {
        this.canvas.height = this.container.offsetHeight
        this.canvas.width = this.container.offsetWidth
        for (let i = 0; i < this.totalPoints; i++) this.nodes.push(this.generateNode())
        this.canvas.addEventListener('click', () => {
	
            this.nodes.forEach(node => {
                node.vx = -1
                node.vy *= -1
            })
        
        });
        this.loop()
    }
    
    
    
    loop = () => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    
        this.nodes.forEach(node => {
    
            node.x += node.vx
            node.y += node.vy
    
            if (node.x > this.canvas.width || node.x < 0) node.vx *= -1
            if (node.y > this.canvas.height || node.y < 0) node.vy *= -1
    
            this.ctx.beginPath()
            this.ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI)
            this.ctx.fillStyle = node.color
            this.ctx.fill()
            this.ctx.lineWidth = 1
            this.ctx.strokeStyle = node.border
		    this.ctx.stroke()
    
            this.nodes.forEach(node1 => {
    
                let dx = node.x - node1.x
                let dy = node.y - node1.y
    
                let dist = Math.sqrt(dx * dx + dy * dy)
                
                if (dist > this.maxDist) return
    
                this.ctx.beginPath()
                this.ctx.lineWidth = 1 - (dist / this.maxDist)
                this.ctx.strokeStyle = "#eee"
                this.ctx.moveTo(node.x, node.y)
                this.ctx.lineTo(node1.x, node1.y)
                this.ctx.stroke()
    
            })
    
        })
    
        window.requestAnimationFrame(this.loop)
    }


    render() {

        return null
    }

}

export default Particles
