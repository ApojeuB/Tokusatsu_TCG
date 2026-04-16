import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import CardList from '../../components/CardList';
import CardMasterService from '../../service/CardMasterService';
import { CARD_TYPE_OPTIONS } from '../../constants/cardTypes';
import { TAGS } from '../../constants/tagsList';
import { globalStyles } from '../styles/globalStyles';
import { theme } from '../styles/theme';

export default function CardMasterScreen({ navigation }) {
  const [cards, setCards] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  const loadCards = async () => {
    await CardMasterService.initialize();
    const allCards = CardMasterService.getAllCards();
    setCards([...allCards.official, ...allCards.custom]);
  };

  useEffect(() => {
    loadCards();
  }, []);

  const filteredCards = useMemo(
    () =>
      cards.filter((card) => {
        if (search && !card.name.toLowerCase().includes(search.toLowerCase())) return false;
        if (selectedType && card.type !== selectedType) return false;
        if (selectedTag && !card.tags?.includes(selectedTag)) return false;
        return true;
      }),
    [cards, search, selectedType, selectedTag]
  );

  const handleNewCard = () => {
    const newCard = CardMasterService.createNewCard();
    navigation.navigate('CardEditor', { card: newCard.toJSON ? newCard.toJSON() : newCard });
  };

  const handleExport = (cardId) => {
    const exported = CardMasterService.exportCard(cardId);
    Alert.alert('JSON da carta', exported ?? 'Carta não encontrada.');
  };

  return (
    <View style={[globalStyles.screen, styles.container]}>
      <View style={styles.header}>
        <Text style={globalStyles.title}>Mestre de Cartas</Text>
        <TouchableOpacity style={styles.newCardButton} onPress={handleNewCard}>
          <Text style={styles.newCardText}>NOVA CARTA</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.search}
        placeholder="Buscar por nome"
        placeholderTextColor={theme.textDim}
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.filters}>
        {['', ...CARD_TYPE_OPTIONS].map((type) => (
          <TouchableOpacity
            key={type || 'all'}
            style={[styles.filterChip, selectedType === type && styles.filterChipActive]}
            onPress={() => setSelectedType(type)}
          >
            <Text style={styles.filterText}>{type || 'TODOS'}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.filters}>
        {['', ...TAGS.slice(0, 9)].map((tag) => (
          <TouchableOpacity
            key={tag || 'all-tags'}
            style={[styles.filterChip, selectedTag === tag && styles.filterChipActive]}
            onPress={() => setSelectedTag(tag)}
          >
            <Text style={styles.filterText}>{tag || 'TODAS TAGS'}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <CardList
        cards={filteredCards}
        renderFooter={(card) => (
          <View style={styles.cardActions}>
            <TouchableOpacity onPress={() => navigation.navigate('CardEditor', { card: card.toJSON ? card.toJSON() : card })}>
              <Text style={styles.actionText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleExport(card.id)}>
              <Text style={styles.actionText}>Exportar</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  newCardButton: {
    backgroundColor: theme.tertiary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  newCardText: {
    color: '#152019',
    fontWeight: '800',
  },
  search: {
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.surfaceBorder,
    borderRadius: 12,
    color: theme.text,
    padding: 10,
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.surfaceBorder,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  filterChipActive: {
    borderColor: theme.primary,
  },
  filterText: {
    color: theme.text,
    fontSize: 11,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionText: {
    color: theme.primary,
    fontSize: 11,
    fontWeight: '700',
  },
});
