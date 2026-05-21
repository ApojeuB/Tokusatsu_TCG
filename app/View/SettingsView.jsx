import { useMemo, useRef, useState } from "react";
import { PanResponder, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { ScreenShell } from "../Components/ScreenShell";
import { useAppSettings } from "../Context/AppSettingsContext";

function clamp(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function VolumeSlider({ label, helper, value, onChange }) {
  const [trackWidth, setTrackWidth] = useState(0);
  const trackLeftRef = useRef(0);
  const percent = clamp(value);

  const updateFromLocation = (locationX) => {
    if (!trackWidth) {
      return;
    }

    onChange(clamp((locationX / trackWidth) * 100));
  };

  const panResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (event) => {
      updateFromLocation(event.nativeEvent.locationX);
    },
    onPanResponderMove: (event) => {
      const pageX = event.nativeEvent.pageX;
      updateFromLocation(pageX - trackLeftRef.current);
    }
  }), [trackWidth]);

  return (
    <View style={styles.settingBlock}>
      <View style={styles.settingTopRow}>
        <View style={styles.settingCopy}>
          <Text style={styles.rowTitle}>{label}</Text>
          <Text style={styles.rowSubtitle}>{helper}</Text>
        </View>

        <View style={styles.valueBadge}>
          <Text style={styles.valueBadgeText}>{percent}%</Text>
        </View>
      </View>

      <View
        style={styles.sliderTouchArea}
        onLayout={(event) => {
          setTrackWidth(event.nativeEvent.layout.width);
          event.currentTarget?.measure?.((x, y, width, height, pageX) => {
            trackLeftRef.current = pageX;
          });
        }}
        {...panResponder.panHandlers}
      >
        <View style={styles.sliderTrack}>
          <View style={[styles.sliderFill, { width: `${percent}%` }]} />
          <View style={[styles.sliderThumb, { left: `${percent}%` }]} />
        </View>
        <View style={styles.sliderScale}>
          <Text style={styles.sliderScaleText}>0</Text>
          <Text style={styles.sliderScaleText}>50</Text>
          <Text style={styles.sliderScaleText}>100</Text>
        </View>
      </View>
    </View>
  );
}

function ToggleRow({ label, value, onToggle }) {
  return (
    <View style={styles.settingBlock}>
      <View style={styles.row}>
        <View style={styles.settingCopy}>
          <Text style={styles.rowTitle}>{label}</Text>
          <Text style={styles.rowSubtitle}>{value ? "Ativado" : "Desativado"}</Text>
        </View>

        <Pressable style={[styles.toggle, value && styles.toggleOn]} onPress={onToggle}>
          <View style={[styles.knob, value && styles.knobOn]} />
        </Pressable>
      </View>
    </View>
  );
}

export function SettingsView() {
  const {
    musicVolume,
    setMusicVolume,
    effectsVolume,
    setEffectsVolume,
    tipsEnabled,
    setTipsEnabled,
    menuMusicEnabled,
    setMenuMusicEnabled
  } = useAppSettings();

  return (
    <ScreenShell title="Configuracao" subtitle="Preferencias do jogo" showBackButton>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.panel}>
          <VolumeSlider
            label="Musica"
            helper="Volume da musica dos menus. Ela pausa automaticamente ao entrar em uma partida."
            value={musicVolume}
            onChange={setMusicVolume}
          />

          <View style={styles.divider} />

          <VolumeSlider
            label="Efeitos"
            helper="Volume de cliques, impactos e acoes da mesa."
            value={effectsVolume}
            onChange={setEffectsVolume}
          />

          <View style={styles.divider} />

          <ToggleRow
            label="Musica dos menus"
            value={menuMusicEnabled}
            onToggle={() => setMenuMusicEnabled((current) => !current)}
          />

          <View style={styles.divider} />

          <ToggleRow
            label="Dicas de jogabilidade"
            value={tipsEnabled}
            onToggle={() => setTipsEnabled((current) => !current)}
          />
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Resumo rapido</Text>
          <Text style={styles.infoText}>
            As preferencias ficam salvas no banco local e sao aplicadas durante a navegacao.
          </Text>

          <View style={styles.summaryRow}>
            <View style={styles.summaryPill}>
              <Text style={styles.summaryLabel}>Musica</Text>
              <Text style={styles.summaryValue}>{musicVolume}%</Text>
            </View>

            <View style={styles.summaryPill}>
              <Text style={styles.summaryLabel}>Efeitos</Text>
              <Text style={styles.summaryValue}>{effectsVolume}%</Text>
            </View>

            <View style={styles.summaryPill}>
              <Text style={styles.summaryLabel}>Menu</Text>
              <Text style={styles.summaryValue}>{menuMusicEnabled ? "On" : "Off"}</Text>
            </View>

            <View style={styles.summaryPill}>
              <Text style={styles.summaryLabel}>Dicas</Text>
              <Text style={styles.summaryValue}>{tipsEnabled ? "On" : "Off"}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 24
  },
  panel: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#f6d94f",
    backgroundColor: "rgba(6, 11, 18, 0.84)",
    overflow: "hidden"
  },
  settingBlock: {
    paddingHorizontal: 18,
    paddingVertical: 18
  },
  settingTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  settingCopy: {
    flex: 1
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12
  },
  rowTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700"
  },
  rowSubtitle: {
    color: "#b8c5d3",
    fontSize: 12,
    marginTop: 4,
    lineHeight: 18
  },
  valueBadge: {
    minWidth: 64,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(246, 217, 79, 0.55)",
    backgroundColor: "rgba(246, 217, 79, 0.12)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: "center"
  },
  valueBadgeText: {
    color: "#fff4b0",
    fontWeight: "900"
  },
  sliderTouchArea: {
    marginTop: 18,
    paddingVertical: 14
  },
  sliderTrack: {
    height: 12,
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.16)",
    overflow: "visible"
  },
  sliderFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#f6d94f"
  },
  sliderThumb: {
    position: "absolute",
    top: -9,
    width: 30,
    height: 30,
    marginLeft: -15,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: "#071018",
    backgroundColor: "#fff4b0",
    shadowColor: "#f6d94f",
    shadowOpacity: 0.5,
    shadowRadius: 12
  },
  sliderScale: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12
  },
  sliderScaleText: {
    color: "#9fb0c1",
    fontSize: 11,
    fontWeight: "700"
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.08)"
  },
  toggle: {
    width: 58,
    height: 32,
    borderRadius: 20,
    backgroundColor: "#374151",
    padding: 3
  },
  toggleOn: {
    backgroundColor: "#f6d94f"
  },
  knob: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#ffffff"
  },
  knobOn: {
    alignSelf: "flex-end"
  },
  infoCard: {
    marginTop: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#5cf2ff",
    backgroundColor: "rgba(4, 15, 23, 0.78)",
    padding: 18
  },
  infoTitle: {
    color: "#fff4b0",
    fontSize: 18,
    fontWeight: "800"
  },
  infoText: {
    color: "#d4dde7",
    marginTop: 8,
    lineHeight: 22
  },
  summaryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 16
  },
  summaryPill: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(246, 217, 79, 0.38)",
    backgroundColor: "rgba(3, 7, 16, 0.82)",
    paddingVertical: 10,
    paddingHorizontal: 14
  },
  summaryLabel: {
    color: "#c1cfdd",
    fontSize: 11,
    textTransform: "uppercase"
  },
  summaryValue: {
    color: "#fff4b0",
    fontSize: 16,
    fontWeight: "800",
    marginTop: 4
  }
});
