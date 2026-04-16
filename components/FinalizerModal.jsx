import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../view/styles/theme';

export default function FinalizerModal({ visible, commander, onConfirm, onCancel }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>Finalizador disponível</Text>
          <Text style={styles.name}>{commander?.finalizerName}</Text>
          <Text style={styles.text}>
            O oponente está vulnerável. Ativar agora encerra a partida imediatamente.
          </Text>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.confirm} onPress={onConfirm}>
              <Text style={styles.confirmText}>ATIVAR</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancel} onPress={onCancel}>
              <Text style={styles.cancelText}>AGUARDAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: theme.surface,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: theme.primary,
  },
  title: {
    color: theme.primary,
    fontWeight: '800',
    fontSize: 20,
  },
  name: {
    color: theme.text,
    fontWeight: '700',
    marginTop: 8,
  },
  text: {
    color: theme.textDim,
    marginTop: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  confirm: {
    flex: 1,
    backgroundColor: theme.secondary,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancel: {
    flex: 1,
    backgroundColor: theme.surfaceAlt,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmText: {
    color: theme.text,
    fontWeight: '800',
  },
  cancelText: {
    color: theme.textDim,
    fontWeight: '700',
  },
});
