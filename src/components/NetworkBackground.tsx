import React, { useEffect, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useTheme } from '../context/ThemeContext';

interface NetworkBackgroundProps {
  isDetailView: boolean;
}

interface ParticleNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  offsetX: number;
  offsetY: number;
  renderX: number;
  renderY: number;
  baseRadius: number;
  radius: number;
  glow: number;
  pulse: number;
  tint: 'cyan' | 'blue';
}

interface DataPacket {
  fromIdx: number;
  toIdx: number;
  progress: number;
  speed: number;
  color: string;
}

interface SignalRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
}

const NODE_COLORS: Record<ParticleNode['tint'], string> = {
  cyan: '#37DFFF',
  blue: '#2685FF',
};

export const NetworkBackground: React.FC<NetworkBackgroundProps> = ({ isDetailView }) => {
  const { isNetworkMode } = useTheme();
  const shouldReduceMotion = Boolean(useReducedMotion());
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const detailViewRef = useRef(isDetailView);

  useEffect(() => {
    detailViewRef.current = isDetailView;
  }, [isDetailView]);

  useEffect(() => {
    if (!isNetworkMode) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let isMobile = width < 768;
    let isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const hardwareThreads =
      typeof navigator !== 'undefined' && navigator.hardwareConcurrency
        ? navigator.hardwareConcurrency
        : 8;
    const isLowPowerDevice = hardwareThreads <= 4;

    let nodes: ParticleNode[] = [];
    let packets: DataPacket[] = [];
    let ripples: SignalRipple[] = [];
    let rafId = 0;
    let isPaused = document.hidden;

    const pointer = {
      x: -9999,
      y: -9999,
      smoothX: -9999,
      smoothY: -9999,
      active: false,
    };

    const radar = {
      radius: 0,
      maxRadius: Math.hypot(width, height) * 0.65,
      cooldown: 120,
      active: false,
    };

    const getConfig = () => {
      const perfScale = isLowPowerDevice ? 0.8 : 1;
      if (width < 640) {
        return {
          nodeCount: Math.round(32 * perfScale),
          maxDist: 132,
          maxLinksPerNode: 4,
          packetCount: 4,
          cursorRadius: 150,
        };
      }
      if (width < 1024) {
        return {
          nodeCount: Math.round(58 * perfScale),
          maxDist: 158,
          maxLinksPerNode: 5,
          packetCount: 6,
          cursorRadius: 210,
        };
      }
      const desktopCount = width >= 1440 ? 96 : 86;
      return {
        nodeCount: Math.round(desktopCount * perfScale),
        maxDist: 176,
        maxLinksPerNode: 5,
        packetCount: 9,
        cursorRadius: 245,
      };
    };

    // Stratified jittered grid so particles spread evenly across the entire canvas
    const buildNodes = () => {
      const { nodeCount, packetCount } = getConfig();
      const aspect = Math.max(0.5, width / Math.max(1, height));
      const cols = Math.max(2, Math.round(Math.sqrt(nodeCount * aspect)));
      const rows = Math.max(2, Math.ceil(nodeCount / cols));
      const cellW = width / cols;
      const cellH = height / rows;

      // Shuffle grid cell indices so remaining cells aren't clipped from only the bottom row
      const cells: number[] = Array.from({ length: cols * rows }, (_, i) => i);
      for (let i = cells.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = cells[i];
        cells[i] = cells[j];
        cells[j] = tmp;
      }

      nodes = Array.from({ length: nodeCount }, (_, idx) => {
        const cellIndex = cells[idx % cells.length];
        const col = cellIndex % cols;
        const row = Math.floor(cellIndex / cols);

        const x = (col + 0.14 + Math.random() * 0.72) * cellW;
        const y = (row + 0.14 + Math.random() * 0.72) * cellH;
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.14 + Math.random() * 0.16;
        const baseRadius = 1.25 + (idx % 3) * 0.5;

        return {
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          offsetX: 0,
          offsetY: 0,
          renderX: x,
          renderY: y,
          baseRadius,
          radius: baseRadius,
          glow: 0,
          pulse: 0,
          tint: idx % 2 === 0 ? 'cyan' : 'blue',
        };
      });

      packets = Array.from({ length: packetCount }, (_, idx) => {
        const fromIdx = idx % Math.max(1, nodes.length);
        const toIdx = (fromIdx + 1) % Math.max(1, nodes.length);
        return {
          fromIdx,
          toIdx,
          progress: Math.random(),
          speed: 0.006 + Math.random() * 0.0055,
          color: idx % 3 === 0 ? '#2685FF' : '#37DFFF',
        };
      });
    };

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      isMobile = width < 768;
      isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      radar.maxRadius = Math.hypot(width, height) * 0.65;
      buildNodes();
    };

    const pickNeighbor = (fromIdx: number, maxDist: number): number | null => {
      const source = nodes[fromIdx];
      if (!source) return null;
      const candidates: number[] = [];
      const limitSq = maxDist * maxDist;

      for (let i = 0; i < nodes.length; i++) {
        if (i === fromIdx) continue;
        const dx = nodes[i].renderX - source.renderX;
        const dy = nodes[i].renderY - source.renderY;
        if (dx * dx + dy * dy <= limitSq) {
          candidates.push(i);
        }
      }
      if (candidates.length === 0) return null;
      return candidates[Math.floor(Math.random() * candidates.length)];
    };

    const emitRipple = (x: number, y: number, color = '#37DFFF') => {
      if (shouldReduceMotion) return;
      if (ripples.length > 6) ripples.shift();
      ripples.push({
        x,
        y,
        radius: 6,
        maxRadius: isMobile ? 90 : 140,
        alpha: 0.34,
        color,
      });
    };

    const drawStaticFrame = () => {
      ctx.clearRect(0, 0, width, height);
      const { maxDist, maxLinksPerNode } = getConfig();
      const maxDistSq = maxDist * maxDist;
      const intensity = detailViewRef.current ? 0.36 : 0.72;
      const linkCounts = new Uint8Array(nodes.length);

      for (let i = 0; i < nodes.length; i++) {
        if (linkCounts[i] >= maxLinksPerNode) continue;
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          if (linkCounts[j] >= maxLinksPerNode) continue;
          const b = nodes[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < maxDistSq) {
            linkCounts[i]++;
            linkCounts[j]++;
            const alpha = (1 - Math.sqrt(distSq) / maxDist) * 0.16 * intensity;
            ctx.strokeStyle = `rgba(55, 223, 255, ${alpha.toFixed(3)})`;
            ctx.lineWidth = 0.9;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
            if (linkCounts[i] >= maxLinksPerNode) break;
          }
        }
      }

      for (const node of nodes) {
        ctx.fillStyle = NODE_COLORS[node.tint];
        ctx.globalAlpha = 0.44 * intensity;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.baseRadius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const renderFrame = () => {
      if (isPaused || shouldReduceMotion) return;

      const { maxDist, maxLinksPerNode, cursorRadius } = getConfig();
      const maxDistSq = maxDist * maxDist;
      const cursorRadiusSq = cursorRadius * cursorRadius;
      const repelRadius = cursorRadius * 0.62;

      // Calm intensity outside hero / inside detail view so text stays effortlessly readable
      const scrollRatio = Math.min(1, window.scrollY / Math.max(460, height * 0.72));
      const intensity = detailViewRef.current ? 0.36 : 1 - scrollRatio * 0.6;

      // Smooth cursor interpolation
      if (pointer.active) {
        if (pointer.smoothX < -1000) {
          pointer.smoothX = pointer.x;
          pointer.smoothY = pointer.y;
        } else {
          pointer.smoothX += (pointer.x - pointer.smoothX) * 0.18;
          pointer.smoothY += (pointer.y - pointer.smoothY) * 0.18;
        }
      }

      ctx.clearRect(0, 0, width, height);

      // Subtle atmospheric radial depth behind hero right / network hub
      const hubX = width * 0.72;
      const hubY = height * 0.36;
      const ambientGrad = ctx.createRadialGradient(
        hubX,
        hubY,
        20,
        hubX,
        hubY,
        Math.max(width, height) * 0.56
      );
      ambientGrad.addColorStop(0, `rgba(38, 133, 255, ${(0.085 * intensity).toFixed(3)})`);
      ambientGrad.addColorStop(0.55, `rgba(55, 223, 255, ${(0.03 * intensity).toFixed(3)})`);
      ambientGrad.addColorStop(1, 'rgba(7, 17, 31, 0)');
      ctx.fillStyle = ambientGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle Network Radar periodic scan
      if (!radar.active) {
        radar.cooldown -= 1;
        if (radar.cooldown <= 0) {
          radar.active = true;
          radar.radius = 20;
        }
      } else {
        radar.radius += isMobile ? 2.1 : 2.8;
        const progress = radar.radius / radar.maxRadius;
        const radarAlpha = Math.max(0, (1 - progress) * 0.08 * intensity);
        if (radarAlpha > 0.002) {
          ctx.strokeStyle = `rgba(55, 223, 255, ${radarAlpha.toFixed(3)})`;
          ctx.lineWidth = 1.15;
          ctx.beginPath();
          ctx.arc(hubX, hubY, radar.radius, 0, Math.PI * 2);
          ctx.stroke();
        }
        if (radar.radius >= radar.maxRadius) {
          radar.active = false;
          radar.cooldown = 360;
        }
      }

      // Update nodes & compute cursor proximity + gentle spring-return repulsion
      const nearestCursorNodes: { idx: number; dist: number }[] = [];
      const cursorEnabled = pointer.active && !isCoarsePointer && !isMobile;

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        node.x += node.vx;
        node.y += node.vy;

        // Soft boundary wrap
        if (node.x < -24) node.x = width + 24;
        else if (node.x > width + 24) node.x = -24;
        if (node.y < -24) node.y = height + 24;
        else if (node.y > height + 24) node.y = -24;

        let targetGlow = 0;
        let targetRadius = node.baseRadius;
        let targetOffsetX = 0;
        let targetOffsetY = 0;

        // Radar wavefront shimmer
        if (radar.active) {
          const rDist = Math.abs(Math.hypot(node.x - hubX, node.y - hubY) - radar.radius);
          if (rDist < 30) {
            targetGlow = Math.max(targetGlow, (1 - rDist / 30) * 0.45);
          }
        }

        if (cursorEnabled) {
          const dx = node.x - pointer.smoothX;
          const dy = node.y - pointer.smoothY;
          const distSq = dx * dx + dy * dy;

          if (distSq < cursorRadiusSq && distSq > 0.01) {
            const dist = Math.sqrt(distSq);
            const proximity = 1 - dist / cursorRadius;
            targetGlow = Math.max(targetGlow, proximity);
            targetRadius = node.baseRadius + proximity * 2.35;

            nearestCursorNodes.push({ idx: i, dist });

            // Gentle repulsion that springs smoothly back when cursor moves away
            if (dist < repelRadius) {
              const pushForce = Math.pow(1 - dist / repelRadius, 1.35) * 24;
              targetOffsetX = (dx / dist) * pushForce;
              targetOffsetY = (dy / dist) * pushForce;
            }
          }
        }

        // Smooth interpolation for glow, size, and spring-back offset
        node.offsetX += (targetOffsetX - node.offsetX) * 0.1;
        node.offsetY += (targetOffsetY - node.offsetY) * 0.1;
        node.renderX = node.x + node.offsetX;
        node.renderY = node.y + node.offsetY;

        node.glow += (targetGlow - node.glow) * 0.14;
        node.radius += (targetRadius - node.radius) * 0.16;
        node.pulse *= 0.92;
      }

      // Draw network connection lines (capped per node so dense mesh stays clean & 60fps)
      const linkCounts = new Uint8Array(nodes.length);
      const glowingEdges: { ax: number; ay: number; bx: number; by: number; alpha: number }[] = [];

      ctx.lineWidth = 0.85;
      for (let i = 0; i < nodes.length; i++) {
        if (linkCounts[i] >= maxLinksPerNode) continue;
        const a = nodes[i];

        for (let j = i + 1; j < nodes.length; j++) {
          if (linkCounts[j] >= maxLinksPerNode) continue;
          const b = nodes[j];
          const dx = b.renderX - a.renderX;
          const dy = b.renderY - a.renderY;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            linkCounts[i]++;
            linkCounts[j]++;

            const dist = Math.sqrt(distSq);
            const distFactor = 1 - dist / maxDist;
            const boost = Math.max(a.glow, b.glow);

            if (boost > 0.2) {
              const glowAlpha = Math.min(
                0.68,
                (distFactor * 0.18 + boost * distFactor * 0.45) * intensity
              );
              glowingEdges.push({
                ax: a.renderX,
                ay: a.renderY,
                bx: b.renderX,
                by: b.renderY,
                alpha: glowAlpha,
              });
            } else {
              const baseAlpha = Math.min(0.32, distFactor * 0.16 * intensity);
              ctx.strokeStyle = `rgba(38, 133, 255, ${baseAlpha.toFixed(3)})`;
              ctx.beginPath();
              ctx.moveTo(a.renderX, a.renderY);
              ctx.lineTo(b.renderX, b.renderY);
              ctx.stroke();
            }

            if (linkCounts[i] >= maxLinksPerNode) break;
          }
        }
      }

      // Render cursor-illuminated cyan lines with subtle cyan glow in one batched pass
      if (glowingEdges.length > 0) {
        ctx.save();
        ctx.shadowColor = 'rgba(55, 223, 255, 0.45)';
        ctx.shadowBlur = 6;
        ctx.lineWidth = 1.15;
        for (const edge of glowingEdges) {
          ctx.strokeStyle = `rgba(55, 223, 255, ${edge.alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(edge.ax, edge.ay);
          ctx.lineTo(edge.bx, edge.by);
          ctx.stroke();
        }
        ctx.restore();
      }

      // Draw subtle cursor-to-nearest-nodes tethers (up to 5 closest)
      if (cursorEnabled && nearestCursorNodes.length > 0) {
        nearestCursorNodes.sort((a, b) => a.dist - b.dist);
        const topNodes = nearestCursorNodes.slice(0, 5);
        ctx.save();
        ctx.shadowColor = 'rgba(55, 223, 255, 0.35)';
        ctx.shadowBlur = 4;
        ctx.lineWidth = 0.95;
        for (const item of topNodes) {
          const target = nodes[item.idx];
          const alpha = (1 - item.dist / cursorRadius) * 0.34 * intensity;
          ctx.strokeStyle = `rgba(55, 223, 255, ${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(pointer.smoothX, pointer.smoothY);
          ctx.lineTo(target.renderX, target.renderY);
          ctx.stroke();
        }
        ctx.restore();
      }

      // Update and render data packets traveling along live edges
      for (const packet of packets) {
        const from = nodes[packet.fromIdx];
        const to = nodes[packet.toIdx];
        if (!from || !to) continue;

        const dx = to.renderX - from.renderX;
        const dy = to.renderY - from.renderY;
        const dist = Math.hypot(dx, dy);

        if (dist > maxDist * 1.45 || packet.progress >= 1) {
          if (packet.progress >= 1) {
            to.pulse = Math.min(1, to.pulse + 0.72);
          }
          const nextNeighbor = pickNeighbor(packet.toIdx, maxDist);
          if (nextNeighbor !== null) {
            packet.fromIdx = packet.toIdx;
            packet.toIdx = nextNeighbor;
          } else {
            const randStart = Math.floor(Math.random() * nodes.length);
            const neighbor = pickNeighbor(randStart, maxDist);
            if (neighbor !== null) {
              packet.fromIdx = randStart;
              packet.toIdx = neighbor;
            }
          }
          packet.progress = 0;
          continue;
        }

        packet.progress += packet.speed;
        const px = from.renderX + dx * packet.progress;
        const py = from.renderY + dy * packet.progress;
        const tailProgress = Math.max(0, packet.progress - 0.14);
        const tx = from.renderX + dx * tailProgress;
        const ty = from.renderY + dy * tailProgress;

        ctx.strokeStyle = packet.color;
        ctx.globalAlpha = 0.36 * intensity;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(px, py);
        ctx.stroke();

        ctx.fillStyle = packet.color;
        ctx.globalAlpha = 0.88 * intensity;
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Draw nodes with proximity & pulse glow
      for (const node of nodes) {
        const activeBoost = Math.max(node.glow, node.pulse);
        const radius = node.radius + node.pulse * 1.25;
        const baseAlpha = (0.46 + activeBoost * 0.5) * intensity;

        if (activeBoost > 0.1) {
          const haloRadius = radius * (3.1 + activeBoost * 1.6);
          const halo = ctx.createRadialGradient(
            node.renderX,
            node.renderY,
            0,
            node.renderX,
            node.renderY,
            haloRadius
          );
          halo.addColorStop(
            0,
            `rgba(55, 223, 255, ${(0.34 * activeBoost * intensity).toFixed(3)})`
          );
          halo.addColorStop(1, 'rgba(55, 223, 255, 0)');
          ctx.fillStyle = halo;
          ctx.beginPath();
          ctx.arc(node.renderX, node.renderY, haloRadius, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = activeBoost > 0.3 ? '#37DFFF' : NODE_COLORS[node.tint];
        ctx.globalAlpha = Math.min(0.95, baseAlpha);
        ctx.beginPath();
        ctx.arc(node.renderX, node.renderY, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Render Signal Ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += 2.6;
        r.alpha *= 0.94;

        if (r.radius >= r.maxRadius || r.alpha <= 0.01) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.strokeStyle = r.color;
        ctx.globalAlpha = r.alpha;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      rafId = requestAnimationFrame(renderFrame);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    };

    const handlePointerLeave = () => {
      pointer.active = false;
    };

    const handleCanvasRippleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && target.closest('input, textarea, select')) return;
      emitRipple(e.clientX, e.clientY, '#37DFFF');
    };

    const handleCustomRipple = (e: Event) => {
      const detail = (e as CustomEvent<{ x: number; y: number; color?: string }>).detail;
      if (detail) {
        emitRipple(detail.x, detail.y, detail.color ?? '#36D982');
      }
    };

    const handleVisibilityChange = () => {
      isPaused = document.hidden;
      if (!isPaused && !shouldReduceMotion) {
        rafId = requestAnimationFrame(renderFrame);
      } else if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };

    resizeCanvas();

    if (shouldReduceMotion) {
      drawStaticFrame();
    } else {
      rafId = requestAnimationFrame(renderFrame);
    }

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handlePointerLeave);
    window.addEventListener('click', handleCanvasRippleClick);
    window.addEventListener('network-signal-ripple', handleCustomRipple);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseleave', handlePointerLeave);
      window.removeEventListener('click', handleCanvasRippleClick);
      window.removeEventListener('network-signal-ripple', handleCustomRipple);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isNetworkMode, shouldReduceMotion]);

  return (
    <AnimatePresence>
      {isNetworkMode && (
        <motion.div
          key="living-network-canvas"
          aria-hidden="true"
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={shouldReduceMotion ? undefined : { opacity: 0 }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.45, ease: 'easeOut' }}
          className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        >
          <canvas ref={canvasRef} className="block h-full w-full" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
