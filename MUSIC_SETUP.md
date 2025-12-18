# 🎵 Configuración de Música - Guía Rápida

## Estructura de Archivos de Audio

Cuando descargues las canciones de Taylor Swift mañana, colócalas en esta estructura:

```
public/
  audio/
    taylor/
      background.mp3        # Música ambiente del Taylor Room
      puzzle-complete.mp3   # Cuando completa el puzzle
      celebration.mp3       # Al revelar el número (opcional)

    hub/
      ambient.mp3           # Música del Hub Room (opcional)

    dog/
      ambient.mp3           # Música del Dog Room (opcional)

    photo/
      ambient.mp3           # Música del Photo Room (opcional)
```

## Cómo Descargar Canciones de Spotify Premium

### Opción 1: Spotify Downloader (Recomendado)
```bash
# Instala spotify-dl
pip install spotdl

# Descarga una canción
spotdl https://open.spotify.com/track/TRACK_ID

# O descarga una playlist completa
spotdl https://open.spotify.com/playlist/PLAYLIST_ID
```

### Opción 2: Grabación de Audio
- Usa software como Audacity
- Reproduce la canción en Spotify
- Graba el audio del sistema
- Exporta como MP3

### Opción 3: Comprar en iTunes/Amazon Music
- Compra las canciones
- Descarga los archivos MP3
- Copia a las carpetas correspondientes

## Canciones Sugeridas de Taylor Swift

Para el **Taylor Room**:
- **Background**: "invisible string" o "Lover" (suave, romántica)
- **Puzzle Complete**: "Love Story" o "Enchanted" (celebratoria)
- **Celebration**: "champagne problems" o fragmento de "All Too Well"

Para otros rooms:
- **Hub**: Versión instrumental navideña de alguna canción
- **Dog**: "Christmas Tree Farm" (canción navideña de Taylor!)
- **Photo**: "Fifteen" o "Long Live" (nostálgica)

## Implementación Técnica (Ya está lista)

El código ya está preparado para reproducir audio. Solo necesitas:

1. Crear las carpetas mencionadas arriba
2. Agregar los archivos MP3
3. El sistema automáticamente los reproducirá

## Formato Recomendado

- **Formato**: MP3 (320kbps para mejor calidad)
- **Volumen**: Normalizado (para que todas suenen al mismo nivel)
- **Duración**: Canciones completas o loops de 2-3 minutos

## Próximos Pasos (Mañana)

1. ✅ Descargar canciones de Taylor Swift
2. ✅ Crear carpetas en `/public/audio/`
3. ✅ Copiar MP3s a las carpetas correspondientes
4. ✅ Probar en el navegador

¡Todo estará listo para funcionar inmediatamente!
