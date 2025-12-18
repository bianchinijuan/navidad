# 📐 Guía de Exportación de Imágenes - Dimensiones Óptimas

## ⚠️ LO MÁS IMPORTANTE

### 1. **RECORTAR BORDES TRANSPARENTES**
❌ **NO exportes con espacio en blanco alrededor**
✅ **SÍ recorta tight** (crop to content)

**Por qué**: `object-fit: contain` hace que la imagen quepa dentro del contenedor. Si tu PNG tiene 60% de imagen y 40% de espacio transparente, la imagen real se verá MUCHO más pequeña.

**Ejemplo**:
```
❌ MAL:
┌──────────────────┐
│                  │  <- Espacio transparente
│      🎄         │  <- Árbol real (pequeño)
│                  │  <- Espacio transparente
└──────────────────┘

✅ BIEN:
┌────┐
│ 🎄 │  <- Árbol recortado tight
└────┘
```

---

## 📏 Aspect Ratios Recomendados

Basado en las coordenadas propuestas, cada asset tiene un aspect ratio ideal:

### Hub Room:

| Asset | Coordenadas | Proporción | Aspect Ratio | Dimensión Sugerida |
|-------|-------------|------------|--------------|-------------------|
| **Christmas Tree** | 400x550 | Vertical alto | 0.73:1 (aprox 3:4) | **900x1200px** |
| **Fireplace** | 450x480 | Casi cuadrado | 0.94:1 (aprox 1:1) | **1000x1050px** |
| **Gift** | 140x140 | Cuadrado perfecto | 1:1 | **600x600px** |
| **Picture Frame** | 150x200 | Vertical | 0.75:1 (3:4) | **600x800px** |

### Dog Room:

| Asset | Coordenadas | Proporción | Aspect Ratio | Dimensión Sugerida |
|-------|-------------|------------|--------------|-------------------|
| **Dog** | 350x350 | Cuadrado perfecto | 1:1 | **800x800px** |
| **Bowl** | 160x100 | Horizontal bajo | 1.6:1 (8:5) | **800x500px** |
| **Food Jar** | 180x250 | Vertical | 0.72:1 (aprox 3:4) | **700x950px** |
| **Photo Frame** | 200x260 | Vertical | 0.77:1 (aprox 3:4) | **700x900px** |

---

## 🎯 Recomendaciones por Asset

### 🎄 Christmas Tree
**Dimensión ideal**: 900x1200px (3:4 vertical)
**Orientación**: Vertical alto
**Recorte**: Tight desde la punta de la estrella hasta la base del tronco
**Evitar**: Espacio arriba de la estrella o debajo del tronco

### 🔥 Fireplace
**Dimensión ideal**: 1000x1050px (casi cuadrado)
**Orientación**: Casi cuadrado, levemente más alto que ancho
**Recorte**: Desde el borde del mantle hasta la base
**Evitar**: Espacio a los lados

### 🎁 Gift
**Dimensión ideal**: 600x600px (cuadrado)
**Orientación**: Cuadrado perfecto
**Recorte**: Justo alrededor del regalo y el moño
**Evitar**: Espacio extra alrededor

### 🐕 Dog
**Dimensión ideal**: 800x800px (cuadrado)
**Orientación**: Cuadrado
**Recorte**: Desde las orejas hasta las patas, de nariz a cola
**Evitar**: Mucho piso debajo o espacio arriba

### 🥣 Bowl
**Dimensión ideal**: 800x500px (horizontal ancho)
**Orientación**: MUY horizontal (más ancho que alto)
**Recorte**: Vista 3/4 desde arriba, tight
**Evitar**: Espacio a los lados

### 🍖 Food Jar
**Dimensión ideal**: 700x950px (vertical)
**Orientación**: Vertical
**Recorte**: Desde la tapa hasta la base
**Evitar**: Espacio arriba o abajo

---

## 🔧 Cómo Recortar en Diferentes Herramientas

### En Photoshop/GIMP:
1. Abre la imagen
2. `Image → Trim` / `Recortar`
3. Selecciona "Transparent Pixels"
4. Apply

### En Online Tools:
1. https://www.remove.bg → Ya quita el fondo
2. https://www.iloveimg.com/crop-image → Recorta manualmente

### En Leonardo.ai/Ideogram:
1. Si la herramienta tiene "tight crop" o "no padding", actívalo
2. Si genera con bordes, descarga y recorta después

---

## 📐 Template de Verificación

Antes de exportar, verifica:

```
✅ La imagen está recortada tight (sin bordes extra)
✅ El aspect ratio coincide con la tabla de arriba
✅ Resolución mínima: 600px en el lado más corto
✅ Formato: PNG con transparencia real (RGBA)
✅ El objeto principal ocupa ~80-90% del espacio de la imagen
```

---

## 🎨 Ejemplo Visual - Christmas Tree

### ❌ MAL (con bordes):
```
Archivo: 2000x2000px
┌────────────────────────────────┐
│                                │ <- 300px vacío
│                                │
│           ⭐                   │
│          🎄🎄                  │
│         🎄🎄🎄                 │ <- Árbol real: 1400px
│        🎄🎄🎄🎄                │
│          ║║                    │
│                                │ <- 300px vacío
└────────────────────────────────┘

Resultado: El árbol se verá PEQUEÑO dentro del contenedor
porque object-fit: contain escala el PNG completo (2000x2000)
```

### ✅ BIEN (recortado tight):
```
Archivo: 900x1200px
┌─────────┐
│    ⭐   │ <- 0px desperdiciado
│   🎄🎄  │
│  🎄🎄🎄 │ <- Todo el árbol
│ 🎄🎄🎄🎄│
│   ║║    │
└─────────┘ <- 0px desperdiciado

Resultado: El árbol ocupa TODO el espacio disponible
```

---

## 🚀 Workflow Recomendado

### Paso 1: Generar
Genera la imagen con el prompt correspondiente.

### Paso 2: Verificar Transparencia
- Abre en editor de imágenes
- Verifica que tiene canal alpha (RGBA)
- Si tiene fondo blanco, usa remove.bg

### Paso 3: Recortar
- Recorta TIGHT a los bordes del objeto
- Usa las dimensiones recomendadas de la tabla

### Paso 4: Exportar
```
Formato: PNG
Transparencia: Sí
Resolución: Según tabla arriba
Compresión: Media (no hace falta máxima calidad)
```

### Paso 5: Verificar Aspect Ratio
```bash
# En terminal:
file mi-imagen.png

# Debe mostrar algo como:
PNG image data, 900 x 1200, 8-bit/color RGBA
                 ↑     ↑
         Verificar proporción
```

---

## 📊 Resumen Rápido

| Asset | Dimensión | Tipo | Prioridad Recorte |
|-------|-----------|------|-------------------|
| Tree | 900x1200 | Vertical | ⭐⭐⭐ CRÍTICO |
| Fireplace | 1000x1050 | Cuadrado | ⭐⭐⭐ CRÍTICO |
| Gift | 600x600 | Cuadrado | ⭐⭐ Importante |
| Dog | 800x800 | Cuadrado | ⭐⭐⭐ CRÍTICO |
| Bowl | 800x500 | Horizontal | ⭐⭐ Importante |
| Jar | 700x950 | Vertical | ⭐⭐ Importante |

---

## ❓ Preguntas Frecuentes

**P: ¿Puedo usar dimensiones diferentes?**
R: Sí, pero mantén el aspect ratio. Ejemplo: 600x800 en lugar de 900x1200 funciona (ambos son 3:4).

**P: ¿Importa si uso 1200px o 2400px?**
R: No mucho (se escala), pero 800-1200px en el lado largo es óptimo (balance calidad/peso).

**P: ¿Qué pasa si mi imagen no es exactamente ese aspect ratio?**
R: `object-fit: contain` la ajustará, pero puede quedar espacio vacío. Mejor mantener la proporción.

**P: ¿Debo recortar TODO el espacio transparente?**
R: Sí, CRÍTICO. Un poco de padding (5-10px) está bien, pero no 100-200px.

---

## 🎯 Acción Inmediata

Cuando regeneres las imágenes:

1. **Genera con el nuevo prompt warm**
2. **Descarga el PNG**
3. **Abre en editor**
4. **Recorta tight** (Trim transparent pixels)
5. **Verifica dimensiones** (debe coincidir con tabla)
6. **Exporta PNG con RGBA**
7. **Guarda en carpeta correspondiente**

**Así el nuevo sistema de coordenadas funcionará PERFECTO.**
