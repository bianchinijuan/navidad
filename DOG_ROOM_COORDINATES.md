# 🐕 Dog Room - Sistema de Coordenadas

## Grid de Referencia: 1000 x 600

```
(0,0)                                                                    (1000,0)
┌────────────────────────────────────────────────────────────────────────┐
│                                                                        │
│                         DOG ROOM SCENE                                │
│                                                                        │
│                                                                        │
│                                                                        │
│                                                                        │
│                                                                        │
│                                                                        │
│                                                                        │
│                                                                        │
│                                                                        │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
(0,600) FLOOR                                                      (1000,600)
```

---

## 🎯 Posiciones Propuestas (Basadas en Lógica)

### 1. **White Dog** (Protagonista - Izquierda)
```
Coordenadas:
  x: 150 (15% desde la izquierda)
  bottom: 0 (toca el piso)
  width: 350 (35% del ancho de escena)
  height: 350 (58% del alto de escena)

Justificación:
  - Protagonista del room, debe ser grande
  - Izquierda para balance visual
  - En el piso (bottom: 0) como debe estar un perro sentado
```

### 2. **Food Bowl** (Suelo - Derecha del perro)
```
Coordenadas:
  x: 550 (55% desde la izquierda)
  bottom: 0 (toca el piso)
  width: 160 (16% del ancho)
  height: 100 (16.67% del alto)

Justificación:
  - A la derecha del perro (distancia razonable)
  - En el piso donde debe estar un bowl
  - Tamaño proporcionado: visible pero no protagonista
  - El perro puede "alcanzarlo" visualmente
```

### 3. **Food Jar** (Estante Superior - Derecha)
```
Coordenadas:
  x: 750 (75% desde la izquierda)
  y: 120 (20% desde arriba - simula estar en estante)
  width: 180 (18% del ancho)
  height: 250 (41.67% del alto)

Justificación:
  - Arriba a la derecha (simula estante alto)
  - Separado del perro y bowl (diferente área)
  - Tamaño mediano: visible para interacción
  - No toca el piso (y: 120 en lugar de bottom: 0)
```

### 4. **Photo Frame** (Aparece después - Arriba Centro-Derecha)
```
Coordenadas:
  x: 650 (65% desde la izquierda)
  y: 80 (13% desde arriba - alto en la pared)
  width: 200 (20% del ancho)
  height: 260 (43% del alto)

Justificación:
  - Arriba como si estuviera colgado en la pared
  - Centro-derecha para balance
  - Aparece después de alimentar al perro
  - Tamaño suficiente para ser recompensa visual
```

---

## 📐 Conversión a CSS (Automática)

El componente `<Asset>` convierte automáticamente:

```typescript
// Dog:
<Asset
  x={150}
  bottom={0}
  width={350}
  height={350}
/>

// Se convierte a:
left: 15%        // 150/1000
bottom: 0%       // 0/600
width: 35%       // 350/1000
height: 58.33%   // 350/600
```

---

## 🔧 Implementación Propuesta

```tsx
<Scene background="#a88650">
  <Floor height={180} />

  {/* White Dog */}
  <Asset
    src="/assets/dog/dog.png"
    alt="White Dog"
    x={150}
    bottom={0}
    width={350}
    height={350}
    zIndex={10}
  />

  {/* Food Bowl */}
  <Asset
    src="/assets/dog/food.png"
    alt="Food Bowl"
    x={550}
    bottom={0}
    width={160}
    height={100}
    zIndex={10}
  />

  {/* Food Jar */}
  <Asset
    src="/assets/dog/food-container.png"
    alt="Food Jar"
    x={750}
    y={120}
    width={180}
    height={250}
    zIndex={5}
  />

  {/* Photo Frame (appears after feeding) */}
  {dogPhotoCollected && (
    <Asset
      src="/assets/dog/photo-frame.png"
      alt="Photo Frame"
      x={650}
      y={80}
      width={200}
      height={260}
      zIndex={5}
    />
  )}
</Scene>
```

---

## ✏️ Ajustes Fáciles

Si quieres mover algo:

### Mover Dog más a la derecha:
```
x: 150 → x: 200 (20% desde izquierda)
```

### Hacer Bowl más grande:
```
width: 160 → width: 200 (20% del ancho)
height: 100 → height: 130 (21.67% del alto)
```

### Bajar Food Jar (más cerca del piso):
```
y: 120 → y: 250 (41.67% desde arriba)
```

### Centrar horizontalmente cualquier elemento:
```
<Asset x={500} centered />
// x=500 es el centro horizontal del grid 1000
// centered=true aplica translateX(-50%)
```

---

## 🎯 Valores Predecibles

**NO más**:
- ❌ `left-[18%]` mezclado con `w-[320px]`
- ❌ Ajustes "a ojo"
- ❌ Valores mágicos que no escalan

**AHORA**:
- ✅ Todo en coordenadas del grid 1000x600
- ✅ Porcentajes automáticos y consistentes
- ✅ Ajustes matemáticos predecibles
- ✅ Escala perfecta en cualquier viewport

---

## ❓ Aprobación de Posiciones

**¿Te parecen bien estas coordenadas propuestas?**

Si no:
- Dime qué mover y hacia dónde
- O dame coordenadas específicas que prefieras
- O dame referencias tipo "bowl más cerca del perro", "jar más abajo"

**Una vez aprobadas, implemento el sistema en todos los rooms.**
