import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Haptics from 'expo-haptics';

import { GameController } from '../../controllers/GameController';
import { CombatController } from '../../controllers/CombatController';
import { FinalizerController } from '../../controllers/FinalizerController';
import { AIController } from '../../controllers/AIController';
import Battlefield from '../../components/Battlefield';
import CommanderArea from '../../components/CommanderArea';
import HandArea from '../../components/HandArea';
import ImpulseMeter from '../../components/ImpulseMeter';
import GameLog from '../../components/GameLog';
import FinalizerModal from '../../components/FinalizerModal';
import { globalStyles } from '../styles/globalStyles';
import { theme } from '../styles/theme';

export default function GameScreen({ navigation }) {
  const [gameState, setGameState] = useState(null);
  const [selectedAttackerId, setSelectedAttackerId] = useState(null);
  const [showFinalizer, setShowFinalizer] = useState(false);

  const gameControllerRef = useRef(null);
  const combatControllerRef = useRef(null);
  const finalizerControllerRef = useRef(null);
  const aiControllerRef = useRef(null);

  if (!gameControllerRef.current) {
    gameControllerRef.current = new GameController();
    combatControllerRef.current = new CombatController(gameControllerRef.current);
    finalizerControllerRef.current = new FinalizerController(gameControllerRef.current);
    aiControllerRef.current = new AIController(
      gameControllerRef.current,
      combatControllerRef.current,
      finalizerControllerRef.current
    );
  }

  useEffect(() => {
    const gameController = gameControllerRef.current;
    gameController.initGame();
    const unsubscribe = gameController.subscribe((state) => {
      setGameState({ ...state });
      const finalizerCheck = finalizerControllerRef.current.checkAndTriggerFinalizer();
      setShowFinalizer(finalizerCheck.canUse && state.turn === 'player');
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!gameState || gameState.turn !== 'opponent' || gameState.winner) return;
    const timer = setTimeout(() => {
      gameState.phase = 'main';
      aiControllerRef.current.playTurn();
      gameControllerRef.current.beginNextTurn();
    }, 700);
    return () => clearTimeout(timer);
  }, [gameState?.turn, gameState?.winner]);

  if (!gameState) {
    return (
      <View style={[globalStyles.screen, styles.center]}>
        <Text style={styles.loading}>Preparando duelo...</Text>
      </View>
    );
  }

  const currentPlayer = gameState.currentPlayer();
  const opponent = gameState.opponentPlayer();
  const isPlayerTurn = gameState.turn === 'player';
  const canAttackDirectly = combatControllerRef.current.canAttackDirectly(opponent.field);

  const handlePlayCard = (card) => {
    const result = gameControllerRef.current.playCard(card.id);
    if (!result.success) {
      Alert.alert('Ação inválida', result.error);
    } else {
      Haptics.selectionAsync();
    }
  };

  const handleUnitPress = (unit, isFriendlyUnit) => {
    if (!isPlayerTurn || gameState.phase !== 'combat') return;

    if (isFriendlyUnit) {
      if (!unit.canAttack || unit.summoningSickness) return;
      setSelectedAttackerId(unit.id);
      return;
    }

    if (!selectedAttackerId) return;
    combatControllerRef.current.declareAttack(selectedAttackerId, unit.id, false);
    setSelectedAttackerId(null);
  };

  const handleDirectAttack = () => {
    if (!selectedAttackerId) return;
    const result = combatControllerRef.current.declareAttack(selectedAttackerId, null, true);
    if (!result.success) {
      Alert.alert('Ataque bloqueado', result.error);
    }
    setSelectedAttackerId(null);
  };

  const handleAdvancePhase = () => {
    if (!isPlayerTurn) return;

    if (gameState.phase === 'main') {
      gameControllerRef.current.moveToPhase('combat');
      return;
    }

    if (gameState.phase === 'combat') {
      gameControllerRef.current.endTurn();
      gameControllerRef.current.beginNextTurn();
    }
  };

  const handleFinalizer = () => {
    const result = finalizerControllerRef.current.useFinalizer();
    setShowFinalizer(false);
    if (result.success) {
      Alert.alert('Vitória', result.message, [{ text: 'Menu', onPress: () => navigation.goBack() }]);
    }
  };

  return (
    <View style={[globalStyles.screen, styles.container]}>
      <View style={styles.header}>
        <Text style={styles.turnLabel}>
          Turno {gameState.turnNumber} | {isPlayerTurn ? 'JOGADOR' : 'IA'} | {gameState.phase.toUpperCase()}
        </Text>
        <ImpulseMeter impulse={currentPlayer.impulse} maxImpulse={currentPlayer.maxImpulse} />
      </View>

      <View style={styles.section}>
        <CommanderArea commander={opponent.commander} label="OPONENTE" />
        <Battlefield
          units={opponent.field}
          onUnitPress={(unit) => handleUnitPress(unit, false)}
          selectedUnitId={selectedAttackerId}
        />
      </View>

      <View style={styles.section}>
        <CommanderArea commander={currentPlayer.commander} label="VOCÊ" />
        <Battlefield
          units={currentPlayer.field}
          onUnitPress={(unit) => handleUnitPress(unit, true)}
          selectedUnitId={selectedAttackerId}
        />
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.button} onPress={handleAdvancePhase}>
          <Text style={styles.buttonText}>
            {gameState.phase === 'main' ? 'IR PARA COMBATE' : 'ENCERRAR TURNO'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, !canAttackDirectly && styles.buttonDisabled]}
          onPress={handleDirectAttack}
          disabled={!selectedAttackerId || !canAttackDirectly}
        >
          <Text style={styles.buttonText}>ATAQUE DIRETO</Text>
        </TouchableOpacity>
      </View>

      <HandArea hand={currentPlayer.hand} onPlayCard={handlePlayCard} />
      <GameLog messages={gameState.log} />
      <FinalizerModal
        visible={showFinalizer}
        commander={currentPlayer.commander}
        onConfirm={handleFinalizer}
        onCancel={() => setShowFinalizer(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    gap: 10,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loading: {
    color: theme.primary,
    fontSize: 20,
    fontWeight: '800',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  turnLabel: {
    color: theme.text,
    fontWeight: '800',
    fontSize: 16,
  },
  section: {
    gap: 8,
    backgroundColor: theme.surfaceAlt,
    borderRadius: 18,
    padding: 10,
    borderWidth: 1,
    borderColor: theme.surfaceBorder,
  },
  controls: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
    backgroundColor: theme.secondary,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  buttonText: {
    color: theme.text,
    fontWeight: '800',
  },
});
