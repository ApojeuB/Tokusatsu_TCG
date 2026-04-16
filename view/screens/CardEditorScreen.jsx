import React, { useMemo, useState } from 'react';
import { View, TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import CardEditor from '../../components/CardEditor';
import CardMasterService from '../../service/CardMasterService';
import { globalStyles } from '../styles/globalStyles';
import { theme } from '../styles/theme';

export default function CardEditorScreen({ route, navigation }) {
  const [card, setCard] = useState(route.params?.card ?? CardMasterService.createNewCard());
  const validation = useMemo(() => CardMasterService.validateCard(card), [card]);

  const handleSave = async () => {
    if (!validation.valid) {
      Alert.alert('Carta inválida', validation.errors.join('\n'));
      return;
    }

    const payload = { ...card };
    if (!String(payload.id).startsWith('custom')) {
      payload.id = `custom_${Date.now()}`;
    }
    await CardMasterService.saveCard(payload);
    navigation.goBack();
  };

  return (
    <View style={[globalStyles.screen, styles.container]}>
      <CardEditor card={card} setCard={setCard} />
      {!validation.valid && <Text style={styles.error}>{validation.errors.join(' | ')}</Text>}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>SALVAR CARTA</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 14,
    gap: 14,
  },
  error: {
    color: theme.secondary,
    fontWeight: '700',
  },
  saveButton: {
    backgroundColor: theme.primary,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  saveText: {
    color: '#251d00',
    fontWeight: '900',
  },
});
