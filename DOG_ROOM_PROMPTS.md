# 🐕 Dog Room Assets - Prompts Completos

## Assets Faltantes para Dog Room

Ya tienes el **White Dog** ✅. Faltan estos 3 assets:

---

## 1. Dog Food Jar (Frasco de Comida)

**Archivo**: `public/assets/dog/food-jar.png`
**Tamaño recomendado**: 350x500px (vertical)

### Prompt:

```
Vintage glass jar with dog food in Rusty Lake game art style, hand-painted
illustration, clear glass jar with purple or brown lid, filled with brown dog
kibble visible through glass, small label saying "DOG FOOD", point-and-click
adventure game aesthetic, painted texture, slightly mysterious atmosphere,
detailed glass reflections, vintage illustration style, no background,
transparent PNG, front view, warm lighting
```

### Negative Prompt:

```
modern, 3D render, photorealistic, cartoon, bright colors, simple, flat,
minimalist, digital art
```

### Detalles importantes:
- El frasco debe ser de **vidrio transparente** (se ve la comida adentro)
- Tapa de color oscuro (morado o café)
- Pequeña etiqueta "DOG FOOD" pintada a mano
- Reflejos y brillo en el vidrio para dar realismo
- Estilo vintage, no moderno

---

## 2. Dog Bowl (Plato de Comida)

**Archivo**: `public/assets/dog/bowl.png`
**Tamaño recomendado**: 400x250px (horizontal, vista 3/4)

### Prompt:

```
Simple metal dog food bowl in Rusty Lake game art style, hand-painted
illustration, silver/gray stainless steel bowl, vintage point-and-click
adventure game aesthetic, painted brush strokes, slightly worn metal texture,
3/4 top-down view angle, subtle reflections on metal surface, no background,
transparent PNG, warm muted colors
```

### Negative Prompt:

```
modern, shiny, 3D render, photorealistic, cartoon, bright, simple, plastic,
colorful, flat colors
```

### Detalles importantes:
- Plato **metálico plateado/gris** (no colorido)
- Vista desde **arriba en ángulo 3/4** (no completamente de lado)
- Textura de metal levemente desgastado (vintage)
- Sombra interior para dar profundidad
- Debe verse vacío inicialmente

---

## 3. Wooden Photo Frame (Marco de Foto de Madera)

**Archivo**: `public/assets/dog/photo-frame.png`
**Tamaño recomendado**: 400x500px (vertical)

### Prompt:

```
Vintage wooden photo frame in Rusty Lake game art style, dark brown ornate
wooden frame with decorative corners, hand-painted illustration, point-and-click
adventure game art, aged wood texture, slightly tilted angle, mysterious
atmosphere, detailed carved wood patterns, empty frame interior (just dark or
blurred background inside), no photograph visible, painted texture, no background,
transparent PNG, warm antique colors
```

### Negative Prompt:

```
modern, simple, minimalist, 3D render, photorealistic, bright, new, polished,
photograph inside, picture inside
```

### Detalles importantes:
- Marco de **madera oscura** (café/negro)
- Detalles **ornamentales** en las esquinas
- **SIN foto adentro** (el interior debe ser oscuro o borroso)
- Levemente inclinado (como colgado en la pared)
- Textura de madera envejecida
- Este marco revelará la foto **después** de alimentar al perro

---

## 🎨 Configuración Recomendada

### En Leonardo.ai / Ideogram / Bing:
- **Modelo**: Leonardo Diffusion XL / DALL-E 3
- **Aspect Ratio**:
  - Food Jar: 2:3 (vertical)
  - Bowl: 16:10 (horizontal ancho)
  - Photo Frame: 4:5 (vertical)
- **Style**: Illustrated / Painted
- **Quality**: High (1024px mínimo)
- **Background**: Transparent / Remove background
- **Lighting**: Warm, soft

---

## 📋 Checklist de Generación

- [ ] **Food Jar** → `public/assets/dog/food-jar.png`
- [ ] **Bowl** → `public/assets/dog/bowl.png`
- [ ] **Photo Frame** → `public/assets/dog/photo-frame.png`

---

## 🔧 Cómo los integraré después

Una vez generes estos 3 assets:

1. **Guárdalos** en `public/assets/dog/` con los nombres exactos arriba
2. **Avísame** cuando estén listos
3. Yo actualizo el código de `DogRoom.tsx` para integrarlos
4. Los posiciono correctamente en la escena
5. Las interacciones ya funcionan (abrir jar → poner comida en bowl → alimentar perro → revelar foto)

---

## 💡 Tips para Mejores Resultados

### Food Jar:
- Si el resultado es muy moderno, añade: `vintage apothecary jar style`
- Si el vidrio no se ve transparente, añade: `clear transparent glass with visible contents`

### Bowl:
- Si sale muy brillante/nuevo, añade: `aged, slightly tarnished metal`
- Si está muy decorado, añade: `simple utilitarian design`

### Photo Frame:
- **MUY IMPORTANTE**: Si sale con foto adentro, añade al negative prompt: `photograph, picture, portrait, person, face`
- Si es muy simple, añade: `ornate Victorian frame, decorative carved corners`

---

## 🎯 Orden de Generación Recomendado

1. **Food Jar** (más importante - inicia la interacción)
2. **Bowl** (segundo paso de la interacción)
3. **Photo Frame** (recompensa final)

O genera los 3 a la vez si prefieres ver todo completo de una vez.

---

## 📞 Cuando Termines

Avísame cuando tengas los 3 PNG y te doy los números de línea exactos para integrarlos, o lo hago yo directamente si me das acceso a las imágenes.

**Mientras tanto**, muéstrame la imagen de referencia para ajustar las posiciones de los assets del Hub Room.
