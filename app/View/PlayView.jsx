import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { ScreenShell } from "../Components/ScreenShell";
import { createBattleState, endPlayerTurn, getCardImpact, playPlayerCard } from "../Controllers/PlayController";
import { useAppSettings } from "../Context/AppSettingsContext";
import { useDeckBuilder } from "../Context/DeckBuilderContext";

function StatPill({ label, value, accent = "#f6d94f" }) {
  return (
    <View style={[styles.statPill, { borderColor: accent }]}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, { color: accent }]}>{value}</Text>
    </View>
  );
}

function LastActionCard({ title, card, accent }) {
  return (
    <View style={[styles.lastActionCard, { borderColor: accent }]}>
      <Text style={styles.sectionLabel}>{title}</Text>
      <Text style={styles.lastActionName}>{card ? card.name : "Nenhuma carta resolvida"}</Text>
      <Text style={styles.lastActionMeta}>{card ? `Custo ${card.cost} | Impacto ${getCardImpact(card)}` : "A ultima acao aparecera aqui."}</Text>
    </View>
  );
}

function HandCard({ card, disabled, onPlay }) {
  return (
    <Pressable style={[styles.handCard, disabled && styles.handCardDisabled]} onPress={onPlay} disabled={disabled}>
      <View style={styles.cardHeader}>
        <Text style={styles.handCardName}>{card.name}</Text>
        <View style={styles.costBadge}>
          <Text style={styles.costBadgeText}>{card.cost}</Text>
        </View>
      </View>

      <Text style={styles.handCardMeta}>{card.type}</Text>
      <Text style={styles.handCardText} numberOfLines={3}>
        {card.effect}
      </Text>

      <View style={styles.cardFooter}>
        <Text style={styles.impactText}>Impacto {getCardImpact(card)}</Text>
        <Text style={styles.actionText}>{disabled ? "Sem energia" : "Jogar carta"}</Text>
      </View>
    </Pressable>
  );
}

export function PlayView() {
  const { musicVolume, effectsVolume, tipsEnabled } = useAppSettings();
  const { expandedSections, totals, isMainDeckReady } = useDeckBuilder();
  const [battle, setBattle] = useState(() => (isMainDeckReady ? createBattleState(expandedSections.main) : null));

  useEffect(() => {
    if (!isMainDeckReady) {
      setBattle(null);
      return;
    }

    setBattle(createBattleState(expandedSections.main));
  }, [expandedSections.main, isMainDeckReady]);

  if (!isMainDeckReady || !battle) {
    return (
      <ScreenShell title="Jogar" subtitle="Duelo de prototipo" showBackButton>
        <View style={styles.lockedWrap}>
          <View style={styles.lockedCard}>
            <Text style={styles.lockedTitle}>Main Deck incompleto</Text>
            <Text style={styles.lockedText}>
              A partida so inicia quando o Main Deck tiver exatamente 60 cartas. Monte o deck e volte para esta tela.
            </Text>

            <View style={styles.lockedStats}>
              <StatPill label="Main Deck" value={`${totals.main}/60`} accent="#f6d94f" />
              <StatPill label="Field Deck" value={totals.field} accent="#8f77ff" />
              <StatPill label="Comander" value={totals.commander} accent="#5cf2ff" />
            </View>

            <View style={styles.lockedActionRow}>
              <Pressable style={styles.primaryButton} onPress={() => router.push("/deckbuilder")}>
                <Text style={styles.primaryButtonText}>Abrir deckbuilder</Text>
              </Pressable>

              <Pressable style={styles.secondaryButton} onPress={() => router.push("/home")}>
                <Text style={styles.secondaryButtonText}>Voltar para home</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScreenShell>
    );
  }

  const handlePlayCard = (battleId) => {
    setBattle((current) => playPlayerCard(current, battleId));
  };

  const handleEndTurn = () => {
    setBattle((current) => endPlayerTurn(current));
  };

  const handleReset = () => {
    setBattle(createBattleState(expandedSections.main));
  };

  const resultLabel = battle.winner === "player"
    ? "Voce venceu"
    : battle.winner === "opponent"
      ? "Voce perdeu"
      : battle.winner === "draw"
        ? "Empate"
        : "Partida em andamento";

  return (
    <ScreenShell title="Jogar" subtitle="Duelo de prototipo" showBackButton>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.board}>
          <View style={styles.enemyZone}>
            <Text style={styles.zoneTitle}>Oponente</Text>

            <View style={styles.statRow}>
              <StatPill label="Vida" value={battle.opponentLife} accent="#ff8bd0" />
              <StatPill label="Energia" value={battle.opponentEnergy} accent="#f6d94f" />
              <StatPill label="Deck" value={battle.opponentDeck.length} accent="#d7e3f0" />
              <StatPill label="Mao" value={battle.opponentHand.length} accent="#d7e3f0" />
            </View>

            <LastActionCard title="Ultima jogada inimiga" card={battle.opponentLastCard} accent="#ff61b8" />
          </View>

          <View style={styles.centerPanel}>
            <Text style={styles.energy}>Turno {battle.turnNumber}</Text>
            <Text style={styles.turn}>{battle.status === "active" ? battle.phaseLabel : resultLabel}</Text>
            <Text style={styles.helper}>
              O duelo usa seu Main Deck real de 60 cartas. Enquanto nao houver sistema de tags, as cartas causam impacto direto.
            </Text>

            <View style={styles.audioRow}>
              <Text style={styles.audioText}>Musica {musicVolume}%</Text>
              <Text style={styles.audioDot}>|</Text>
              <Text style={styles.audioText}>Efeitos {effectsVolume}%</Text>
            </View>

            <View style={styles.actionRow}>
              <Pressable style={[styles.primaryButton, battle.status !== "active" && styles.buttonDisabled]} onPress={handleEndTurn} disabled={battle.status !== "active"}>
                <Text style={styles.primaryButtonText}>Encerrar turno</Text>
              </Pressable>

              <Pressable style={styles.secondaryButton} onPress={handleReset}>
                <Text style={styles.secondaryButtonText}>Reiniciar</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.playerZone}>
            <Text style={styles.zoneTitle}>Voce</Text>

            <View style={styles.statRow}>
              <StatPill label="Vida" value={battle.playerLife} accent="#8ff8ff" />
              <StatPill label="Energia" value={battle.playerEnergy} accent="#f6d94f" />
              <StatPill label="Deck" value={battle.playerDeck.length} accent="#d7e3f0" />
              <StatPill label="Mao" value={battle.playerHand.length} accent="#d7e3f0" />
            </View>

            <LastActionCard title="Sua ultima jogada" card={battle.playerLastCard} accent="#5cf2ff" />
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Sua mao</Text>
          <Text style={styles.sectionText}>
            Toque em uma carta para gastar energia e causar impacto direto no oponente.
          </Text>

          {battle.playerHand.length ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.handRow}>
              {battle.playerHand.map((card) => (
                <HandCard
                  key={card.battleId}
                  card={card}
                  disabled={battle.status !== "active" || card.cost > battle.playerEnergy}
                  onPlay={() => handlePlayCard(card.battleId)}
                />
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>Sua mao esta vazia. Encerre o turno para comprar mais.</Text>
            </View>
          )}
        </View>

        {tipsEnabled ? (
          <View style={styles.tipCard}>
            <Text style={styles.sectionTitle}>Dica rapida</Text>
            <Text style={styles.tipText}>
              O bloqueio de inicio agora depende do Main Deck com 60 cartas. Field e Comander ficam livres para a montagem.
            </Text>
          </View>
        ) : null}

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Historico da batalha</Text>
          <View style={styles.logList}>
            {battle.battleLog.map((entry, index) => (
              <View key={`${index}-${entry}`} style={styles.logItem}>
                <Text style={styles.logText}>{entry}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 24,
    gap: 16
  },
  lockedWrap: {
    flex: 1,
    justifyContent: "center"
  },
  lockedCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#f6d94f",
    backgroundColor: "rgba(7, 12, 21, 0.84)",
    padding: 20
  },
  lockedTitle: {
    color: "#fff4b0",
    fontSize: 24,
    fontWeight: "900"
  },
  lockedText: {
    color: "#d4dde7",
    marginTop: 10,
    lineHeight: 22
  },
  lockedStats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 18
  },
  lockedActionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 20
  },
  board: {
    gap: 16
  },
  enemyZone: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#ff61b8",
    backgroundColor: "rgba(29, 7, 25, 0.68)",
    padding: 16,
    gap: 14
  },
  playerZone: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#5cf2ff",
    backgroundColor: "rgba(4, 15, 23, 0.74)",
    padding: 16,
    gap: 14
  },
  centerPanel: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#f6d94f",
    backgroundColor: "rgba(7, 12, 21, 0.82)",
    padding: 18,
    alignItems: "center"
  },
  zoneTitle: {
    color: "#fff4b0",
    fontWeight: "800",
    fontSize: 18
  },
  statRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  statPill: {
    minWidth: 72,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    paddingVertical: 10,
    paddingHorizontal: 12
  },
  statLabel: {
    color: "#b5c0cd",
    fontSize: 11,
    textTransform: "uppercase"
  },
  statValue: {
    fontSize: 20,
    fontWeight: "900",
    marginTop: 4
  },
  lastActionCard: {
    borderRadius: 18,
    borderWidth: 1,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    padding: 14
  },
  sectionLabel: {
    color: "#c6d4e1",
    fontSize: 11,
    textTransform: "uppercase"
  },
  lastActionName: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
    marginTop: 8
  },
  lastActionMeta: {
    color: "#c6d4e1",
    marginTop: 6,
    lineHeight: 20
  },
  energy: {
    color: "#fff4b0",
    fontWeight: "900",
    fontSize: 28
  },
  turn: {
    color: "#c4d2df",
    marginTop: 6,
    fontSize: 16,
    fontWeight: "700"
  },
  helper: {
    color: "#9eb2c6",
    marginTop: 10,
    textAlign: "center",
    fontSize: 12,
    lineHeight: 18
  },
  audioRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 14
  },
  audioText: {
    color: "#d7e3f0",
    fontSize: 12
  },
  audioDot: {
    color: "#f6d94f",
    fontSize: 14
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16
  },
  primaryButton: {
    borderRadius: 16,
    backgroundColor: "#f6d94f",
    paddingVertical: 12,
    paddingHorizontal: 16
  },
  primaryButtonText: {
    color: "#071018",
    fontWeight: "900"
  },
  secondaryButton: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#5cf2ff",
    backgroundColor: "rgba(4, 15, 23, 0.78)",
    paddingVertical: 12,
    paddingHorizontal: 16
  },
  secondaryButtonText: {
    color: "#dffbff",
    fontWeight: "800"
  },
  buttonDisabled: {
    opacity: 0.45
  },
  sectionCard: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(246, 217, 79, 0.38)",
    backgroundColor: "rgba(6, 11, 18, 0.84)",
    padding: 16
  },
  sectionTitle: {
    color: "#fff4b0",
    fontSize: 18,
    fontWeight: "800"
  },
  sectionText: {
    color: "#cfdae7",
    marginTop: 8,
    lineHeight: 20
  },
  handRow: {
    gap: 12,
    paddingTop: 16,
    paddingRight: 4
  },
  handCard: {
    width: 220,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#5cf2ff",
    backgroundColor: "rgba(4, 15, 23, 0.82)",
    padding: 14
  },
  handCardDisabled: {
    opacity: 0.5
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12
  },
  handCardName: {
    flex: 1,
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800"
  },
  costBadge: {
    minWidth: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#f6d94f",
    alignItems: "center",
    justifyContent: "center"
  },
  costBadgeText: {
    color: "#071018",
    fontWeight: "900"
  },
  handCardMeta: {
    color: "#8ff8ff",
    marginTop: 10,
    textTransform: "uppercase",
    fontSize: 12,
    letterSpacing: 0.6
  },
  handCardText: {
    color: "#cfdae7",
    marginTop: 10,
    lineHeight: 20,
    minHeight: 60
  },
  cardFooter: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12
  },
  impactText: {
    color: "#fff4b0",
    fontWeight: "800"
  },
  actionText: {
    color: "#dffbff",
    fontWeight: "700"
  },
  emptyState: {
    marginTop: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    backgroundColor: "rgba(255,255,255,0.03)",
    padding: 16
  },
  emptyStateText: {
    color: "#d4dde7",
    lineHeight: 20
  },
  tipCard: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#5cf2ff",
    backgroundColor: "rgba(4, 15, 23, 0.78)",
    padding: 16
  },
  tipText: {
    color: "#d7e3f0",
    marginTop: 8,
    lineHeight: 22
  },
  logList: {
    gap: 10,
    marginTop: 14
  },
  logItem: {
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.04)",
    paddingVertical: 12,
    paddingHorizontal: 14
  },
  logText: {
    color: "#dbe7f2",
    lineHeight: 20
  }
});
