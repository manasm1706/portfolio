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

// ─── Tunable Configuration ───────────────────────────────────────────────────
// All weights and thresholds are in one place so they're easy to dial by eye.
const SIM_CONFIG = {
  // Flocking force weights
  separationWeight: 1.8,
  alignmentWeight: 1.0,
  cohesionWeight: 1.0,
  fleeWeight: 2.5,
  wanderWeight: 0.25,

  // Fish base limits
  fishMaxSpeed: 0.8,
  fishPanickedSpeed: 2.0,
  fishMaxForce: 0.04,

  // Fear tuning
  fearRiseBlend: 0.15,   // how fast fear propagates from neighbors
  fearDecay: 0.985,      // per-frame multiplier when no high-fear neighbor (spec value)
  fearThreshold: 0.05,   // below this fear is considered "calm" and not propagated

  // Spatial grid bucket size (≈ perceptionRadius)
  gridSize: 60,
}

export default function FishSimulation() {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null)

  // All interaction state lives in refs — zero React re-renders from simulation.
  const mouseRef = React.useRef<Vector2>({ x: 0, y: 0 })
  const mouseActiveRef = React.useRef<boolean>(false)
  const clickDisturbanceRef = React.useRef<MouseDisturbance | null>(null)
  const clickTargetRef = React.useRef<Vector2 | null>(null)
  const reducedMotionRef = React.useRef<boolean>(false)

  React.useEffect(() => {
    // Respect prefers-reduced-motion
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

    // Load sprites
    const fishImg = new Image()
    fishImg.src = fishIconSrc
    const sharkImg = new Image()
    sharkImg.src = sharkSrc

    // Fish count: desktop 250, mobile 80
    const isMobile = width < 768
    const fishCount = isMobile ? 80 : 250

    // ── Helper math ─────────────────────────────────────────────────────────

    const vecDist = (a: Vector2, b: Vector2) => {
      const dx = a.x - b.x
      const dy = a.y - b.y
      return Math.sqrt(dx * dx + dy * dy)
    }

    /** Mutates v in place to enforce a magnitude ceiling. */
    const vecLimit = (v: Vector2, limit: number): void => {
      const mag = Math.sqrt(v.x * v.x + v.y * v.y)
      if (mag > limit && mag > 0) {
        v.x = (v.x / mag) * limit
        v.y = (v.y / mag) * limit
      }
    }

    /**
     * Compute a Reynolds steering force toward a desired velocity direction.
     * Returns a new Vector2 already limited to maxForce.
     */
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

    // ── Initialize fish ─────────────────────────────────────────────────────

    const fishList: Fish[] = Array.from({ length: fishCount }, (_, i) => ({
      id: i,
      position: { x: Math.random() * width, y: Math.random() * height },
      velocity: { x: (Math.random() - 0.5) * 1.0, y: (Math.random() - 0.5) * 1.0 },
      acceleration: { x: 0, y: 0 },
      maxSpeed: SIM_CONFIG.fishMaxSpeed,
      maxForce: SIM_CONFIG.fishMaxForce,
      perceptionRadius: SIM_CONFIG.gridSize,
      separationRadius: 24,
      fear: 0,
      alive: true,
      respawnAt: 0,
    }))

    // ── Initialize shark ────────────────────────────────────────────────────

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

    let particlesList: Particle[] = []

    // ── Event handlers ──────────────────────────────────────────────────────

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
      const padding = 30
      const clickX = Math.max(padding, Math.min(width - padding, e.clientX - rect.left))
      const clickY = Math.max(padding, Math.min(height - padding, e.clientY - rect.top))

      // Expanding-ring disturbance
      clickDisturbanceRef.current = {
        position: { x: clickX, y: clickY },
        radius: 12,
        active: true,
        strength: 1.0,
        life: 1.0,
      }
      // Lure shark toward click
      clickTargetRef.current = { x: clickX, y: clickY }
    }

    window.addEventListener("resize", handleResize)
    window.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseleave", handleMouseLeave)
    canvas.addEventListener("click", handleCanvasClick)

    // ── Spatial hash helpers ────────────────────────────────────────────────

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

    // ── Shark helpers ────────────────────────────────────────────────────────

    /** Soft boundary steering — curves the shark away from edges instead of hard-stopping. */
    const sharkBoundaryForce = (): Vector2 => {
      const margin = 60
      const strength = 0.08
      let fx = 0, fy = 0
      if (shark.position.x < margin)        fx += strength * (margin - shark.position.x)
      if (shark.position.x > width - margin) fx -= strength * (shark.position.x - (width - margin))
      if (shark.position.y < margin)        fy += strength * (margin - shark.position.y)
      if (shark.position.y > height - margin) fy -= strength * (shark.position.y - (height - margin))
      return { x: fx, y: fy }
    }

    // ── Main RAF loop ────────────────────────────────────────────────────────

    const loop = () => {
      const now = Date.now()
      ctx.clearRect(0, 0, width, height)

      // ── 1. Click disturbance ring ──────────────────────────────────────
      if (clickDisturbanceRef.current) {
        const dist = clickDisturbanceRef.current
        dist.radius += 4
        dist.life -= 0.025
        dist.strength = dist.life

        if (dist.life <= 0) {
          clickDisturbanceRef.current = null
        } else {
          ctx.beginPath()
          ctx.arc(dist.position.x, dist.position.y, dist.radius, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(233, 221, 185, ${dist.life * 0.2})`
          ctx.lineWidth = 2.0
          ctx.stroke()
        }
      }

      // ── 2. Build spatial grid once per frame ───────────────────────────
      const grid = buildGrid()

      // ── 3. Fish update ─────────────────────────────────────────────────
      for (const fish of fishList) {

        // Handle dead fish: respawn check
        if (!fish.alive) {
          if (now >= fish.respawnAt) {
            const edge = Math.floor(Math.random() * 4)
            let rx = 0, ry = 0
            if (edge === 0)      { rx = -20;        ry = Math.random() * height }
            else if (edge === 1) { rx = width + 20; ry = Math.random() * height }
            else if (edge === 2) { rx = Math.random() * width; ry = -20 }
            else                 { rx = Math.random() * width; ry = height + 20 }

            const cx = width / 2 - rx
            const cy = height / 2 - ry
            const cmag = Math.sqrt(cx * cx + cy * cy)
            fish.position = { x: rx, y: ry }
            fish.velocity = { x: (cx / cmag) * 0.6, y: (cy / cmag) * 0.6 }
            fish.acceleration = { x: 0, y: 0 }
            fish.fear = 0.6   // spec: "re-enters a little rattled"
            fish.alive = true
          }
          continue
        }

        // Reduced-motion: calm drift only
        if (reducedMotionRef.current) {
          fish.velocity.x += (Math.random() - 0.5) * 0.02
          fish.velocity.y += (Math.random() - 0.5) * 0.02
          vecLimit(fish.velocity, 0.2)
          fish.position.x += fish.velocity.x
          fish.position.y += fish.velocity.y
          if (fish.position.x < -15) fish.position.x = width + 15
          if (fish.position.x > width + 15) fish.position.x = -15
          if (fish.position.y < -15) fish.position.y = height + 15
          if (fish.position.y > height + 15) fish.position.y = -15
          continue
        }

        // ── Collect neighbor stats from spatial grid ──
        const neighbors = queryNeighbors(grid, fish.position)

        // FIX: accumulate raw sums first, normalize after — don't normalize before dividing by count.
        let rawSepX = 0, rawSepY = 0, sepCount = 0
        let sumVelX = 0, sumVelY = 0
        let sumPosX = 0, sumPosY = 0, peerCount = 0
        let maxNeighborFear = 0

        for (const other of neighbors) {
          if (other.id === fish.id) continue
          const d = vecDist(fish.position, other.position)

          if (d < fish.separationRadius && d > 0) {
            // Accumulate raw inverse-distance difference vectors
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

        // ── Fear update ──
        // FIX: fear ALWAYS decays every frame; propagation and direct detection can raise it.
        const distToShark = vecDist(fish.position, shark.position)
        if (distToShark < shark.detectionRadius) {
          fish.fear = 1.0
        } else {
          // Propagate from scared neighbors
          if (maxNeighborFear > SIM_CONFIG.fearThreshold) {
            fish.fear += (maxNeighborFear - fish.fear) * SIM_CONFIG.fearRiseBlend
          }
          // Always decay — spec: "fear *= 0.985 per frame"
          fish.fear *= SIM_CONFIG.fearDecay
        }
        fish.fear = Math.max(0, Math.min(1, fish.fear))

        // ── Separation steering ──
        // FIX: average the raw sum BEFORE computing the steering force.
        let sepForce: Vector2 = { x: 0, y: 0 }
        if (sepCount > 0) {
          sepForce = steerToward(
            rawSepX / sepCount,
            rawSepY / sepCount,
            fish.velocity,
            fish.maxSpeed,
            fish.maxForce
          )
        }

        // ── Alignment steering ──
        let aliForce: Vector2 = { x: 0, y: 0 }
        if (peerCount > 0) {
          aliForce = steerToward(
            sumVelX / peerCount,
            sumVelY / peerCount,
            fish.velocity,
            fish.maxSpeed,
            fish.maxForce
          )
        }

        // ── Cohesion steering ──
        let cohForce: Vector2 = { x: 0, y: 0 }
        if (peerCount > 0) {
          cohForce = steerToward(
            (sumPosX / peerCount) - fish.position.x,
            (sumPosY / peerCount) - fish.position.y,
            fish.velocity,
            fish.maxSpeed,
            fish.maxForce
          )
        }

        // ── Flee steering (shark + click disturbance) ──
        // FIX: flee from shark and flee from click are separate; both are properly limited.
        let fleeForce: Vector2 = { x: 0, y: 0 }

        if (fish.fear > SIM_CONFIG.fearThreshold) {
          const escapeX = fish.position.x - shark.position.x
          const escapeY = fish.position.y - shark.position.y
          const sharkFlee = steerToward(escapeX, escapeY, fish.velocity, SIM_CONFIG.fishPanickedSpeed, fish.maxForce * 1.5)
          fleeForce.x += sharkFlee.x
          fleeForce.y += sharkFlee.y
        }

        if (clickDisturbanceRef.current) {
          const d = vecDist(fish.position, clickDisturbanceRef.current.position)
          if (d < 120) {
            fish.fear = Math.max(fish.fear, clickDisturbanceRef.current.strength)
            const clickFlee = steerToward(
              fish.position.x - clickDisturbanceRef.current.position.x,
              fish.position.y - clickDisturbanceRef.current.position.y,
              fish.velocity,
              SIM_CONFIG.fishPanickedSpeed,
              fish.maxForce * 1.5
            )
            fleeForce.x += clickFlee.x
            fleeForce.y += clickFlee.y
          }
        }

        // FIX: limit the combined flee force to a ceiling before weighting
        vecLimit(fleeForce, fish.maxForce * 1.5)

        // ── Wander (random drift) ──
        // FIX: wander force is computed as a small steering force, NOT added after the acceleration
        //      limit — so it participates in the total cap correctly.
        const wanderX = (Math.random() - 0.5) * SIM_CONFIG.wanderWeight
        const wanderY = (Math.random() - 0.5) * SIM_CONFIG.wanderWeight

        // ── Combine all forces, then apply one cap ──
        // FIX: sum weighted components THEN apply the single acceleration cap — not cap then weight.
        fish.acceleration.x =
          sepForce.x * SIM_CONFIG.separationWeight +
          aliForce.x * SIM_CONFIG.alignmentWeight +
          cohForce.x * SIM_CONFIG.cohesionWeight +
          fleeForce.x * SIM_CONFIG.fleeWeight +
          wanderX

        fish.acceleration.y =
          sepForce.y * SIM_CONFIG.separationWeight +
          aliForce.y * SIM_CONFIG.alignmentWeight +
          cohForce.y * SIM_CONFIG.cohesionWeight +
          fleeForce.y * SIM_CONFIG.fleeWeight +
          wanderY

        // Cap total steering
        vecLimit(fish.acceleration, fish.maxForce * 3)

        fish.velocity.x += fish.acceleration.x
        fish.velocity.y += fish.acceleration.y

        // Dynamic top speed: calm → maxSpeed, panicked → panickedSpeed
        const dynamicMaxSpeed =
          SIM_CONFIG.fishMaxSpeed +
          (SIM_CONFIG.fishPanickedSpeed - SIM_CONFIG.fishMaxSpeed) * fish.fear
        vecLimit(fish.velocity, dynamicMaxSpeed)

        fish.position.x += fish.velocity.x
        fish.position.y += fish.velocity.y

        // Reset accumulator
        fish.acceleration = { x: 0, y: 0 }

        // Wrap boundaries
        if (fish.position.x < -20) fish.position.x = width + 20
        if (fish.position.x > width + 20) fish.position.x = -20
        if (fish.position.y < -20) fish.position.y = height + 20
        if (fish.position.y > height + 20) fish.position.y = -20
      }

      // ── 4. Shark AI ─────────────────────────────────────────────────────
      if (reducedMotionRef.current) {
        // Calm drift only — spec: "freeze shark in cruise at very low speed"
        shark.heading += (Math.random() - 0.5) * 0.02
        shark.velocity = { x: Math.cos(shark.heading) * 0.3, y: Math.sin(shark.heading) * 0.3 }
        shark.position.x += shark.velocity.x
        shark.position.y += shark.velocity.y
      } else {
        // Click target override (user-driven lure)
        if (clickTargetRef.current) {
          const dx = clickTargetRef.current.x - shark.position.x
          const dy = clickTargetRef.current.y - shark.position.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist > 15) {
            const s = shark.speed.lunge
            shark.velocity = { x: (dx / dist) * s, y: (dy / dist) * s }
            shark.heading = Math.atan2(dy, dx)
          } else {
            clickTargetRef.current = null
          }
        } else {
          // Find fish cluster inside detectionRadius
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

          // ── State machine ──
          if (shark.state === "cruise") {
            shark.heading += (Math.random() - 0.5) * 0.1

            // Cursor lure: small attraction blend (spec §5.3)
            if (mouseActiveRef.current) {
              const dx = mouseRef.current.x - shark.position.x
              const dy = mouseRef.current.y - shark.position.y
              const dist = Math.sqrt(dx * dx + dy * dy)
              if (dist > 40) {
                shark.velocity.x += (dx / dist) * 0.2
                shark.velocity.y += (dy / dist) * 0.2
              }
            }

            const s = shark.speed.cruise
            const mag = Math.sqrt(shark.velocity.x ** 2 + shark.velocity.y ** 2)
            if (mag > 0) {
              shark.velocity.x = (shark.velocity.x / mag) * s
              shark.velocity.y = (shark.velocity.y / mag) * s
              shark.heading = Math.atan2(shark.velocity.y, shark.velocity.x)
            } else {
              shark.velocity = { x: Math.cos(shark.heading) * s, y: Math.sin(shark.heading) * s }
            }

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
                shark.velocity = {
                  x: (dx / dist) * shark.speed.stalk,
                  y: (dy / dist) * shark.speed.stalk,
                }
                shark.heading = Math.atan2(dy, dx)
              }

              // Transition to lunge when close enough
              if (dist < 90) {
                // FIX: only scan fish already within detectionRadius (not the whole array)
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
                  shark.lungeTimer = 75 // frames (~1.25 s at 60fps)
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
                shark.velocity = {
                  x: (dx / dist) * shark.speed.lunge,
                  y: (dy / dist) * shark.speed.lunge,
                }
                shark.heading = Math.atan2(dy, dx)
              }

              // Eat check
              if (dist < shark.eatRadius) {
                targetFish.alive = false
                targetFish.respawnAt = now + 1800 + Math.random() * 800

                // Particle burst
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

                shark.state = "cooldown"
                shark.targetFishId = null
                shark.stateChangedAt = now
                shark.cooldownTimer = 200
              }
            } else {
              // Target died or disappeared — abort lunge
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

        // FIX: soft boundary steering instead of hard wall bounce
        const boundary = sharkBoundaryForce()
        shark.velocity.x += boundary.x
        shark.velocity.y += boundary.y

        // Cap shark at its current mode speed (boundary force shouldn't break lunge speed)
        const sharkMaxSpeed =
          shark.state === "lunge"    ? shark.speed.lunge  :
          shark.state === "stalk"    ? shark.speed.stalk  :
          shark.speed.cruise

        vecLimit(shark.velocity, sharkMaxSpeed * 1.1)
        shark.position.x += shark.velocity.x
        shark.position.y += shark.velocity.y
      }

      // ── 5. Particles ────────────────────────────────────────────────────
      particlesList = particlesList.filter((p) => {
        p.x += p.vx
        p.y += p.vy
        p.alpha -= 0.018
        p.life  -= 0.018
        if (p.alpha <= 0) return false
        ctx.beginPath()
        ctx.arc(p.x, p.y, 3.0, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(191, 59, 42, ${p.alpha * 0.85})`
        ctx.fill()
        return true
      })

      // ── 6. Draw fish ─────────────────────────────────────────────────────
      for (const fish of fishList) {
        if (!fish.alive) continue
        const angle = Math.atan2(fish.velocity.y, fish.velocity.x)

        ctx.save()
        ctx.translate(fish.position.x, fish.position.y)
        ctx.rotate(angle)

        // Yellow glow matching the cream shade of the portfolio design
        ctx.shadowBlur = 8 + fish.fear * 6
        ctx.shadowColor = "rgba(233, 221, 185, 0.6)"

        if (fishImg.complete && fishImg.naturalWidth !== 0) {
          ctx.globalAlpha = Math.min(1.0, 0.65 + fish.fear * 0.35)
          ctx.drawImage(fishImg, -14, -14, 28, 28)
        } else {
          // Fallback chevron
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

      // ── 7. Draw shark ────────────────────────────────────────────────────
      ctx.save()
      ctx.translate(shark.position.x, shark.position.y)
      ctx.rotate(shark.heading)

      // Reddish glow matching the accent red color of the portfolio design
      ctx.shadowBlur = shark.state === "lunge" ? 22 : shark.state === "stalk" ? 15 : 10
      ctx.shadowColor = "rgba(191, 59, 42, 0.85)"

      if (sharkImg.complete && sharkImg.naturalWidth !== 0) {
        ctx.globalAlpha =
          shark.state === "lunge" ? 0.95 :
          shark.state === "stalk" ? 0.85 : 0.75
        ctx.drawImage(sharkImg, -30, -30, 60, 60)
      } else {
        // Fallback dart
        ctx.beginPath()
        ctx.moveTo(25, 0)
        ctx.lineTo(-16, -10)
        ctx.lineTo(-10, 0)
        ctx.lineTo(-16, 10)
        ctx.closePath()
        if (shark.state === "lunge") {
          ctx.fillStyle   = "rgba(191, 59, 42, 0.85)"
          ctx.strokeStyle = "rgba(191, 59, 42, 1.0)"
        } else if (shark.state === "stalk") {
          ctx.fillStyle   = "rgba(191, 59, 42, 0.65)"
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