const CONFIG = {
	starCount: 600,
	speed: 0.12,
	spread: 2,
	focal: 0.6,
	twinkle: 0.3,
	trail: 0.4,
	starSize: 0.6,
	bgColor: '#18161D',
	starColor: '#FFFFFF',
	fadeInRange: 0.3,
	reverseFly: false,
	followCursor: false,
	galaxyMode: false,
	direction: 'none',
	randomColors: false
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const smoothstep = (t) => {
	const x = clamp(t, 0, 1);
	return x * x * (3 - 2 * x);
};

const parseColor = (input) => {
	const value = (input || '#000000').trim().toLowerCase();

	if (value.startsWith('#')) {
		let hex = value.slice(1);
		if ([3, 4].includes(hex.length)) {
			hex = [...hex].map((char) => char + char).join('');
		}
		if ([6, 8].includes(hex.length)) {
			return {
				r: parseInt(hex.slice(0, 2), 16),
				g: parseInt(hex.slice(2, 4), 16),
				b: parseInt(hex.slice(4, 6), 16),
				a: hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1
			};
		}
	}

	const match = value.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+)\s*)?\)/);
	if (match) {
		const [, r, g, b, a] = match;
		return {
			r: clamp(Number(r), 0, 255),
			g: clamp(Number(g), 0, 255),
			b: clamp(Number(b), 0, 255),
			a: a !== undefined ? clamp(Number(a), 0, 1) : 1
		};
	}

	return {
		r: 0,
		g: 0,
		b: 0,
		a: 1
	};
};

const createStar = (starColor) => ({
	x: 0,
	y: 0,
	z: 0.5,
	px: null,
	py: null,
	phase: 0,
	twinkle: 1,
	size: CONFIG.starSize,
	cr: starColor.r,
	cg: starColor.g,
	cb: starColor.b
});

export default class Starfield {
	constructor(canvas, config = CONFIG) {
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		this.config = config;
		this.colors = {
			bg: parseColor(config.bgColor),
			star: parseColor(config.starColor)
		};

		this._width = 0;
		this._height = 0;
		this._stars = [];
		this._lastTime = performance.now();
		this._rafId = null;
		this._cursor = {
			x: 0,
			y: 0
		};
		this._cursorSmooth = {
			x: 0,
			y: 0
		};

		this._handleResize = () => {
			this._resize();
			this._initStars();
		};

		this._handlePointerMove = ({
			clientX,
			clientY
		}) => {
			const rect = this.canvas.getBoundingClientRect();
			if (!rect.width || !rect.height) return;

			this._cursor.x = ((clientX - rect.left) / rect.width - 0.5) * 2;
			this._cursor.y = ((clientY - rect.top) / rect.height - 0.5) * 2;
		};

		this._handlePointerLeave = () => {
			this._cursor.x = 0;
			this._cursor.y = 0;
		};

		this._loop = (now) => {
			//const dt = Math.min(0.05, (now - this._lastTime) / 1000);
			const dt = Math.min(0.01, (now - this._lastTime) / 1000);

			this._lastTime = now;
			this._drawFrame(now, dt);
			this._rafId = requestAnimationFrame(this._loop);
		};

		this._bindEvents();
	}

	_bindEvents() {
		window.addEventListener('resize', this._handleResize);

		document.addEventListener('visibilitychange', () => {
			if (document.hidden) {
				this._stop();
			} else {
				this._startLoop();
			}
		});

		if (this.config.followCursor) {
			this.canvas.style.pointerEvents = 'auto';
			this.canvas.addEventListener('pointermove', this._handlePointerMove);
			this.canvas.addEventListener('pointerleave', this._handlePointerLeave);
		}
	}

	_resize() {
		const wrap = this.canvas.parentElement;
		const w = Math.max(1, wrap?.clientWidth ?? this.canvas.clientWidth);
		const h = Math.max(1, wrap?.clientHeight ?? this.canvas.clientHeight);
		const dpr = Math.min(window.devicePixelRatio || 1, 2);

		this._width = w;
		this._height = h;
		this.canvas.width = Math.floor(w * dpr);
		this.canvas.height = Math.floor(h * dpr);
		this.canvas.style.width = `${w}px`;
		this.canvas.style.height = `${h}px`;

		if (this.ctx.resetTransform) {
			this.ctx.resetTransform();
		}
		this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	}

	_getFocalLength() {
		return Math.min(this._width, this._height) * this.config.focal;
	}

	_resetStar(star, focalLen, zOverride) {
		const {
			spread,
			starSize,
			randomColors,
			reverseFly
		} = this.config;
		const {
			star: starColor
		} = this.colors;
		const z = zOverride != null ? zOverride : (reverseFly ? 0.12 : 0.98);
		const cx = (Math.random() * 2 - 1) * (this._width / 2 * spread + 40);
		const cy = (Math.random() * 2 - 1) * (this._height / 2 * spread + 40);

		Object.assign(star, {
			z,
			x: (cx * z) / focalLen,
			y: (cy * z) / focalLen,
			px: null,
			py: null,
			phase: Math.random() * Math.PI * 2,
			twinkle: 0.5 + 1.5 * Math.random(),
			size: starSize * (0.6 + 0.8 * Math.random())
		});

		if (randomColors) {
			const base = 100 + 10 * Math.random();
			const randChannel = () => clamp(base + (Math.random() - 0.5) * 80, 100, 255);
			star.cr = randChannel();
			star.cg = randChannel();
			star.cb = randChannel();
		} else {
			star.cr = starColor.r;
			star.cg = starColor.g;
			star.cb = starColor.b;
		}
	}

	_initStars() {
		const focalLen = this._getFocalLength();
		const {
			starCount
		} = this.config;
		const {
			star: starColor
		} = this.colors;
		const area = this._width * this._height;
		const adaptiveStarCount =
			this._width < 480 ? Math.min(starCount, 280) :
			area < 430000 ? Math.min(starCount, 380) :
			starCount;

		this._stars = Array.from({
			length: adaptiveStarCount
		}, () => {
			const star = createStar(starColor);
			this._resetStar(star, focalLen, 0.12 + 0.86 * Math.random());
			return star;
		});
	}

	_applyDirection(star, dt) {
		const {
			direction,
			speed
		} = this.config;
		if (direction === 'none') return;

		const drift = 0.7 * speed * dt;
		const moves = {
			left: () => {
				star.x -= drift;
			},
			right: () => {
				star.x += drift;
			},
			top: () => {
				star.y -= drift;
			},
			bottom: () => {
				star.y += drift;
			}
		};

		if (moves[direction]) {
			moves[direction]();
		}
	}

	_applyGalaxyMode(star, dt) {
		const {
			galaxyMode,
			reverseFly,
			speed
		} = this.config;
		if (!galaxyMode) return;

		const dist = Math.hypot(star.x, star.y);
		if (dist <= 1e-4) return;

		const angle = Math.atan2(star.y, star.x) + (reverseFly ? -1 : 1) * Math.max(0.1, speed) * dt;
		star.x = Math.cos(angle) * dist;
		star.y = Math.sin(angle) * dist;
	}

	_drawFrame(now, dt) {
		const {
			ctx,
			config,
			colors
		} = this;
		const {
			bg,
			star
		} = colors;
		const cx = this._width / 2;
		const cy = this._height / 2;
		const focalLen = this._getFocalLength();

		ctx.globalCompositeOperation = 'source-over';
		if (config.trail > 0.01) {
			const alpha = (1 - clamp(config.trail, 0, 0.98)) * bg.a;
			ctx.fillStyle = `rgba(${bg.r}, ${bg.g}, ${bg.b}, ${alpha})`;
			ctx.fillRect(0, 0, this._width, this._height);
		} else {
			ctx.clearRect(0, 0, this._width, this._height);
		}

		let originX = cx;
		let originY = cy;

		if (config.followCursor) {
			const lerp = dt > 0 ? Math.min(1, 6 * dt) : 0;
			this._cursorSmooth.x += (this._cursor.x - this._cursorSmooth.x) * lerp;
			this._cursorSmooth.y += (this._cursor.y - this._cursorSmooth.y) * lerp;
			originX = cx - this._cursorSmooth.x * this._width * 0.2;
			originY = cy - this._cursorSmooth.y * this._height * 0.2;
		} else {
			this._cursorSmooth.x = 0;
			this._cursorSmooth.y = 0;
		}

		const dz = dt * config.speed * 0.7 * (config.reverseFly ? 1 : -1);
		const twinkleTime = now * 0.0015;
		const fadeScale = 1 / Math.max(0.05, Math.min(config.fadeInRange, 0.86));
		const dots = [];
		const streaks = [];
		const colorCache = config.randomColors ? new Map() : null;

		const rgba = (alpha, r, g, b) => {
			if (!colorCache) return `rgba(${r}, ${g}, ${b}, ${alpha})`;

			const key = Math.round(alpha * 1000);
			if (!colorCache.has(key)) {
				colorCache.set(key, `rgba(${star.r}, ${star.g}, ${star.b}, ${alpha})`);
			}
			return colorCache.get(key);
		};

		for (const s of this._stars) {
			s.z += dz;

			const outOfDepth = (!config.reverseFly && s.z <= 0.12) || (config.reverseFly && s.z >= 0.98);
			if (outOfDepth) {
				this._resetStar(s, focalLen);
				continue;
			}

			this._applyGalaxyMode(s, dt);
			this._applyDirection(s, dt);

			const invZ = 1 / s.z;
			const sx = s.x * focalLen * invZ + originX;
			const sy = s.y * focalLen * invZ + originY;
			const offScreen = sx < -40 || sx > this._width + 40 || sy < -40 || sy > this._height + 40;

			if (offScreen) {
				this._resetStar(s, focalLen);
				continue;
			}

			const twinkleVal = clamp(
				0.65 + 0.35 * config.twinkle * Math.sin(s.phase + twinkleTime * s.twinkle),
				0,
				1
			);
			const size = Math.max(0.3, s.size * invZ * 0.9);
			const baseAlpha = Math.min(1, (0.15 + 0.9 * twinkleVal) * star.a);
			const alpha = baseAlpha * smoothstep((0.98 - s.z) * fadeScale) * smoothstep((s.z - 0.12) * fadeScale);

			if (size < 0.5 || alpha < 0.01) {
				s.px = sx;
				s.py = sy;
				continue;
			}

			const r = config.randomColors ? s.cr : star.r;
			const g = config.randomColors ? s.cg : star.g;
			const b = config.randomColors ? s.cb : star.b;

			if (s.px !== null && s.py !== null) {
				streaks.push({
					x1: s.px,
					y1: s.py,
					x2: sx,
					y2: sy,
					alpha: 0.3 * alpha,
					width: Math.min(3, size),
					r,
					g,
					b
				});
			}

			dots.push({
				x: sx,
				y: sy,
				size: size * 0.5,
				alpha,
				r,
				g,
				b
			});
			s.px = sx;
			s.py = sy;
		}

		ctx.globalCompositeOperation = 'lighter';
		ctx.lineCap = 'round';

		for (const {
				width,
				alpha,
				r,
				g,
				b,
				x1,
				y1,
				x2,
				y2
			}
			of streaks) {
			ctx.lineWidth = width;
			ctx.strokeStyle = rgba(alpha, r, g, b);
			ctx.beginPath();
			ctx.moveTo(x1, y1);
			ctx.lineTo(x2, y2);
			ctx.stroke();
		}

		for (const {
				x,
				y,
				size,
				alpha,
				r,
				g,
				b
			}
			of dots) {
			ctx.fillStyle = rgba(alpha, r, g, b);
			ctx.beginPath();
			ctx.arc(x, y, size, 0, Math.PI * 2);
			ctx.fill();
		}
	}

	_startLoop() {
		if (this._rafId) return;
		this._lastTime = performance.now();
		this._rafId = requestAnimationFrame(this._loop);
	}

	_stop() {
		if (!this._rafId) return;
		cancelAnimationFrame(this._rafId);
		this._rafId = null;
	}

	start() {
		this._resize();
		this._initStars();
		this._stop();
		this._startLoop();
	}

	destroy() {
		this._stop();
		window.removeEventListener('resize', this._handleResize);
		this.canvas.removeEventListener('pointermove', this._handlePointerMove);
		this.canvas.removeEventListener('pointerleave', this._handlePointerLeave);
	}
}
