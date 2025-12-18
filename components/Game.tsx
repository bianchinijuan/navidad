"use client";

import { useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { initializeAudio, audioManager } from '@/lib/audioManager';
import SceneTransition from './SceneTransition';
import VolumeControl from './shared/VolumeControl';
import IntroScene from './scenes/IntroScene';
import FinalScene from './scenes/FinalScene';
import HubRoom from './scenes/HubRoomNew'; // Testing new coordinate system
import DogRoom from './scenes/DogRoomNew'; // Testing new coordinate system
import TaylorRoom from './scenes/TaylorRoomNew'; // Placeholder
import BedroomRoom from './scenes/PhotoRoomNew'; // Bedroom with Taylor game
import KitchenRoom from './scenes/KitchenRoom'; // Kitchen with gluten sorting game
import BrotherRoom from './scenes/BrotherRoom'; // Brother room with tapestry puzzle
import AirbagRoom from './scenes/AirbagRoom'; // Airbag room with rhythm game
import MotherRoom from './scenes/MotherRoom'; // Mother room with chakra matching game
import DoorRoom from './scenes/DoorRoom'; // Final door before victory

export default function Game() {
  const currentScene = useGameStore((state) => state.currentScene);
  const audioEnabled = useGameStore((state) => state.audioEnabled);

  // Initialize audio on mount
  useEffect(() => {
    initializeAudio();
  }, []);

  // Handle audio enable/disable
  useEffect(() => {
    audioManager.setEnabled(audioEnabled);
  }, [audioEnabled]);

  // Render current scene
  const renderScene = () => {
    switch (currentScene) {
      case 'intro':
        return <IntroScene />;
      case 'final':
        return <FinalScene />;
      case 'hub':
        return <HubRoom />;
      case 'dog':
        return <DogRoom />;
      case 'taylor':
        return <TaylorRoom />;
      case 'bedroom':
        return <BedroomRoom />;
      case 'kitchen':
        return <KitchenRoom />;
      case 'brother':
        return <BrotherRoom />;
      case 'airbag':
        return <AirbagRoom />;
      case 'mother':
        return <MotherRoom />;
      case 'door':
        return <DoorRoom />;
      case 'tarot':
        return <div className="flex items-center justify-center h-full text-white">Tarot Room (Coming Soon)</div>;
      case 'boardgames':
        return <div className="flex items-center justify-center h-full text-white">Board Games Room (Coming Soon)</div>;
      case 'personal':
        return <div className="flex items-center justify-center h-full text-white">Personal Room (Coming Soon)</div>;
      default:
        return <IntroScene />;
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      <SceneTransition sceneKey={currentScene} transitionType="fade" duration={0.4}>
        {renderScene()}
      </SceneTransition>

      {/* Volume Control - visible on all scenes */}
      <VolumeControl />
    </div>
  );
}
