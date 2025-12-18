# 🎨 Background Textures - Wallpaper & Floor

Estos assets son **OPCIONALES** pero mejoran significativamente la calidad visual del juego.

---

## 1. Burgundy Wallpaper (Pared Roja)

**Archivo**: `public/assets/backgrounds/wallpaper-burgundy.png`
**Tamaño**: 1920x1080px (seamless/tileable)

### Prompt:

```
Vintage burgundy red wallpaper texture in Rusty Lake game art style,
dark red damask pattern, hand-painted Victorian wallpaper,
point-and-click adventure game background, rich burgundy color (#6B0F1A),
subtle ornate patterns, aged texture, slightly dark and mysterious atmosphere,
seamless tileable pattern, warm vintage tones, painted texture,
no objects, no furniture, just wall texture
```

### Negative Prompt:

```
modern, bright, simple, flat, solid color, photograph, 3D render,
wallpaper with objects, furniture, decorations, frames
```

### Detalles importantes:
- **Color base**: Burgundy oscuro (#6B0F1A similar a la referencia)
- **Seamless**: Debe poder repetirse sin costuras visibles
- **Textura sutil**: Patrón damasco pero no muy marcado
- **Estilo vintage**: Papel tapiz antiguo, no moderno
- Solo textura, sin objetos decorativos

### Cómo lo usaré:
```css
background-image: url('/assets/backgrounds/wallpaper-burgundy.png');
background-size: 800px 600px;
background-repeat: repeat;
```

---

## 2. Dark Wooden Floor (Piso de Madera)

**Archivo**: `public/assets/backgrounds/floor-wood.png`
**Tamaño**: 1920x400px (horizontal, seamless width)

### Prompt:

```
Dark wooden floor texture in Rusty Lake game art style, vintage dark brown
wood planks, hand-painted illustration, point-and-click adventure game
background, aged hardwood floor with visible grain, slightly worn texture,
warm dark brown tones, painted brush strokes, horizontal wood planks,
seamless tileable horizontally, mysterious vintage atmosphere,
no objects on floor
```

### Negative Prompt:

```
modern laminate, bright wood, new floor, shiny, polished, 3D render,
photograph, objects, furniture, rugs, decorations
```

### Detalles importantes:
- **Color**: Madera oscura (café/negro) similar a la referencia
- **Dirección**: Tablones horizontales
- **Seamless horizontal**: Debe poder repetirse a lo ancho sin costuras
- **Textura**: Grano de madera visible, desgaste vintage
- Solo piso, sin alfombras ni objetos

### Cómo lo usaré:
```css
background-image: url('/assets/backgrounds/floor-wood.png');
background-size: 100% auto;
background-position: bottom;
background-repeat: repeat-x;
```

---

## 3. Window with Snow (OPCIONAL - Decorativo)

**Archivo**: `public/assets/backgrounds/window-snow.png`
**Tamaño**: 400x500px (vertical)

### Prompt:

```
Vintage window with snow outside in Rusty Lake game art style,
hand-painted illustration, window frame with four panes, orange/golden
wooden frame, snowy winter night scene visible through glass,
point-and-click adventure game art, painted texture, warm interior light
reflecting on glass, snowflakes falling outside, dark blue night sky,
no background (transparent PNG except window), vintage mysterious atmosphere
```

### Negative Prompt:

```
modern window, bright daylight, summer, no snow, simple, minimalist,
3D render, photograph, indoor scene
```

### Detalles importantes:
- Marco **naranja/dorado** (como en la referencia)
- **4 paneles** de vidrio
- **Nieve cayendo** afuera visible
- Noche oscura con cielo azul profundo
- Reflejos de luz cálida en el vidrio
- PNG transparente (solo la ventana)

### Posición sugerida:
```typescript
// En HubRoom.tsx
<img
  src="/assets/backgrounds/window-snow.png"
  className="absolute right-[5%] top-[15%] w-[380px] h-[480px] z-5"
/>
```

---

## 📋 Checklist de Generación

**Prioridad ALTA** (mejora visual significativa):
- [ ] Burgundy Wallpaper → `public/assets/backgrounds/wallpaper-burgundy.png`
- [ ] Dark Wooden Floor → `public/assets/backgrounds/floor-wood.png`

**Prioridad BAJA** (decorativo, no crítico):
- [ ] Window with Snow → `public/assets/backgrounds/window-snow.png`

---

## 🎯 ¿Por qué son opcionales?

**Actualmente tenemos**:
- ✅ Color burgundy sólido CSS (funcional)
- ✅ Floor gradient CSS (funcional)

**Con estos assets**:
- 🎨 Textura realista estilo Rusty Lake
- 🎨 Profundidad y atmósfera mejoradas
- 🎨 100% matching con la imagen de referencia

---

## 💡 Tips para Mejores Resultados

### Wallpaper:
- Si no sale seamless, usa herramientas como Photoshop "Offset" o GIMP para hacerlo tileable
- Si el pattern es muy marcado, añade: `subtle pattern, low contrast`
- Si es muy oscuro, añade: `rich burgundy red, warm tones`

### Floor:
- Si no sale seamless horizontalmente, recorta y ajusta en editor de imágenes
- Si sale muy nuevo/brillante, añade: `aged, worn, vintage hardwood`
- Si las tablas no son horizontales, añade: `horizontal planks, boards running left to right`

### Window:
- Si sale sin nieve, añade: `heavy snowfall, winter storm, snowflakes`
- Si no tiene 4 paneles, añade: `4-pane window, cross-shaped mullions`

---

## 🔧 Cómo los Integraré

1. **Wallpaper**:
   - Reemplazaré `style={{ background: '#6B0F1A' }}`
   - Con `background-image` CSS
   - Patrón repetido seamless

2. **Floor**:
   - Añadiré nueva capa en bottom
   - Encima del floor shadow actual
   - Repetido horizontalmente

3. **Window** (si lo generas):
   - Posición: esquina superior derecha
   - Z-index: 5 (background layer)
   - No interactivo, solo visual

---

## 📞 Cuándo Generarlos

**Opción A - Ahora**:
- Genera los 2 prioritarios (wallpaper + floor)
- Tardas ~10-15 minutos total
- Mejora visual inmediata

**Opción B - Después**:
- Primero prueba el juego con los cambios actuales
- Si te gusta, generas estos después para polish final

**Mi recomendación**: Prueba primero cómo se ve ahora. Si quieres más "Rusty Lake feel", genera wallpaper y floor.

---

**El juego ya está completamente funcional sin estos assets. Son solo para máximo polish visual.**
