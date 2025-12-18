# 🎄 Hub Room - Sistema de Coordenadas

## Grid de Referencia: 1000 x 600

```
(0,0)                                                                    (1000,0)
┌────────────────────────────────────────────────────────────────────────┐
│                        "Merry Christmas!"                             │
│                                                                        │
│              [Picture]                                                │
│                                                                        │
│                                                                        │
│       [Tree]                [Fireplace]                               │
│                                                                        │
│                                                                        │
│       [Gift]                                                          │
│                                                                        │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
(0,600) FLOOR                                                      (1000,600)
```

---

## 🎯 Posiciones Propuestas (Basadas en Referencia)

### 1. **Christmas Tree** (Izquierda - Protagonista)
```
Coordenadas:
  x: 50 (5% desde la izquierda)
  bottom: 0 (toca el piso)
  width: 400 (40% del ancho)
  height: 550 (91.67% del alto)

Justificación:
  - Elemento principal lado izquierdo
  - Grande y prominente (casi todo el alto)
  - En el piso como debe estar un árbol
  - Según referencia: ocupa ~35-40% del lado izquierdo
```

### 2. **Fireplace** (Centro - Punto focal)
```
Coordenadas:
  x: 400 (40% desde la izquierda)
  bottom: 0 (toca el piso)
  width: 450 (45% del ancho)
  height: 480 (80% del alto)

Justificación:
  - Centro de la composición
  - Punto focal principal
  - En el piso
  - Balance con el árbol
```

### 3. **Gift** (Frente del árbol - Pequeño)
```
Coordenadas:
  x: 120 (12% desde la izquierda)
  bottom: 0 (toca el piso)
  width: 140 (14% del ancho)
  height: 140 (23.33% del alto)

Justificación:
  - Junto al árbol, ligeramente adelante
  - Más pequeño que árbol y fireplace
  - En el piso
  - Según referencia: cerca del árbol abajo
```

### 4. **Picture Frame** (Pared - Background)
```
Coordenadas:
  x: 500 (50% - centrado)
  y: 140 (23% desde arriba - alto en pared)
  width: 150 (15% del ancho)
  height: 200 (33% del alto)
  centered: true

Justificación:
  - Arriba centrado (simula estar en la pared)
  - Background element (z-index bajo)
  - Decorativo, no protagonista
  - Centrado horizontalmente con centered: true
```

---

## 📐 Implementación Propuesta

```tsx
<Scene background="#6B0F1A">
  <Floor height={180} />

  {/* Picture Frame (background) */}
  <Asset
    src="/assets/hub/picture-frame.png"
    alt="Picture Frame"
    x={500}
    y={140}
    width={150}
    height={200}
    centered
    zIndex={1}
  />

  {/* Fireplace (center focal point) */}
  <Asset
    src="/assets/hub/fireplace.png"
    alt="Fireplace"
    x={400}
    bottom={0}
    width={450}
    height={480}
    zIndex={10}
  />

  {/* Christmas Tree (left foreground) */}
  <Asset
    src="/assets/hub/christmas-tree.png"
    alt="Christmas Tree"
    x={50}
    bottom={0}
    width={400}
    height={550}
    zIndex={15}
  />

  {/* Gift (front left) */}
  <Asset
    src="/assets/hub/gift.png"
    alt="Gift"
    x={120}
    bottom={0}
    width={140}
    height={140}
    zIndex={20}
  />
</Scene>
```

---

## 🔥 Fire Animation Overlay

El fuego del fireplace se mantiene como overlay absoluto:

```tsx
{fireplaceOn && (
  <div style={{
    position: 'absolute',
    left: '40%',        // x: 400
    bottom: 0,
    width: '45%',       // width: 450
    height: '80%',      // height: 480
    pointerEvents: 'none',
    zIndex: 11,
  }}>
    {/* Fire animation */}
  </div>
)}
```

---

## ✨ Tree Lights Overlay

Las luces del árbol se mantienen como overlay:

```tsx
{treeLightsOn && (
  <div style={{
    position: 'absolute',
    left: '5%',         // x: 50
    bottom: 0,
    width: '40%',       // width: 400
    height: '91.67%',   // height: 550
    pointerEvents: 'none',
    zIndex: 16,
  }}>
    {/* Lights animation */}
  </div>
)}
```

---

## 🎯 Comparación: Antes vs Ahora

### ANTES (Sistema Actual):
```tsx
<div className="absolute left-[2%] bottom-0 w-[480px] h-[580px] z-15">
```
❌ Mezcla píxeles y porcentajes
❌ No escala proporcionalmente
❌ Valores arbitrarios

### AHORA (Sistema de Coordenadas):
```tsx
<Asset x={50} bottom={0} width={400} height={550} zIndex={15} />
```
✅ Todo en el mismo sistema (grid 1000x600)
✅ Escala perfecta automática
✅ Predecible y ajustable

---

## ✏️ Ajustes Fáciles

### Mover Tree más a la derecha:
```
x: 50 → x: 100 (10% desde izquierda)
```

### Hacer Fireplace más grande:
```
width: 450 → width: 500 (50% del ancho)
height: 480 → height: 520 (86.67% del alto)
```

### Centrar Gift debajo del árbol:
```
x: 120 → x: 250 (centrado bajo el árbol)
```

---

## ❓ Aprobación de Posiciones

**¿Te parecen bien estas coordenadas?**

Si quieres cambios:
- Dime qué elemento mover
- Hacia dónde (más izquierda/derecha/arriba/abajo)
- O dame coordenadas exactas

**Una vez aprobadas, implemento en ambos rooms.**
