# 🎨 AI Image Generation Prompts - Rusty Lake Christmas Style

## Herramientas Recomendadas

1. **Leonardo.ai** (GRATIS) - https://leonardo.ai
   - Modelo recomendado: "Leonardo Diffusion XL" o "Leonardo Vision XL"
   - Settings: Contrast Medium-High, Style: Illustrated

2. **Ideogram.ai** (GRATIS) - https://ideogram.ai
   - Version 2.0
   - Style: Design / Illustration

3. **Bing Image Creator** (GRATIS) - https://www.bing.com/create
   - Usa DALL-E 3
   - Muy bueno para estilos específicos

## 📐 Formato de Exportación

**IMPORTANTE**: Todos los assets deben ser:
- **Formato**: PNG con fondo transparente
- **Resolución**: Alta (mínimo 1024px en el lado más largo)
- **Orientación**: Según se indica abajo

---

## 🏠 HUB ROOM ASSETS

### 1. Christmas Tree
**Archivo**: `public/assets/hub/christmas-tree.png`
**Tamaño recomendado**: 800x1200px (vertical)

```
Prompt:
Christmas tree in Rusty Lake game art style, hand-painted illustration,
detailed green pine tree with red and gold ornaments, vintage point-and-click
adventure game aesthetic, slightly dark and mysterious atmosphere,
golden star on top, painted texture, no background, transparent PNG,
side view, warm Christmas colors, detailed brush strokes
```

**Negative prompt**:
```
cartoon, 3D, photorealistic, modern, bright, cheerful, simple, flat colors
```

---

### 2. Fireplace with White Mantle
**Archivo**: `public/assets/hub/fireplace.png`
**Tamaño recomendado**: 1000x900px (horizontal)

```
Prompt:
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

---

### 3. Wrapped Gift
**Archivo**: `public/assets/hub/gift.png`
**Tamaño recomendado**: 400x400px (cuadrado)

```
Prompt:
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

---

### 4. Picture Frame (optional - para la pared)
**Archivo**: `public/assets/hub/picture-frame.png`
**Tamaño recomendado**: 300x400px (vertical)

```
Prompt:
Vintage wooden picture frame in Rusty Lake style, dark brown ornate frame,
hand-painted illustration, point-and-click adventure game art,
slightly aged and mysterious, painted texture, no background, transparent PNG
```

---

## 🐕 DOG ROOM ASSETS

### 5. White Fluffy Dog (West Highland Terrier)
**Archivo**: `public/assets/dog/white-dog.png`
**Tamaño recomendado**: 600x600px (cuadrado)

```
Prompt:
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

**IMPORTANTE**: Asegúrate que el perro sea BLANCO con orejas marrones/tan como en tu foto de referencia.

---

### 6. Dog Food Jar
**Archivo**: `public/assets/dog/food-jar.png`
**Tamaño recomendado**: 350x500px (vertical)

```
Prompt:
Vintage glass jar with dog food in Rusty Lake game style, hand-painted
illustration, clear glass jar with purple lid, filled with dog kibble,
label saying "DOG FOOD", point-and-click adventure game art,
painted texture, slightly mysterious atmosphere, no background, transparent PNG
```

---

### 7. Dog Bowl
**Archivo**: `public/assets/dog/bowl.png`
**Tamaño recomendado**: 400x250px (horizontal)

```
Prompt:
Simple dog food bowl in Rusty Lake game art style, hand-painted illustration,
silver/gray metal bowl, vintage point-and-click game aesthetic,
painted texture, 3/4 top-down view, no background, transparent PNG
```

---

### 8. Wooden Photo Frame
**Archivo**: `public/assets/dog/photo-frame.png`
**Tamaño recomendado**: 400x500px (vertical)

```
Prompt:
Vintage wooden photo frame in Rusty Lake style, dark wood ornate frame,
slightly tilted, hand-painted illustration, point-and-click adventure game art,
aged and mysterious, painted texture, no background, transparent PNG
```

---

## 🎨 SHARED ASSETS (Opcionales)

### 9. Wallpaper Background (si quieres mejorar el actual)
**Archivo**: `public/assets/backgrounds/wallpaper.png`
**Tamaño recomendado**: 1920x1080px

```
Prompt:
Vintage damask wallpaper pattern in Rusty Lake style, golden brown ornate
Victorian wallpaper, hand-painted texture, point-and-click adventure game
background, warm golden tones, seamless tileable pattern, slightly aged,
mysterious atmosphere
```

---

## 📋 CHECKLIST DE GENERACIÓN

Una vez generes cada imagen:

- [ ] Christmas Tree (`hub/christmas-tree.png`)
- [ ] Fireplace (`hub/fireplace.png`)
- [ ] Wrapped Gift (`hub/gift.png`)
- [ ] White Dog (`dog/white-dog.png`) ← **PRIORIDAD MÁXIMA**
- [ ] Dog Food Jar (`dog/food-jar.png`)
- [ ] Dog Bowl (`dog/bowl.png`)
- [ ] Photo Frame (`dog/photo-frame.png`)
- [ ] Picture Frame - optional (`hub/picture-frame.png`)
- [ ] Wallpaper - optional (`backgrounds/wallpaper.png`)

---

## 🔧 CÓMO USAR LOS ASSETS GENERADOS

### Paso 1: Guarda las imágenes
Coloca cada imagen PNG en la carpeta correspondiente:
```
/public/assets/hub/...
/public/assets/dog/...
/public/assets/backgrounds/...
```

### Paso 2: El código ya está listo
El código que acabo de crear **ya está preparado** para usar imágenes reales.
Por ahora usa placeholders (cajas de colores con sombras y profundidad).

### Paso 3: Reemplaza los placeholders
Una vez tengas las imágenes, yo te ayudo a integrarlas en el código.

---

## 💡 TIPS PARA MEJORES RESULTADOS

1. **Consistencia de estilo**: Usa el mismo modelo/herramienta para todos los assets
2. **Prueba variaciones**: Genera 3-4 versiones de cada asset y elige la mejor
3. **Ajusta el prompt**: Si el resultado no es exacto, modifica el prompt:
   - Más oscuro → añade "dark moody lighting"
   - Más detallado → añade "highly detailed, intricate"
   - Más pintado → añade "thick brush strokes, oil painting texture"

4. **Rusty Lake reference**: Puedes añadir al final de cada prompt:
   ```
   , similar to Rusty Lake Cube Escape game art, dark whimsical style
   ```

---

## 🎯 PRIORIDAD DE GENERACIÓN

Si quieres empezar poco a poco, genera en este orden:

**FASE 1** (Para que se vea bien YA):
1. White Dog ← MÁS IMPORTANTE
2. Christmas Tree
3. Fireplace

**FASE 2**:
4. Gift
5. Dog Bowl
6. Food Jar

**FASE 3** (Opcional):
7. Photo Frames
8. Wallpaper custom

---

## 📞 SOPORTE

Una vez tengas las primeras 3 imágenes generadas:
1. Guárdalas en las carpetas correspondientes
2. Avísame
3. Yo actualizo el código para usarlas
4. ¡Verás la diferencia inmediatamente!

---

**¿Necesitas ayuda ajustando algún prompt? Solo dime qué quieres cambiar.**
