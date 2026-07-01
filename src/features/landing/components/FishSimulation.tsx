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
  panicTimer: number
  alive: boolean
  respawnAt: number
  fearFactor: number
  speedFactor: number
}

type SharkState = "cruise" | "stalk" | "lunge" | "cooldown" | "dash"

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
  momentum: number
  fishesEatenCount: number
  dashTimer: number
  dashCooldownTimer: number
  trailPositions: Vector2[]
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  alpha: number
  life: number
  color: string
}

interface MouseDisturbance {
  position: Vector2
  radius: number
  active: boolean
  strength: number
  life: number
}

interface Ripple {
  x: number
  y: number
  spawnAt: number
  delay: number
  duration: number
}

// ─── Tunable Configuration ───────────────────────────────────────────────────
const SIM_CONFIG = {
  separationWeight: 1.8,
  alignmentWeight: 1.0,
  cohesionWeight: 1.0,
  fleeWeight: 2.5,
  wanderWeight: 0.25,

  fishMaxSpeed: 0.8,
  fishPanickedSpeed: 2.0,
  fishMaxForce: 0.04,

  fearRiseBlend: 0.15,
  fearDecay: 0.985,
  fearThreshold: 0.05,

  gridSize: 60,

  fishEdgeMargin: 85,
  sharkEdgeMargin: 150,

  // ── NEW: Corner repulsion — keeps schools from parking in dead corners ──
  cornerRepulsionRadius: 220,   // px from each corner where repulsion begins
  cornerRepulsionWeight: 1.1,   // tune 0.5 (subtle) – 1.5 (strong)
}

const getCruiseSpeed = (eaten: number) => {
  if (eaten <= 0) return 0.8
  if (eaten === 1) return 0.93
  if (eaten === 2) return 1.06
  if (eaten === 3) return 1.2
  if (eaten === 4) return 1.32
  if (eaten === 5) return 1.45
  if (eaten === 6) return 1.58
  return 1.8
}

const makeCubicBezier = (p1x: number, p1y: number, p2x: number, p2y: number) => {
  const A = (a1: number, a2: number) => 1.0 - 3.0 * a2 + 3.0 * a1
  const B = (a1: number, a2: number) => 3.0 * a2 - 6.0 * a1
  const C = (a1: number) => 3.0 * a1
  const calcBezier = (t: number, a1: number, a2: number) => ((A(a1, a2) * t + B(a1, a2)) * t + C(a1)) * t
  const calcSlope = (t: number, a1: number, a2: number) => 3.0 * A(a1, a2) * t * t + 2.0 * B(a1, a2) * t + C(a1)
  const getTForX = (x: number) => {
    let t = x
    for (let i = 0; i < 8; i++) {
      const xEst = calcBezier(t, p1x, p2x) - x
      if (Math.abs(xEst) < 1e-6) return t
      const d = calcSlope(t, p1x, p2x)
      if (Math.abs(d) < 1e-6) break
      t -= xEst / d
    }
    return t
  }
  return (x: number) => calcBezier(getTForX(x), p1y, p2y)
}

const rippleEase = makeCubicBezier(0.65, 0, 0.34, 1)

export default function FishSimulation() {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null)
  const mouseRef = React.useRef<Vector2>({ x: 0, y: 0 })
  const mouseActiveRef = React.useRef<boolean>(false)
  const clickDisturbanceRef = React.useRef<MouseDisturbance | null>(null)
  const clickTargetRef = React.useRef<Vector2 | null>(null)
  const reducedMotionRef = React.useRef<boolean>(false)

  React.useEffect(() => {
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
    let width = (canvas.width = canvas.parentElement?.clientWidth ?? window.innerWidth)
    let height = (canvas.height = canvas.parentElement?.clientHeight ?? 650)

    const fishImg = new Image()
    fishImg.src = fishIconSrc
    const sharkImg = new Image()
    sharkImg.src = sharkSrc

    const isMobile = width < 768
    const fishCount = isMobile ? 80 : 250

    const vecDist = (a: Vector2, b: Vector2) => {
      const dx = a.x - b.x
      const dy = a.y - b.y
      return Math.sqrt(dx * dx + dy * dy)
    }

    const vecLimit = (v: Vector2, limit: number): void => {
      const mag = Math.sqrt(v.x * v.x + v.y * v.y)
      if (mag > limit && mag > 0) {
        v.x = (v.x / mag) * limit
        v.y = (v.y / mag) * limit
      }
    }

    const steerToward = (
      dirX: number,
      dirY: number,
      currentVel: Vector2,
      maxSpeed: number,
      maxForce: number
    ): Vector2 => {
      const mag = Math.sqrt(dirX * dirX + dirY * dirY)
      if (mag === 0) return { x: 0, y: 0 }
      const desired: Vector2 = {
        x: (dirX / mag) * maxSpeed - currentVel.x,
        y: (dirY / mag) * maxSpeed - currentVel.y,
      }
      vecLimit(desired, maxForce)
      return desired
    }

    const computeEdgeSteer = (pos: Vector2, margin: number) => {
      let ix = 0
      let iy = 0
      let maxT = 0
      if (pos.x < margin) {
        const t = (margin - pos.x) / margin
        ix += t
        if (t > maxT) maxT = t
      } else if (pos.x > width - margin) {
        const t = (pos.x - (width - margin)) / margin
        ix -= t
        if (t > maxT) maxT = t
      }
      if (pos.y < margin) {
        const t = (margin - pos.y) / margin
        iy += t
        if (t > maxT) maxT = t
      } else if (pos.y > height - margin) {
        const t = (pos.y - (height - margin)) / margin
        iy -= t
        if (t > maxT) maxT = t
      }
      return { ix, iy, t: Math.min(1, maxT) }
    }

    const applyEdgeTurn = (pos: Vector2, vel: Vector2, margin: number): void => {
      const edge = computeEdgeSteer(pos, margin)
      if (edge.t <= 0) return
      const speed = Math.sqrt(vel.x * vel.x + vel.y * vel.y)
      if (speed < 0.0001) return
      const inMag = Math.sqrt(edge.ix * edge.ix + edge.iy * edge.iy) || 1
      const inX = edge.ix / inMag
      const inY = edge.iy / inMag
      const curX = vel.x / speed
      const curY = vel.y / speed
      const blend = edge.t * edge.t * (3 - 2 * edge.t)
      const newX = curX * (1 - blend) + inX * blend
      const newY = curY * (1 - blend) + inY * blend
      const newMag = Math.sqrt(newX * newX + newY * newY) || 1
      vel.x = (newX / newMag) * speed
      vel.y = (newY / newMag) * speed
    }

    // ── NEW: Corner repulsion helper ────────────────────────────────────────
    // Cheap: 4 sqrt distance checks per fish per frame, no draw cost involved.
    const computeCornerRepulsion = (pos: Vector2, radius: number) => {
      const corners = [
        { x: 0, y: 0 },
        { x: width, y: 0 },
        { x: 0, y: height },
        { x: width, y: height },
      ]
      let fx = 0, fy = 0
      for (const c of corners) {
        const dx = pos.x - c.x
        const dy = pos.y - c.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < radius && dist > 0) {
          const t = 1 - dist / radius
          const eased = t * t * (3 - 2 * t) // smoothstep
          fx += (dx / dist) * eased
          fy += (dy / dist) * eased
        }
      }
      return { x: fx, y: fy }
    }

    const fishList: Fish[] = Array.from({ length: fishCount }, (_, i) => {
      const speedFactor = 0.7 + Math.random() * 0.6
      const fearFactor = 0.6 + Math.random() * 0.8
      return {
        id: i,
        position: { x: Math.random() * width, y: Math.random() * height },
        velocity: { x: (Math.random() - 0.5) * 1.0, y: (Math.random() - 0.5) * 1.0 },
        acceleration: { x: 0, y: 0 },
        maxSpeed: SIM_CONFIG.fishMaxSpeed * speedFactor,
        maxForce: SIM_CONFIG.fishMaxForce * (0.85 + speedFactor * 0.15),
        perceptionRadius: SIM_CONFIG.gridSize,
        separationRadius: 24,
        fear: 0,
        panicTimer: 0,
        alive: true,
        respawnAt: 0,
        fearFactor,
        speedFactor,
      }
    })

    const shark: Shark = {
      position: { x: width / 2, y: height / 2 },
      velocity: { x: 0.6, y: 0 },
      heading: 0,
      state: "cruise",
      stateChangedAt: Date.now(),
      targetFishId: null,
      speed: { cruise: 0.8, stalk: 1.2, lunge: 3.5 },
      eatRadius: 28,
      detectionRadius: 180,
      lungeTimer: 0,
      cooldownTimer: 0,
      momentum: 0.1,
      fishesEatenCount: 0,
      dashTimer: 0,
      dashCooldownTimer: 0,
      trailPositions: [],
    }

    let particlesList: Particle[] = []
    let ripplesList: Ripple[] = []

    const handleResize = () => {
      width = canvas.width = canvas.parentElement?.clientWidth ?? window.innerWidth
      height = canvas.height = canvas.parentElement?.clientHeight ?? 650
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
      mouseActiveRef.current = true
    }
    const handleMouseLeave = () => { mouseActiveRef.current = false }

    const handleCanvasClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const clickX = e.clientX - rect.left
      const clickY = e.clientY - rect.top

      const safeX = Math.max(50, Math.min(width - 50, clickX))
      const safeY = Math.max(50, Math.min(height - 50, clickY))

      const spawnAt = Date.now()
      for (let k = 0; k < 2; k++) {
        ripplesList.push({
          x: clickX,
          y: clickY,
          spawnAt,
          delay: k * 500,
          duration: 3000,
        })
      }

      clickDisturbanceRef.current = {
        position: { x: safeX, y: safeY },
        radius: 12,
        active: true,
        strength: 1.0,
        life: 1.0,
      }

      clickTargetRef.current = { x: safeX, y: safeY }
    }

    window.addEventListener("resize", handleResize)
    window.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseleave", handleMouseLeave)
    canvas.addEventListener("click", handleCanvasClick)

    type SpatialGrid = Map<string, Fish[]>

    const buildGrid = (): SpatialGrid => {
      const grid: SpatialGrid = new Map()
      for (const fish of fishList) {
        if (!fish.alive) continue
        const key = gridKey(fish.position.x, fish.position.y)
        if (!grid.has(key)) grid.set(key, [])
        grid.get(key)!.push(fish)
      }
      return grid
    }

    const gridKey = (x: number, y: number) =>
      `${Math.floor(x / SIM_CONFIG.gridSize)},${Math.floor(y / SIM_CONFIG.gridSize)}`

    const queryNeighbors = (grid: SpatialGrid, pos: Vector2): Fish[] => {
      const cx = Math.floor(pos.x / SIM_CONFIG.gridSize)
      const cy = Math.floor(pos.y / SIM_CONFIG.gridSize)
      const result: Fish[] = []
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const cell = grid.get(`${cx + dx},${cy + dy}`)
          if (cell) result.push(...cell)
        }
      }
      return result
    }

    const loop = () => {
      const now = Date.now()
      ctx.clearRect(0, 0, width, height)

      ripplesList = ripplesList.filter((ripple) => {
        const elapsed = now - ripple.spawnAt - ripple.delay
        if (elapsed < 0) return true

        const progress = elapsed / ripple.duration
        if (progress >= 1) return false

        const eased = rippleEase(progress)
        const baseRadius = 75
        const radius = baseRadius * (0.75 + eased * 0.75)
        const alpha = (1 - eased) * 0.22

        ctx.save()
        ctx.beginPath()
        ctx.arc(ripple.x, ripple.y, radius, 0, Math.PI * 2)

        ctx.shadowBlur = 8
        ctx.shadowColor = "rgba(233, 221, 185, 0.3)"

        ctx.strokeStyle = `rgba(233, 221, 185, ${alpha})`
        ctx.lineWidth = 6
        ctx.stroke()
        ctx.restore()
        return true
      })

      if (clickDisturbanceRef.current) {
        const dist = clickDisturbanceRef.current
        dist.radius += 4
        dist.life -= 0.025
        dist.strength = dist.life
        if (dist.life <= 0) clickDisturbanceRef.current = null
      }

      const grid = buildGrid()

      const titleEl = document.getElementById("hero-title-lockup")
      let reefCenter = { x: width / 2, y: height * 0.4 }
      let reefRadiusX = 185
      let reefRadiusY = 90
      if (titleEl && canvas) {
        const rect = titleEl.getBoundingClientRect()
        const canvasRect = canvas.getBoundingClientRect()
        reefCenter = {
          x: rect.left - canvasRect.left + rect.width / 2,
          y: rect.top - canvasRect.top + rect.height / 2
        }
        reefRadiusX = rect.width / 2 + 30
        reefRadiusY = rect.height / 2 + 30
      }

      for (const fish of fishList) {

        const dToShark = vecDist(fish.position, shark.position)
        if (fish.alive && dToShark < shark.eatRadius) {
          fish.alive = false
          fish.respawnAt = now + 30000 + Math.random() * 30000

          shark.fishesEatenCount++
          shark.momentum = Math.min(1.0, shark.momentum + 0.15)

          for (let k = 0; k < 10; k++) {
            const angle = Math.random() * Math.PI * 2
            const speed = 0.6 + Math.random() * 1.8
            particlesList.push({
              x: fish.position.x,
              y: fish.position.y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              alpha: 1.0,
              life: 1.0,
              color: k % 2 === 0 ? "rgba(191, 59, 42," : "rgba(233, 221, 185,"
            })
          }
        }

        if (!fish.alive) {
          if (now >= fish.respawnAt) {
            const rx = reefCenter.x + (Math.random() - 0.5) * reefRadiusX * 1.5
            const ry = reefCenter.y + (Math.random() - 0.5) * reefRadiusY * 1.5
            
            fish.position = { x: rx, y: ry }
            fish.velocity = { x: (Math.random() - 0.5) * 1.0, y: (Math.random() - 0.5) * 1.0 }
            fish.acceleration = { x: 0, y: 0 }
            fish.fear = 0.5
            fish.panicTimer = 0
            fish.alive = true
          }
          continue
        }

        if (reducedMotionRef.current) {
          fish.velocity.x += (Math.random() - 0.5) * 0.02
          fish.velocity.y += (Math.random() - 0.5) * 0.02
          vecLimit(fish.velocity, 0.2 * fish.speedFactor)
          applyEdgeTurn(fish.position, fish.velocity, SIM_CONFIG.fishEdgeMargin)
          fish.position.x += fish.velocity.x
          fish.position.y += fish.velocity.y
          continue
        }

        const neighbors = queryNeighbors(grid, fish.position)

        let rawSepX = 0, rawSepY = 0, sepCount = 0
        let sumVelX = 0, sumVelY = 0
        let sumPosX = 0, sumPosY = 0, peerCount = 0
        let maxNeighborFear = 0

        for (const other of neighbors) {
          if (other.id === fish.id) continue
          const d = vecDist(fish.position, other.position)

          if (d < fish.separationRadius && d > 0) {
            rawSepX += (fish.position.x - other.position.x) / d
            rawSepY += (fish.position.y - other.position.y) / d
            sepCount++
          }

          if (d < fish.perceptionRadius) {
            sumVelX += other.velocity.x
            sumVelY += other.velocity.y
            sumPosX += other.position.x
            sumPosY += other.position.y
            if (other.fear > maxNeighborFear) maxNeighborFear = other.fear
            peerCount++
          }
        }

        const distToShark = vecDist(fish.position, shark.position)
        const activeDetectionRadius = shark.state === "dash" ? shark.detectionRadius * 2.0 : shark.detectionRadius
        if (distToShark < activeDetectionRadius) {
          fish.fear = Math.min(1, fish.fearFactor)
          fish.panicTimer = Math.round(150 * fish.fearFactor)
        } else {
          if (fish.panicTimer > 0) {
            fish.panicTimer--
            fish.fear = Math.max(0.4 * fish.fearFactor, fish.fear * 0.99)
          } else {
            if (maxNeighborFear > SIM_CONFIG.fearThreshold) {
              fish.fear += (maxNeighborFear - fish.fear) * SIM_CONFIG.fearRiseBlend * fish.fearFactor
            }
            fish.fear *= SIM_CONFIG.fearDecay
          }
        }
        fish.fear = Math.max(0, Math.min(1, fish.fear))

        if (clickDisturbanceRef.current) {
          const d = vecDist(fish.position, clickDisturbanceRef.current.position)
          if (d < 120) {
            fish.fear = Math.max(fish.fear, clickDisturbanceRef.current.strength * fish.fearFactor)
          }
        }

        let sepForce = { x: 0, y: 0 }
        if (sepCount > 0) {
          sepForce = steerToward(rawSepX / sepCount, rawSepY / sepCount, fish.velocity, fish.maxSpeed, fish.maxForce)
        }

        let aliForce = { x: 0, y: 0 }
        if (peerCount > 0) {
          aliForce = steerToward(sumVelX / peerCount, sumVelY / peerCount, fish.velocity, fish.maxSpeed, fish.maxForce)
        }

        let cohForce = { x: 0, y: 0 }
        if (peerCount > 0) {
          cohForce = steerToward((sumPosX / peerCount) - fish.position.x, (sumPosY / peerCount) - fish.position.y, fish.velocity, fish.maxSpeed, fish.maxForce)
        }

        let fleeForce = { x: 0, y: 0 }
        if (fish.fear > SIM_CONFIG.fearThreshold) {
          const escapeX = fish.position.x - shark.position.x
          const escapeY = fish.position.y - shark.position.y
          fleeForce = steerToward(escapeX, escapeY, fish.velocity, SIM_CONFIG.fishPanickedSpeed * fish.speedFactor, fish.maxForce * 1.5)
        }

        if (clickDisturbanceRef.current) {
          const d = vecDist(fish.position, clickDisturbanceRef.current.position)
          if (d < 120) {
            const clickFlee = steerToward(
              fish.position.x - clickDisturbanceRef.current.position.x,
              fish.position.y - clickDisturbanceRef.current.position.y,
              fish.velocity,
              SIM_CONFIG.fishPanickedSpeed * fish.speedFactor,
              fish.maxForce * 1.5
            )
            fleeForce.x += clickFlee.x
            fleeForce.y += clickFlee.y
          }
        }
        vecLimit(fleeForce, fish.maxForce * 1.5)

        const reefAttractX = reefCenter.x - fish.position.x
        const reefAttractY = reefCenter.y - fish.position.y
        const reefForce = steerToward(reefAttractX, reefAttractY, fish.velocity, fish.maxSpeed * 0.35, fish.maxForce * 0.12)

        // ── NEW: Corner repulsion force — doesn't affect shark, doesn't touch reef/flee/schooling ──
        const rawCorner = computeCornerRepulsion(fish.position, SIM_CONFIG.cornerRepulsionRadius)
        const cornerForce = steerToward(rawCorner.x, rawCorner.y, fish.velocity, fish.maxSpeed, fish.maxForce)

        const wanderX = (Math.random() - 0.5) * SIM_CONFIG.wanderWeight
        const wanderY = (Math.random() - 0.5) * SIM_CONFIG.wanderWeight

        fish.acceleration.x =
          sepForce.x * SIM_CONFIG.separationWeight +
          aliForce.x * SIM_CONFIG.alignmentWeight +
          cohForce.x * SIM_CONFIG.cohesionWeight +
          fleeForce.x * SIM_CONFIG.fleeWeight +
          reefForce.x * 0.35 +
          cornerForce.x * SIM_CONFIG.cornerRepulsionWeight +
          wanderX

        fish.acceleration.y =
          sepForce.y * SIM_CONFIG.separationWeight +
          aliForce.y * SIM_CONFIG.alignmentWeight +
          cohForce.y * SIM_CONFIG.cohesionWeight +
          fleeForce.y * SIM_CONFIG.fleeWeight +
          reefForce.y * 0.35 +
          cornerForce.y * SIM_CONFIG.cornerRepulsionWeight +
          wanderY

        vecLimit(fish.acceleration, fish.maxForce * 2.5)

        fish.velocity.x += fish.acceleration.x
        fish.velocity.y += fish.acceleration.y

        const dynamicMaxSpeed = fish.maxSpeed + (SIM_CONFIG.fishPanickedSpeed * fish.speedFactor - fish.maxSpeed) * fish.fear
        vecLimit(fish.velocity, dynamicMaxSpeed)

        applyEdgeTurn(fish.position, fish.velocity, SIM_CONFIG.fishEdgeMargin)

        fish.position.x += fish.velocity.x
        fish.position.y += fish.velocity.y
        fish.acceleration = { x: 0, y: 0 }

        if (fish.position.x < -5) fish.position.x = -5
        if (fish.position.x > width + 5) fish.position.x = width + 5
        if (fish.position.y < -5) fish.position.y = -5
        if (fish.position.y > height + 5) fish.position.y = height + 5
      }

      if (reducedMotionRef.current) {
        shark.heading += (Math.random() - 0.5) * 0.02
        shark.velocity = { x: Math.cos(shark.heading) * 0.3, y: Math.sin(shark.heading) * 0.3 }
        applyEdgeTurn(shark.position, shark.velocity, SIM_CONFIG.sharkEdgeMargin)
        shark.heading = Math.atan2(shark.velocity.y, shark.velocity.x)
        shark.position.x += shark.velocity.x
        shark.position.y += shark.velocity.y
      } else {
        
        if (shark.dashCooldownTimer > 0) {
          shark.dashCooldownTimer--
        }

        if (shark.state === "dash") {
          shark.momentum = Math.min(1.0, shark.momentum + 0.005)
        } else if (shark.state !== "cooldown") {
          shark.momentum = Math.min(1.0, shark.momentum + 0.0006)
        } else {
          shark.momentum = Math.max(0.1, shark.momentum - 0.004)
        }

        const baseCruiseSpeed = getCruiseSpeed(shark.fishesEatenCount)
        const baseStalkSpeed = baseCruiseSpeed * 1.5
        const baseLungeSpeed = baseCruiseSpeed * 4.0

        if (shark.state !== "dash" && shark.state !== "cooldown" && shark.momentum > 0.7 && shark.dashCooldownTimer <= 0) {
          if (shark.state === "lunge" || shark.state === "stalk" || clickTargetRef.current) {
            shark.state = "dash"
            shark.stateChangedAt = now
            shark.dashTimer = 45 + Math.floor(Math.random() * 20)
          }
        }

        if (clickTargetRef.current) {
          const dx = clickTargetRef.current.x - shark.position.x
          const dy = clickTargetRef.current.y - shark.position.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist > 18) {
            const currentSpeed = shark.state === "dash" ? baseLungeSpeed * 2.5 : baseLungeSpeed
            shark.velocity = {
              x: (dx / dist) * currentSpeed,
              y: (dy / dist) * currentSpeed,
            }
            shark.heading = Math.atan2(dy, dx)
          } else {
            clickTargetRef.current = null
          }
        } 
        
        else if (shark.state === "dash") {
          const targetFish = shark.targetFishId !== null ? fishList[shark.targetFishId] : null
          if (targetFish && targetFish.alive) {
            const dx = targetFish.position.x - shark.position.x
            const dy = targetFish.position.y - shark.position.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist > 0) {
              const dashSpeed = baseLungeSpeed * 2.5
              shark.velocity = { x: (dx / dist) * dashSpeed, y: (dy / dist) * dashSpeed }
              shark.heading = Math.atan2(dy, dx)
            }
          }

          shark.dashTimer--
          if (shark.dashTimer <= 0) {
            shark.state = "cooldown"
            shark.stateChangedAt = now
            shark.cooldownTimer = 180
            shark.dashCooldownTimer = 300
            shark.momentum = 0.2
          }
        }
        
        else {
          let denseCentroidX = 0, denseCentroidY = 0, densityCount = 0
          for (const fish of fishList) {
            if (!fish.alive) continue
            if (vecDist(shark.position, fish.position) < shark.detectionRadius) {
              denseCentroidX += fish.position.x
              denseCentroidY += fish.position.y
              densityCount++
            }
          }
          if (densityCount > 0) {
            denseCentroidX /= densityCount
            denseCentroidY /= densityCount
          }

          if (shark.state === "cruise") {
            shark.heading += (Math.random() - 0.5) * 0.1
            shark.velocity.x = Math.cos(shark.heading) * baseCruiseSpeed
            shark.velocity.y = Math.sin(shark.heading) * baseCruiseSpeed

            if (densityCount >= 5 && now - shark.stateChangedAt > 3000) {
              shark.state = "stalk"
              shark.stateChangedAt = now
            }
          } 
          
          else if (shark.state === "stalk") {
            if (densityCount === 0) {
              shark.state = "cruise"
              shark.stateChangedAt = now
            } else {
              const dx = denseCentroidX - shark.position.x
              const dy = denseCentroidY - shark.position.y
              const dist = Math.sqrt(dx * dx + dy * dy)
              
              if (dist > 10) {
                shark.velocity = { x: (dx / dist) * baseStalkSpeed, y: (dy / dist) * baseStalkSpeed }
                shark.heading = Math.atan2(dy, dx)
              }

              if (dist < 90) {
                let minDist = Infinity, chosenId: number | null = null
                for (const fish of fishList) {
                  if (!fish.alive) continue
                  const d = vecDist(shark.position, fish.position)
                  if (d < shark.detectionRadius && d < minDist) {
                    minDist = d
                    chosenId = fish.id
                  }
                }
                if (chosenId !== null) {
                  shark.state = "lunge"
                  shark.targetFishId = chosenId
                  shark.stateChangedAt = now
                  shark.lungeTimer = 75
                }
              }
            }
          } 
          
          else if (shark.state === "lunge") {
            const targetFish = shark.targetFishId !== null ? fishList[shark.targetFishId] : null
            if (targetFish && targetFish.alive) {
              const dx = targetFish.position.x - shark.position.x
              const dy = targetFish.position.y - shark.position.y
              const dist = Math.sqrt(dx * dx + dy * dy)
              if (dist > 0) {
                shark.velocity = { x: (dx / dist) * baseLungeSpeed, y: (dy / dist) * baseLungeSpeed }
                shark.heading = Math.atan2(dy, dx)
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
              x: Math.cos(shark.heading) * baseCruiseSpeed,
              y: Math.sin(shark.heading) * baseCruiseSpeed,
            }

            shark.cooldownTimer--
            if (shark.cooldownTimer <= 0) {
              shark.state = "cruise"
              shark.stateChangedAt = now
            }
          }
        }

        applyEdgeTurn(shark.position, shark.velocity, SIM_CONFIG.sharkEdgeMargin)
        if (shark.velocity.x !== 0 || shark.velocity.y !== 0) {
          shark.heading = Math.atan2(shark.velocity.y, shark.velocity.x)
        }

        const currentCap = shark.state === "dash" ? baseLungeSpeed * 2.5 :
                           shark.state === "lunge" ? baseLungeSpeed :
                           shark.state === "stalk" ? baseStalkSpeed : baseCruiseSpeed

        vecLimit(shark.velocity, currentCap * 1.1)

        shark.position.x += shark.velocity.x
        shark.position.y += shark.velocity.y

        shark.position.x = Math.max(-40, Math.min(width + 40, shark.position.x))
        shark.position.y = Math.max(-40, Math.min(height + 40, shark.position.y))

        if (shark.state === "dash") {
          shark.trailPositions.push({ x: shark.position.x, y: shark.position.y })
          if (shark.trailPositions.length > 8) {
            shark.trailPositions.shift()
          }
        } else {
          if (shark.trailPositions.length > 0) {
            shark.trailPositions.shift()
          }
        }
      }

      particlesList = particlesList.filter((p) => {
        p.x += p.vx
        p.y += p.vy
        p.alpha -= 0.042
        p.life -= 0.042
        if (p.alpha <= 0) return false

        ctx.beginPath()
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2)
        ctx.fillStyle = `${p.color} ${p.alpha})`
        ctx.fill()
        return true
      })

      for (const fish of fishList) {
        if (!fish.alive) continue
        const angle = Math.atan2(fish.velocity.y, fish.velocity.x)

        ctx.save()
        ctx.translate(fish.position.x, fish.position.y)
        ctx.rotate(angle)

        ctx.shadowBlur = 8 + fish.fear * 6
        ctx.shadowColor = "rgba(233, 221, 185, 0.6)"

        if (fishImg.complete && fishImg.naturalWidth !== 0) {
          ctx.globalAlpha = Math.min(1.0, 0.65 + fish.fear * 0.35)
          ctx.drawImage(fishImg, -14, -14, 28, 28)
        } else {
          ctx.beginPath()
          ctx.moveTo(8, 0)
          ctx.lineTo(-6, -5)
          ctx.lineTo(-3, 0)
          ctx.lineTo(-6, 5)
          ctx.closePath()
          const a = 0.35 + fish.fear * 0.35
          ctx.fillStyle   = `rgba(233, 221, 185, ${a})`
          ctx.strokeStyle = `rgba(233, 221, 185, ${a + 0.25})`
          ctx.lineWidth = 1.8
          ctx.fill()
          ctx.stroke()
        }

        ctx.restore()
      }

      if (shark.state === "dash" && sharkImg.complete && sharkImg.naturalWidth !== 0) {
        for (let k = 0; k < shark.trailPositions.length; k++) {
          const pos = shark.trailPositions[k]
          const alpha = (k / shark.trailPositions.length) * 0.22
          ctx.save()
          ctx.translate(pos.x, pos.y)
          ctx.rotate(shark.heading)
          ctx.globalAlpha = alpha
          
          ctx.shadowBlur = 38
          ctx.shadowColor = "rgba(191, 59, 42, 1.0)"
          
          ctx.drawImage(sharkImg, -44, -44, 88, 88)
          ctx.restore()
        }
      }

      ctx.save()
      ctx.translate(shark.position.x, shark.position.y)
      ctx.rotate(shark.heading)

      ctx.shadowBlur = shark.state === "dash" ? 38 :
                       shark.state === "lunge" ? 24 :
                       shark.state === "stalk" ? 18 : 10
      ctx.shadowColor = "rgba(191, 59, 42, 1.0)"

      if (sharkImg.complete && sharkImg.naturalWidth !== 0) {
        ctx.globalAlpha =
          shark.state === "dash" ? 1.0 :
          shark.state === "lunge" ? 0.95 :
          shark.state === "stalk" ? 0.85 : 0.75
        ctx.drawImage(sharkImg, -44, -44, 88, 88)
      } else {
        ctx.beginPath()
        ctx.moveTo(25, 0)
        ctx.lineTo(-16, -10)
        ctx.lineTo(-10, 0)
        ctx.lineTo(-16, 10)
        ctx.closePath()
        if (shark.state === "dash" || shark.state === "lunge") {
          ctx.fillStyle   = "rgba(191, 59, 42, 0.95)"
          ctx.strokeStyle = "rgba(191, 59, 42, 1.0)"
        } else if (shark.state === "stalk") {
          ctx.fillStyle   = "rgba(191, 59, 42, 0.7)"
          ctx.strokeStyle = "rgba(191, 59, 42, 0.95)"
        } else {
          ctx.fillStyle   = "rgba(191, 59, 42, 0.5)"
          ctx.strokeStyle = "rgba(191, 59, 42, 0.85)"
        }
        ctx.lineWidth = 2.8
        ctx.fill()
        ctx.stroke()
      }

      ctx.restore()

      animationFrameId = requestAnimationFrame(loop)
    }

    animationFrameId = requestAnimationFrame(loop)

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