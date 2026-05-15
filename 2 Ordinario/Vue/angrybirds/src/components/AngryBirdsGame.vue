<script setup>
import { onMounted, ref, onUnmounted } from 'vue'
import Matter from 'matter-js'

// Assets
import birdImg from '../assets/bird.png'
import pigImg from '../assets/pig.png'

const gameContainer = ref(null)
const score = ref(0)
const gameState = ref('ready') // ready, flying, win, lose
const birdsRemaining = ref(3)

let engine, render, runner, world
let bird, slingshot, mouseConstraint

const initGame = () => {
  const { Engine, Render, Runner, World, Bodies, Mouse, MouseConstraint, Constraint, Events } = Matter

  // Create engine
  engine = Engine.create()
  world = engine.world

  // Create renderer
  render = Render.create({
    element: gameContainer.value,
    engine: engine,
    options: {
      width: 1000,
      height: 600,
      wireframes: false,
      background: 'transparent'
    }
  })

  Render.run(render)

  // Create runner
  runner = Runner.create()
  Runner.run(runner, engine)

  // Add ground and boundaries
  const ground = Bodies.rectangle(500, 590, 1200, 40, { 
    isStatic: true, 
    render: { fillStyle: '#2c3e50' } 
  })
  World.add(world, ground)

  // Create the level
  createLevel(Bodies, World)

  // Create the slingshot and bird
  setupSlingshot(Bodies, World, Constraint, Mouse, MouseConstraint, Events)

  // Collision handling
  Events.on(engine, 'collisionStart', (event) => {
    event.pairs.forEach((pair) => {
      const { bodyA, bodyB } = pair
      if (bodyA.label === 'pig' || bodyB.label === 'pig') {
        const pig = bodyA.label === 'pig' ? bodyA : bodyB
        const other = bodyA.label === 'pig' ? bodyB : bodyA
        
        // Only destroy pig if impact is strong enough
        const force = other.speed * other.mass
        if (force > 5) {
          World.remove(world, pig)
          score.value += 100
          checkWinState()
        }
      }
    })
  })
}

const createLevel = (Bodies, World) => {
  // Simple structure
  const stackX = 750
  const stackY = 550
  
  const blocks = [
    // Foundation
    Bodies.rectangle(stackX - 40, stackY - 40, 20, 80, { render: { fillStyle: '#8d6e63' } }),
    Bodies.rectangle(stackX + 40, stackY - 40, 20, 80, { render: { fillStyle: '#8d6e63' } }),
    Bodies.rectangle(stackX, stackY - 90, 120, 20, { render: { fillStyle: '#8d6e63' } }),
    
    // Middle
    Bodies.rectangle(stackX - 30, stackY - 140, 20, 80, { render: { fillStyle: '#8d6e63' } }),
    Bodies.rectangle(stackX + 30, stackY - 140, 20, 80, { render: { fillStyle: '#8d6e63' } }),
    Bodies.rectangle(stackX, stackY - 190, 100, 20, { render: { fillStyle: '#8d6e63' } }),
  ]

  const pig = Bodies.circle(stackX, stackY - 120, 20, {
    label: 'pig',
    restitution: 0.5,
    render: {
      sprite: {
        texture: pigImg,
        xScale: 0.1,
        yScale: 0.1
      }
    }
  })

  World.add(world, [...blocks, pig])
}

const setupSlingshot = (Bodies, World, Constraint, Mouse, MouseConstraint, Events) => {
  const birdRadius = 20
  const anchorX = 200
  const anchorY = 450

  bird = Bodies.circle(anchorX, anchorY, birdRadius, {
    density: 0.004,
    render: {
      sprite: {
        texture: birdImg,
        xScale: 0.1,
        yScale: 0.1
      }
    }
  })

  slingshot = Constraint.create({
    pointA: { x: anchorX, y: anchorY },
    bodyB: bird,
    stiffness: 0.1,
    render: {
      visible: true,
      lineWidth: 5,
      strokeStyle: '#ff5722'
    }
  })

  // Add mouse control
  const mouse = Mouse.create(render.canvas)
  mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: { visible: false }
    }
  })

  World.add(world, [bird, slingshot, mouseConstraint])

  // Release mechanism
  Events.on(mouseConstraint, 'enddrag', (event) => {
    if (event.body === bird) {
      gameState.value = 'flying'
      setTimeout(() => {
        slingshot.bodyB = null
        slingshot.render.visible = false
      }, 20)
    }
  })

  // After launch logic
  Events.on(engine, 'afterUpdate', () => {
    if (gameState.value === 'flying' && bird.speed < 0.2 && bird.position.x > 300) {
      resetBird(Bodies, World, Constraint)
    }
  })
}

const resetBird = (Bodies, World, Constraint) => {
  if (birdsRemaining.value > 0) {
    birdsRemaining.value--
    gameState.value = 'ready'
    
    // Remove old bird
    World.remove(world, bird)
    
    // Create new bird
    const anchorX = 200
    const anchorY = 450
    bird = Bodies.circle(anchorX, anchorY, 20, {
      density: 0.004,
      render: {
        sprite: {
          texture: birdImg,
          xScale: 0.1,
          yScale: 0.1
        }
      }
    })
    
    slingshot.bodyB = bird
    slingshot.render.visible = true
    World.add(world, bird)
  } else {
    gameState.value = 'lose'
  }
}

const checkWinState = () => {
  const pigs = world.bodies.filter(b => b.label === 'pig')
  if (pigs.length === 0) {
    gameState.value = 'win'
  }
}

const restartGame = () => {
  window.location.reload()
}

onMounted(() => {
  initGame()
})

onUnmounted(() => {
  if (render) Render.stop(render)
  if (runner) Runner.stop(runner)
})
</script>

<template>
  <div class="game-wrapper">
    <div class="ui-overlay">
      <div class="glass-card score-card">
        <h2>Score: {{ score }}</h2>
        <p>Birds: {{ birdsRemaining }}</p>
      </div>

      <div v-if="gameState === 'win'" class="glass-card win-lose">
        <h1>Level Complete!</h1>
        <button @click="restartGame" class="btn">Play Again</button>
      </div>

      <div v-if="gameState === 'lose'" class="glass-card win-lose">
        <h1>Out of Birds!</h1>
        <button @click="restartGame" class="btn">Try Again</button>
      </div>
    </div>
    
    <div ref="gameContainer" class="canvas-container"></div>
    
    <div class="background-decor">
      <div class="sun"></div>
      <div class="horizon"></div>
    </div>
  </div>
</template>

<style scoped>
.game-wrapper {
  position: relative;
  width: 1000px;
  height: 600px;
  background: linear-gradient(180deg, #1e3c72 0%, #2a5298 100%);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0,0,0,0.5);
  border: 1px solid rgba(255,255,255,0.1);
}

.canvas-container {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
}

.ui-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 20;
  padding: 20px;
}

.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 15px 25px;
  color: white;
  pointer-events: auto;
}

.score-card {
  position: absolute;
  top: 20px;
  left: 20px;
}

.win-lose {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  min-width: 300px;
}

.btn {
  background: #ff5722;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  margin-top: 15px;
  transition: transform 0.2s, background 0.2s;
}

.btn:hover {
  background: #f4511e;
  transform: scale(1.05);
}

.background-decor {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.sun {
  position: absolute;
  top: 100px;
  right: 150px;
  width: 80px;
  height: 80px;
  background: radial-gradient(circle, #fff 0%, #ffd54f 70%);
  border-radius: 50%;
  box-shadow: 0 0 40px #ffd54f;
}

.horizon {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 100px;
  background: rgba(44, 62, 80, 0.5);
}
</style>
