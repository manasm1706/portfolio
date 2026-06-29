import * as React from "react"
import fishIconSrc from "@/assets/fish-icon.png"
import sharkSrc from "@/assets/shark.png"

interface Vector2 {
  x: number
  y: number
}

interface Fish {
  id: number
  position: Vector2
  velocity: Vector2
  acceleration: Vector2
  maxSpeed: number
  maxForce: number
  perceptionRadius: number
  separationRadius: number
  fear: number
  alive: boolean
  respawnAt: number
}

type SharkState = "cruise" | "stalk" | "lunge" | "cooldown"

interface Shark {
  position: Vector2
  velocity: Vector2
  heading: number
  state: SharkState
  stateChangedAt: number
  targetFishId: number | null
  speed: { cruise: number; stalk: number; lunge: number }
  eatRadius: number
  detectionRadius: number
  lungeTimer: number
  cooldownTimer: number
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  alpha: number
  life: number
}

interface MouseDisturbance {
  position: Vector2
  radius: number
  active: boolean
  strength: number
  life: number
}

// Tunable Configuration
const SIM_CONFIG = {
  // Flocking weights
  separationWeight: 1.8,
  alignmentWeight: 1.0,
  cohesionWeight: 1.0,
  fleeWeight: 2.5,
  wanderWeight: 0.25,

  // Fish constraints (made slower as requested)
  fishMaxSpeed: 0.8,
  fishPanickedSpeed: 2.0,
  fishMaxForce: 0.04, // lower max force for smooth non-jittery steering

  // Spatial Grid
  gridSize: 60, // approximate perceptionRadius
}

export default function FishSimulation() {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null)
  
  // Track mouse coordinates, click targets & interaction states in refs to bypass React re-renders
  const mouseRef = React.useRef<Vector2>({ x: 0, y: 0 })
  const mouseActiveRef = React.useRef<boolean>(false)
  const clickDisturbanceRef = React.useRef<MouseDisturbance | null>(null)
  const clickTargetRef = React.useRef<Vector2 | null>(null)
  const reducedMotionRef = React.useRef<boolean>(false)

  React.useEffect(() => {
    // Detect reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    reducedMotionRef.current = mediaQuery.matches
    const handleMotionChange = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches
    }
    mediaQuery.addEventListener("change", handleMotionChange)

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    
    // Auto-fit to the parent element dimensions (Hero start section height limit)
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth)
    let height = (canvas.height = canvas.parentElement?.clientHeight || 650)

    // Load Sprites
    const fishImg = new Image()
    fishImg.src = fishIconSrc

    const sharkImg = new Image()
    sharkImg.src = sharkSrc

    // Determine fish count dynamically by screen width
    const isMobile = width < 768
    const fishCount = isMobile ? 80 : 250 // slightly lower density for visual clarity

    // Initialize Fish Array
    const fishList: Fish[] = []
    for (let i = 0; i < fishCount; i++) {
      fishList.push({
        id: i,
        position: {
          x: Math.random() * width,
          y: Math.random() * height,
        },
        velocity: {
          x: (Math.random() - 0.5) * 1.0,
          y: (Math.random() - 0.5) * 1.0,
        },
        acceleration: { x: 0, y: 0 },
        maxSpeed: SIM_CONFIG.fishMaxSpeed,
        maxForce: SIM_CONFIG.fishMaxForce,
        perceptionRadius: SIM_CONFIG.gridSize,
        separationRadius: 24,
        fear: 0,
        alive: true,
        respawnAt: 0,
      })
    }

    // Initialize single Shark
    const shark: Shark = {
      position: { x: width / 2, y: height / 2 },
      velocity: { x: 0.6, y: 0 },
      heading: 0,
      state: "cruise",
      stateChangedAt: Date.now(),
      targetFishId: null,
      speed: { cruise: 0.6, stalk: 1.2, lunge: 3.5 },
      eatRadius: 25,
      detectionRadius: 180,
      lungeTimer: 0,
      cooldownTimer: 0,
    }

    // Initialize Particles List
    let particlesList: Particle[] = []

    // Helper functions for vector math
    const vecDist = (v1: Vector2, v2: Vector2) => {
      const dx = v1.x - v2.x
      const dy = v1.y - v2.y
      return Math.sqrt(dx * dx + dy * dy)
    }

    const vecLimit = (v: Vector2, limit: number) => {
      const mag = Math.sqrt(v.x * v.x + v.y * v.y)
      if (mag > limit && mag > 0) {
        v.x = (v.x / mag) * limit
        v.y = (v.y / mag) * limit
      }
    }

    // Handle Resize
    const handleResize = () => {
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth
      height = canvas.height = canvas.parentElement?.clientHeight || 650
    }
    window.addEventListener("resize", handleResize)

    // Handle Mouse Moves
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = { 
        x: e.clientX - rect.left, 
        y: e.clientY - rect.top 
      }
      mouseActiveRef.current = true
    }
    const handleMouseLeave = () => {
      mouseActiveRef.current = false
    }
    window.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseleave", handleMouseLeave)

    // Handle Canvas Clicks (Shark moves towards cursor click position)
    const handleCanvasClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      let clickX = e.clientX - rect.left
      let clickY = e.clientY - rect.top

      // Constrain clicked coordinates within safe boundaries of the Hero start section
      const padding = 30
      clickX = Math.max(padding, Math.min(width - padding, clickX))
      clickY = Math.max(padding, Math.min(height - padding, clickY))

      clickDisturbanceRef.current = {
        position: { x: clickX, y: clickY },
        radius: 12,
        active: true,
        strength: 1.0,
        life: 1.0,
      }

      // Set target for shark steering override
      clickTargetRef.current = { x: clickX, y: clickY }
    }
    canvas.addEventListener("click", handleCanvasClick)

    // Main Simulation Loop
    const loop = () => {
      const now = Date.now()
      ctx.clearRect(0, 0, width, height)

      // 1. Process Click Disturbance Ripple Effect
      if (clickDisturbanceRef.current) {
        const dist = clickDisturbanceRef.current
        dist.radius += 4
        dist.life -= 0.025
        dist.strength = dist.life

        if (dist.life <= 0) {
          clickDisturbanceRef.current = null
        } else {
          // Draw disturbance ring
          ctx.beginPath()
          ctx.arc(dist.position.x, dist.position.y, dist.radius, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(233, 221, 185, ${dist.life * 0.2})`
          ctx.lineWidth = 2.0
          ctx.stroke()
        }
      }

      // 2. Spatial Hash Grid construction for N-neighbors optimization
      const grid = new Map<string, Fish[]>()
      const getGridKey = (x: number, y: number) => {
        const cx = Math.floor(x / SIM_CONFIG.gridSize)
        const cy = Math.floor(y / SIM_CONFIG.gridSize)
        return `${cx},${cy}`
      }

      for (let i = 0; i < fishList.length; i++) {
        const fish = fishList[i]
        if (!fish.alive) continue
        const key = getGridKey(fish.position.x, fish.position.y)
        if (!grid.has(key)) {
          grid.set(key, [])
        }
        grid.get(key)!.push(fish)
      }

      // 3. Process each Fish (update forces & flocking)
      for (let i = 0; i < fishList.length; i++) {
        const fish = fishList[i]

        // Handle dead fish respawn timing
        if (!fish.alive) {
          if (now >= fish.respawnAt) {
            // Respawn off screen
            const edge = Math.floor(Math.random() * 4)
            let rx = 0, ry = 0
            if (edge === 0) { rx = -20; ry = Math.random() * height }      // left
            else if (edge === 1) { rx = width + 20; ry = Math.random() * height } // right
            else if (edge === 2) { rx = Math.random() * width; ry = -20 }      // top
            else { rx = Math.random() * width; ry = height + 20 }              // bottom

            fish.position = { x: rx, y: ry }
            // steer towards center
            const dx = width / 2 - rx
            const dy = height / 2 - ry
            const mag = Math.sqrt(dx * dx + dy * dy)
            fish.velocity = { x: (dx / mag) * 0.6, y: (dy / mag) * 0.6 }
            fish.acceleration = { x: 0, y: 0 }
            fish.fear = 0.5
            fish.alive = true
          }
          continue
        }

        // Reduced motion check - slow everything down and bypass fear
        if (reducedMotionRef.current) {
          fish.acceleration = { x: 0, y: 0 }
          fish.velocity.x += (Math.random() - 0.5) * 0.02
          fish.velocity.y += (Math.random() - 0.5) * 0.02
          vecLimit(fish.velocity, 0.2)
          fish.position.x += fish.velocity.x
          fish.position.y += fish.velocity.y
          
          // Wrap boundaries
          if (fish.position.x < -15) fish.position.x = width + 15
          if (fish.position.x > width + 15) fish.position.x = -15
          if (fish.position.y < -15) fish.position.y = height + 15
          if (fish.position.y > height + 15) fish.position.y = -15
          continue
        }

        // Initialize steering forces
        let sepForce = { x: 0, y: 0 }
        let aliForce = { x: 0, y: 0 }
        let cohForce = { x: 0, y: 0 }
        let fleeForce = { x: 0, y: 0 }

        let sepCount = 0
        let peerCount = 0

        let avgVelocity = { x: 0, y: 0 }
        let avgPosition = { x: 0, y: 0 }
        let maxNeighborFear = 0

        // Query spatial grid buckets (own bucket + 8 neighbours)
        const cellX = Math.floor(fish.position.x / SIM_CONFIG.gridSize)
        const cellY = Math.floor(fish.position.y / SIM_CONFIG.gridSize)

        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            const key = `${cellX + dx},${cellY + dy}`
            const cellFish = grid.get(key)
            if (!cellFish) continue

            for (let j = 0; j < cellFish.length; j++) {
              const other = cellFish[j]
              if (other.id === fish.id) continue

              const dist = vecDist(fish.position, other.position)
              
              if (dist < fish.separationRadius && dist > 0) {
                // Separation
                const diffX = fish.position.x - other.position.x
                const diffY = fish.position.y - other.position.y
                sepForce.x += diffX / dist
                sepForce.y += diffY / dist
                sepCount++
              }

              if (dist < fish.perceptionRadius) {
                avgVelocity.x += other.velocity.x
                avgVelocity.y += other.velocity.y
                avgPosition.x += other.position.x
                avgPosition.y += other.position.y
                
                if (other.fear > maxNeighborFear) {
                  maxNeighborFear = other.fear
                }
                peerCount++
              }
            }
          }
        }

        // Direct predator detection
        const distToShark = vecDist(fish.position, shark.position)
        if (distToShark < shark.detectionRadius) {
          fish.fear = 1.0 // Panic trigger
        } else {
          // Fear propagation from neighbors
          if (peerCount > 0 && maxNeighborFear > 0.05) {
            fish.fear += (maxNeighborFear - fish.fear) * 0.15
          }
          fish.fear *= 0.98 // Decay
        }

        // Click disturbance detection
        if (clickDisturbanceRef.current) {
          const clickDist = vecDist(fish.position, clickDisturbanceRef.current.position)
          if (clickDist < 120) {
            fish.fear = Math.max(fish.fear, clickDisturbanceRef.current.strength)
            // Steer away from click coordinates
            const dx = fish.position.x - clickDisturbanceRef.current.position.x
            const dy = fish.position.y - clickDisturbanceRef.current.position.y
            const forceMag = clickDist > 0 ? (1.0 / clickDist) * 3 : 3
            fleeForce.x += dx * forceMag
            fleeForce.y += dy * forceMag
          }
        }

        // Calculate flocking steering forces
        if (sepCount > 0) {
          sepForce.x /= sepCount
          sepForce.y /= sepCount
          const mag = Math.sqrt(sepForce.x * sepForce.x + sepForce.y * sepForce.y)
          if (mag > 0) {
            sepForce.x = (sepForce.x / mag) * fish.maxSpeed - fish.velocity.x
            sepForce.y = (sepForce.y / mag) * fish.maxSpeed - fish.velocity.y
            vecLimit(sepForce, fish.maxForce)
          }
        }

        if (peerCount > 0) {
          // Alignment
          avgVelocity.x /= peerCount
          avgVelocity.y /= peerCount
          const aliMag = Math.sqrt(avgVelocity.x * avgVelocity.x + avgVelocity.y * avgVelocity.y)
          if (aliMag > 0) {
            aliForce.x = (avgVelocity.x / aliMag) * fish.maxSpeed - fish.velocity.x
            aliForce.y = (avgVelocity.y / aliMag) * fish.maxSpeed - fish.velocity.y
            vecLimit(aliForce, fish.maxForce)
          }

          // Cohesion
          avgPosition.x /= peerCount
          avgPosition.y /= peerCount
          let cohDirX = avgPosition.x - fish.position.x
          let cohDirY = avgPosition.y - fish.position.y
          const cohMag = Math.sqrt(cohDirX * cohDirX + cohDirY * cohDirY)
          if (cohMag > 0) {
            cohForce.x = (cohDirX / cohMag) * fish.maxSpeed - fish.velocity.x
            cohForce.y = (cohDirY / cohMag) * fish.maxSpeed - fish.velocity.y
            vecLimit(cohForce, fish.maxForce)
          }
        }

        // Flee steering from Shark
        if (fish.fear > 0.05) {
          const escapeX = fish.position.x - shark.position.x
          const escapeY = fish.position.y - shark.position.y
          const mag = Math.sqrt(escapeX * escapeX + escapeY * escapeY)
          if (mag > 0) {
            fleeForce.x += (escapeX / mag) * SIM_CONFIG.fishPanickedSpeed - fish.velocity.x
            fleeForce.y += (escapeY / mag) * SIM_CONFIG.fishPanickedSpeed - fish.velocity.y
            vecLimit(fleeForce, fish.maxForce * 1.5)
          }
        }

        // Combine all steering forces
        fish.acceleration.x += sepForce.x * SIM_CONFIG.separationWeight
        fish.acceleration.y += sepForce.y * SIM_CONFIG.separationWeight
        fish.acceleration.x += aliForce.x * SIM_CONFIG.alignmentWeight
        fish.acceleration.y += aliForce.y * SIM_CONFIG.alignmentWeight
        fish.acceleration.x += cohForce.x * SIM_CONFIG.cohesionWeight
        fish.acceleration.y += cohForce.y * SIM_CONFIG.cohesionWeight
        fish.acceleration.x += fleeForce.x * SIM_CONFIG.fleeWeight
        fish.acceleration.y += fleeForce.y * SIM_CONFIG.fleeWeight

        // Wander force
        fish.acceleration.x += (Math.random() - 0.5) * SIM_CONFIG.wanderWeight
        fish.acceleration.y += (Math.random() - 0.5) * SIM_CONFIG.wanderWeight

        // Apply physical constraints limit (Craig Reynolds standard limit total steering force)
        vecLimit(fish.acceleration, fish.maxForce)

        fish.velocity.x += fish.acceleration.x
        fish.velocity.y += fish.acceleration.y

        // Max speed limit
        const dynamicMaxSpeed = SIM_CONFIG.fishMaxSpeed + (SIM_CONFIG.fishPanickedSpeed - SIM_CONFIG.fishMaxSpeed) * fish.fear
        vecLimit(fish.velocity, dynamicMaxSpeed)

        fish.position.x += fish.velocity.x
        fish.position.y += fish.velocity.y

        // Reset acceleration
        fish.acceleration = { x: 0, y: 0 }

        // Wrap screen bounds (within constrained parent height!)
        if (fish.position.x < -20) fish.position.x = width + 20
        if (fish.position.x > width + 20) fish.position.x = -20
        if (fish.position.y < -20) fish.position.y = height + 20
        if (fish.position.y > height + 20) fish.position.y = -20
      }

      // 4. Update the Predator (Shark AI + User Click follow priority override)
      if (reducedMotionRef.current) {
        shark.heading += (Math.random() - 0.5) * 0.02
        shark.velocity = { x: Math.cos(shark.heading) * 0.3, y: Math.sin(shark.heading) * 0.3 }
        shark.position.x += shark.velocity.x
        shark.position.y += shark.velocity.y
      } else {
        
        // Check for click target override (User Click Attraction)
        if (clickTargetRef.current) {
          const dx = clickTargetRef.current.x - shark.position.x
          const dy = clickTargetRef.current.y - shark.position.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist > 15) {
            // Speed up towards click target coordinates
            const targetSpeed = shark.speed.lunge
            shark.velocity = {
              x: (dx / dist) * targetSpeed,
              y: (dy / dist) * targetSpeed,
            }
            shark.heading = Math.atan2(dy, dx)
          } else {
            // Click target achieved
            clickTargetRef.current = null
          }
        } 
        
        // Otherwise, process normal state-machine logic
        else {
          // Find cluster density nearby
          let denseCentroid = { x: 0, y: 0 }
          let densityCount = 0
          const activeCentroids: Vector2[] = []

          for (let i = 0; i < fishList.length; i++) {
            const fish = fishList[i]
            if (!fish.alive) continue
            const dist = vecDist(shark.position, fish.position)
            if (dist < shark.detectionRadius) {
              denseCentroid.x += fish.position.x
              denseCentroid.y += fish.position.y
              densityCount++
              activeCentroids.push(fish.position)
            }
          }

          if (densityCount > 0) {
            denseCentroid.x /= densityCount
            denseCentroid.y /= densityCount
          }

          if (shark.state === "cruise") {
            // Slow wander noise
            shark.heading += (Math.random() - 0.5) * 0.1
            shark.velocity.x = Math.cos(shark.heading) * shark.speed.cruise
            shark.velocity.y = Math.sin(shark.heading) * shark.speed.cruise

            // Move cursor lure: blend mouse attraction
            if (mouseActiveRef.current) {
              const dx = mouseRef.current.x - shark.position.x
              const dy = mouseRef.current.y - shark.position.y
              const dist = Math.sqrt(dx * dx + dy * dy)
              if (dist > 40) {
                // Apply a small force towards cursor
                shark.velocity.x += (dx / dist) * 0.2
                shark.velocity.y += (dy / dist) * 0.2
              }
            }

            // Normalize and limit to cruise speed
            const speed = shark.speed.cruise
            const mag = Math.sqrt(shark.velocity.x * shark.velocity.x + shark.velocity.y * shark.velocity.y)
            if (mag > 0) {
              shark.velocity.x = (shark.velocity.x / mag) * speed
              shark.velocity.y = (shark.velocity.y / mag) * speed
              shark.heading = Math.atan2(shark.velocity.y, shark.velocity.x)
            }

            // Trigger stalk if cluster density > threshold (e.g. 5 fish detected)
            if (densityCount >= 5 && now - shark.stateChangedAt > 3000) {
              shark.state = "stalk"
              shark.stateChangedAt = now
            }
          } 
          
          else if (shark.state === "stalk") {
            if (densityCount === 0) {
              // Bug fix: Revert to cruise if no fish are in range to stalk, avoiding steering to (0,0)
              shark.state = "cruise"
              shark.stateChangedAt = now
            } else {
              // Steer towards densest cluster centroid
              const dx = denseCentroid.x - shark.position.x
              const dy = denseCentroid.y - shark.position.y
              const dist = Math.sqrt(dx * dx + dy * dy)
              
              if (dist > 10) {
                shark.velocity = {
                  x: (dx / dist) * shark.speed.stalk,
                  y: (dy / dist) * shark.speed.stalk,
                }
                shark.heading = Math.atan2(dy, dx)
              }

              // Trigger lunge if close enough to centroid (e.g. within 90px)
              if (dist < 90 && activeCentroids.length > 0) {
                // Select closest fish to lock target
                let minTargetDist = Infinity
                let chosenTargetId = null

                for (let i = 0; i < fishList.length; i++) {
                  const fish = fishList[i]
                  if (!fish.alive) continue
                  const fDist = vecDist(shark.position, fish.position)
                  if (fDist < minTargetDist) {
                    minTargetDist = fDist
                    chosenTargetId = fish.id
                  }
                }

                if (chosenTargetId !== null) {
                  shark.state = "lunge"
                  shark.targetFishId = chosenTargetId
                  shark.stateChangedAt = now
                  shark.lungeTimer = 75
                }
              }
            }
          } 
          
          else if (shark.state === "lunge") {
            let targetFish: Fish | null = null
            if (shark.targetFishId !== null) {
              targetFish = fishList[shark.targetFishId]
            }

            if (targetFish && targetFish.alive) {
              const dx = targetFish.position.x - shark.position.x
              const dy = targetFish.position.y - shark.position.y
              const dist = Math.sqrt(dx * dx + dy * dy)

              if (dist > 0) {
                shark.velocity = {
                  x: (dx / dist) * shark.speed.lunge,
                  y: (dy / dist) * shark.speed.lunge,
                }
                shark.heading = Math.atan2(dy, dx)
              }

              // Eating detection check
              if (dist < shark.eatRadius) {
                targetFish.alive = false
                targetFish.respawnAt = now + 1800 + Math.random() * 800

                // Spawn red blood/flesh particles on eat
                for (let k = 0; k < 12; k++) {
                  const angle = Math.random() * Math.PI * 2
                  const speed = 0.5 + Math.random() * 2.0
                  particlesList.push({
                    x: targetFish.position.x,
                    y: targetFish.position.y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    alpha: 1.0,
                    life: 1.0,
                  })
                }

                // Enter cooldown state
                shark.state = "cooldown"
                shark.targetFishId = null
                shark.stateChangedAt = now
                shark.cooldownTimer = 200
              }
            } else {
              shark.state = "cruise"
              shark.targetFishId = null
              shark.stateChangedAt = now
            }

            shark.lungeTimer--
            if (shark.lungeTimer <= 0 && shark.state === "lunge") {
              shark.state = "cooldown"
              shark.targetFishId = null
              shark.stateChangedAt = now
              shark.cooldownTimer = 180
            }
          } 
          
          else if (shark.state === "cooldown") {
            shark.heading += (Math.random() - 0.5) * 0.05
            shark.velocity = {
              x: Math.cos(shark.heading) * shark.speed.cruise,
              y: Math.sin(shark.heading) * shark.speed.cruise,
            }

            shark.cooldownTimer--
            if (shark.cooldownTimer <= 0) {
              shark.state = "cruise"
              shark.stateChangedAt = now
            }
          }
        }

        // Apply physical movement
        shark.position.x += shark.velocity.x
        shark.position.y += shark.velocity.y

        // Bound check shark (contain within the parent dimensions zone)
        const padding = 30
        if (shark.position.x < padding) {
          shark.position.x = padding
          shark.velocity.x = 0
        }
        if (shark.position.x > width - padding) {
          shark.position.x = width - padding
          shark.velocity.x = 0
        }
        if (shark.position.y < padding) {
          shark.position.y = padding
          shark.velocity.y = 0
        }
        if (shark.position.y > height - padding) {
          shark.position.y = height - padding
          shark.velocity.y = 0
        }
      }

      // 5. Update and Draw Particles
      particlesList = particlesList.filter((p) => {
        p.x += p.vx
        p.y += p.vy
        p.alpha -= 0.018
        p.life -= 0.018

        if (p.alpha <= 0) return false

        ctx.beginPath()
        ctx.arc(p.x, p.y, 3.0, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(191, 59, 42, ${p.alpha * 0.85})` // Brighter red particles
        ctx.fill()
        return true
      })

      // 6. Draw Fish (Made bolder and brighter using fish-icon.png)
      for (let i = 0; i < fishList.length; i++) {
        const fish = fishList[i]
        if (!fish.alive) continue

        const angle = Math.atan2(fish.velocity.y, fish.velocity.x)
        
        ctx.save()
        ctx.translate(fish.position.x, fish.position.y)
        ctx.rotate(angle)

        // Draw sprite or fallback chevron if image not loaded yet
        if (fishImg.complete && fishImg.naturalWidth !== 0) {
          const baseOpacity = 0.65 
          const panicBoost = fish.fear * 0.35
          ctx.globalAlpha = Math.min(1.0, baseOpacity + panicBoost)
          
          // Draw fish centered (fish icon points right by default)
          ctx.drawImage(fishImg, -14, -14, 28, 28)
        } else {
          ctx.beginPath()
          ctx.moveTo(8, 0)
          ctx.lineTo(-6, -5)
          ctx.lineTo(-3, 0)
          ctx.lineTo(-6, 5)
          ctx.closePath()

          const baseOpacity = 0.35 
          const panicBoost = fish.fear * 0.35
          ctx.fillStyle = `rgba(233, 221, 185, ${baseOpacity + panicBoost})`
          ctx.fill()

          ctx.strokeStyle = `rgba(233, 221, 185, ${baseOpacity + panicBoost + 0.25})`
          ctx.lineWidth = 1.8
          ctx.stroke()
        }
        
        ctx.restore()
      }

      // 7. Draw Shark (Made bold and brighter using shark.png)
      if (shark.position.x > 0 && shark.position.x < width) {
        ctx.save()
        ctx.translate(shark.position.x, shark.position.y)
        ctx.rotate(shark.heading)

        if (sharkImg.complete && sharkImg.naturalWidth !== 0) {
          if (shark.state === "lunge") {
            ctx.globalAlpha = 0.95
          } else if (shark.state === "stalk") {
            ctx.globalAlpha = 0.85
          } else {
            ctx.globalAlpha = 0.75
          }
          // Draw shark centered
          ctx.drawImage(sharkImg, -30, -30, 60, 60)
        } else {
          // Fallback dart shape
          ctx.beginPath()
          ctx.moveTo(25, 0)
          ctx.lineTo(-16, -10)
          ctx.lineTo(-10, 0)
          ctx.lineTo(-16, 10)
          ctx.closePath()

          if (shark.state === "lunge") {
            ctx.fillStyle = "rgba(191, 59, 42, 0.85)"
            ctx.strokeStyle = "rgba(191, 59, 42, 1.0)"
          } else if (shark.state === "stalk") {
            ctx.fillStyle = "rgba(191, 59, 42, 0.65)"
            ctx.strokeStyle = "rgba(191, 59, 42, 0.95)"
          } else {
            ctx.fillStyle = "rgba(191, 59, 42, 0.5)"
            ctx.strokeStyle = "rgba(191, 59, 42, 0.85)"
          }
          ctx.lineWidth = 2.8 
          ctx.fill()
          ctx.stroke()
        }
        ctx.restore()
      }

      animationFrameId = requestAnimationFrame(loop)
    }

    // Launch loop
    animationFrameId = requestAnimationFrame(loop)

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseleave", handleMouseLeave)
      canvas.removeEventListener("click", handleCanvasClick)
      mediaQuery.removeEventListener("change", handleMotionChange)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full block bg-transparent pointer-events-auto"
      style={{ zIndex: 0 }}
    />
  )
}
