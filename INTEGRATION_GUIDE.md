# 🎯 Guía de Integración de Assets - Paso a Paso

## ✅ Estado Actual

### Hub Room (3 assets)
- ✅ **Christmas Tree** - Imagen generada, integrada (con issue de transparencia)
- ⏳ **Fireplace** - Código preparado, listo para imagen
- ⏳ **Gift** - Código preparado, listo para imagen

### Dog Room (4 assets)
- ⏳ **White Dog** - PRIORIDAD MÁXIMA
- ⏳ **Food Jar** - Pendiente
- ⏳ **Bowl** - Pendiente
- ⏳ **Photo Frame** - Pendiente

---

## 🔥 PASO 1: Arreglar Christmas Tree (URGENTE)

**Problema**: Se ve el checkerboard porque el PNG no tiene alpha channel real.

**Solución rápida (30 segundos)**:
1. Abre https://www.remove.bg
2. Click "Upload Image"
3. Selecciona `christmas-tree.png` de Downloads
4. Espera ~5 segundos
5. Click "Download HD" → descarga `christmas-tree-no-bg.png`
6. Renombra a `christmas-tree.png`
7. **Reemplaza** en `C:\Juan\navidad\public\assets\hub\christmas-tree.png`
8. Refresca navegador (Ctrl+Shift+R)

**Resultado**: Checkerboard desaparece completamente.

---

## 🎄 PASO 2: Generar Fireplace (HUB ROOM)

### Prompt a usar (copia exacto de `AI_PROMPTS.md`):

```
Vintage fireplace with white ornate mantle in Rusty Lake game style,
hand-painted illustration, point-and-click adventure game art,
brick fireplace with elegant white mantelpiece, Christmas stockings hanging,
warm glow from inside, slightly eerie atmosphere, painted texture,
detailed illustration, no background, transparent PNG, front view
```

**Negative prompt**:
```
modern, minimalist, 3D render, photorealistic, cartoon
```

**Configuración recomendada**:
- Tamaño: 1000x900px (horizontal)
- Estilo: Rusty Lake / illustrated
- **IMPORTANTE**: Marca "Remove background" o pide PNG transparente

### Cómo integrarlo:

1. Guarda la imagen generada como: `public/assets/hub/fireplace.png`
2. Abre `components/scenes/HubRoom.tsx`
3. Busca la línea **126** que dice:
   ```typescript
   {/*
     TODO: Reemplazar placeholder con imagen real
   ```
4. **Descomenta** las líneas 127-136 (el bloque `<img>`)
5. **Elimina** todo el bloque placeholder (líneas 139-171 que dicen `{/* PLACEHOLDER ... FIN PLACEHOLDER */}`)
6. Guarda el archivo
7. Refresca el navegador

**Resultado**: Fireplace real con fire animation overlay cuando lo clickeas.

---

## 🎁 PASO 3: Generar Gift (HUB ROOM)

### Prompt a usar:

```
Wrapped Christmas gift box in Rusty Lake game art style, hand-painted
illustration, red wrapping paper with golden ribbon and bow,
vintage point-and-click game aesthetic, slightly mysterious,
painted texture, detailed illustration, no background, transparent PNG,
3/4 view angle
```

**Negative prompt**:
```
simple, flat, modern, 3D, photorealistic
```

**Configuración**:
- Tamaño: 400x400px (cuadrado)
- Estilo: Rusty Lake / illustrated
- PNG transparente

### Cómo integrarlo:

1. Guarda como: `public/assets/hub/gift.png`
2. Abre `components/scenes/HubRoom.tsx`
3. Busca línea **335**
4. Descomenta líneas 336-346 (`<img>`)
5. Elimina líneas 349-388 (placeholder)
6. Guarda y refresca

**Resultado**: Gift real con lock overlay cuando no está desbloqueado.

---

## 🐕 PASO 4: Generar White Dog (DOG ROOM - MÁXIMA PRIORIDAD)

### Prompt a usar:

```
White fluffy West Highland Terrier dog sitting in Rusty Lake game art style,
hand-painted illustration, cute white dog with tan ears, big expressive eyes,
vintage point-and-click adventure game aesthetic, slightly whimsical but eerie,
painted brush strokes, detailed fur texture, no background, transparent PNG,
side view, warm lighting
```

**Negative prompt**:
```
photograph, realistic, 3D, simple, cartoon, bright colors
```

**CRÍTICO**: El perro debe ser **BLANCO** con orejas marrones/tan.

**Configuración**:
- Tamaño: 600x600px (cuadrado)
- Estilo: Rusty Lake / illustrated
- PNG transparente

### Cómo integrarlo:

1. Guarda como: `public/assets/dog/white-dog.png`
2. **Avísame cuando lo tengas** → Yo actualizo `DogRoom.tsx` para ti

**Resultado**: Dog Room con perrito real estilo Rusty Lake.

---

## 📊 ORDEN RECOMENDADO DE GENERACIÓN

### FASE 1 - Completar Hub Room (30-45 min):
1. ✅ Fix tree transparency (remove.bg)
2. 🔥 Fireplace (genera + integra)
3. 🎁 Gift (genera + integra)

**Cuando completes FASE 1**: Hub Room estará 100% con assets reales.

### FASE 2 - Dog Room (45-60 min):
4. 🐕 White Dog (PRIORIDAD)
5. 🍖 Food Jar
6. 🥣 Bowl
7. 🖼️ Photo Frame

**Cuando completes FASE 2**: Dog Room estará 100% con assets reales.

### FASE 3 - Opcional (futuro):
- Picture frame para pared (Hub Room)
- Wallpaper custom background
- Assets para Tarot, Board Games, Personal Rooms

---

## 🎨 HERRAMIENTAS PARA GENERAR

**Gratis y buenos**:
1. **Leonardo.ai** - https://leonardo.ai
   - Modelo: "Leonardo Diffusion XL"
   - 150 tokens gratis/día

2. **Ideogram.ai** - https://ideogram.ai
   - Version 2.0
   - Muy bueno para estilos específicos

3. **Bing Image Creator** - https://www.bing.com/create
   - Usa DALL-E 3
   - Unlimited gratis

**Tip**: Genera 3-4 variaciones de cada asset y elige la mejor.

---

## ✨ RESULTADOS ESPERADOS

### Después de completar FASE 1:
- Hub Room con 3 assets reales (tree, fireplace, gift)
- Profundidad visual auténtica
- Estilo Rusty Lake consistente
- Sombras y lighting correctos
- Animaciones funcionando (tree lights, fire glow)

### Después de completar FASE 2:
- Dog Room completamente ilustrado
- White dog adorable estilo Rusty Lake
- Objetos interactivos con textura real
- Puzzle flow completo y funcional

---

## 🚨 TROUBLESHOOTING

### "La imagen se ve pixelada"
- Genera en resolución MÁS ALTA (1024px+)
- No uses "upscale" posterior, genera grande desde el inicio

### "El fondo no es transparente"
- Verifica que marcaste "Remove background" en la herramienta
- Si no: usa remove.bg después

### "El estilo no coincide con Rusty Lake"
- Añade al prompt: `similar to Rusty Lake Cube Escape game art`
- Usa negative prompt más agresivo: `cartoon, 3D, modern, simple, flat`

### "No sé cómo integrar la imagen"
- Lee la sección "Cómo integrarlo" arriba
- O avísame y yo lo hago por ti

---

## 📞 CUANDO TERMINES CADA FASE

**Después de FASE 1**: Avísame → revisamos juntos el Hub Room completo

**Después de FASE 2**: Avísame → revisamos Dog Room y planeamos siguientes rooms

**Si tienes dudas**: Solo dime en qué paso estás y te guío.

---

## 🎯 PRÓXIMA ACCIÓN INMEDIATA

**TÚ**:
1. Abre remove.bg
2. Sube christmas-tree.png
3. Descarga versión sin fondo
4. Reemplaza en `public/assets/hub/`

**YO**: Mientras tanto, preparo el código del Dog Room para recibir el white-dog.png

¿Listo para empezar? 🚀
