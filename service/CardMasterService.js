import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/config';
import { CARD_TYPES } from '../constants/cardTypes';
import { validateCard } from '../utils/validators';
import { randomId } from '../utils/random';
import { Card } from '../entities/Card';
import { Unit } from '../entities/Unit';
import { Action } from '../entities/Action';
import { Reaction } from '../entities/Reaction';
import { Item } from '../entities/Item';
import { Terrain } from '../entities/Terrain';
import { Commander } from '../entities/Commander';
import { CardTemplate } from '../entities/CardTemplate';

class CardMasterService {
  constructor() {
    this.cards = new Map();
    this.customCards = new Map();
    this.commanders = new Map();
    this.terrains = new Map();
    this.tags = [];
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    const riders = require('../data/master/cards/riders.json');
    const shocker = require('../data/master/cards/shocker.json');
    const sentai = require('../data/master/cards/sentai.json');
    const kaiju = require('../data/master/cards/kaiju.json');
    const ultraman = require('../data/master/cards/ultraman.json');
    const commanders = require('../data/master/commanders.json');
    const terrains = require('../data/master/terrains.json');
    const tags = require('../data/master/tags.json');

    [...riders, ...shocker, ...sentai, ...kaiju, ...ultraman].forEach((cardData) => {
      const card = this.createCardFromData(cardData);
      this.cards.set(card.id, card);
    });

    commanders.forEach((commanderData) => {
      const commander = new Commander(commanderData);
      this.commanders.set(commander.id, commander);
    });

    terrains.forEach((terrainData) => {
      const terrain = new Terrain(terrainData);
      this.terrains.set(terrain.id, terrain);
    });

    this.tags = tags;
    await this.loadCustomCards();
    this.initialized = true;
  }

  createCardFromData(data) {
    switch (data.type) {
      case CARD_TYPES.UNIT:
        return new Unit(data);
      case CARD_TYPES.ACTION:
        return new Action(data);
      case CARD_TYPES.REACTION:
        return new Reaction(data);
      case CARD_TYPES.ITEM:
        return new Item(data);
      case CARD_TYPES.TERRAIN:
        return new Terrain(data);
      default:
        return new Card(data);
    }
  }

  createNewCard(template = CardTemplate.getUnitTemplate()) {
    return this.createCardFromData({
      ...template,
      id: randomId('custom'),
      name: template.name || 'Nova Carta',
    });
  }

  async saveCard(card) {
    if (!String(card.id).startsWith('custom')) {
      throw new Error('Apenas cartas customizadas podem ser salvas diretamente.');
    }

    this.customCards.set(card.id, this.createCardFromData(card));
    await this.persistCustomCards();
    return card;
  }

  async updateCard(cardId, updates) {
    let card = this.getCardById(cardId);
    if (!card) throw new Error('Carta não encontrada.');

    if (!String(cardId).startsWith('custom')) {
      card = this.cloneCard(card);
      card.name = `${card.name} (Editada)`;
    }

    Object.assign(card, updates);
    await this.saveCard(card);
    return card;
  }

  async deleteCard(cardId) {
    if (!String(cardId).startsWith('custom')) {
      throw new Error('Só cartas customizadas podem ser deletadas.');
    }

    this.customCards.delete(cardId);
    await this.persistCustomCards();
  }

  getCardById(id) {
    return this.cards.get(id) || this.customCards.get(id) || null;
  }

  searchCards(filters = {}) {
    return this.getAllPlayableCards().filter((card) => {
      if (filters.name && !card.name.toLowerCase().includes(filters.name.toLowerCase())) return false;
      if (filters.type && card.type !== filters.type) return false;
      if (filters.tag && !card.tags?.includes(filters.tag)) return false;
      if (filters.series && card.series !== filters.series) return false;
      return true;
    });
  }

  getCardsBySeries(series) {
    return this.getAllPlayableCards().filter((card) => card.series === series);
  }

  getCardsByTag(tag) {
    return this.getAllPlayableCards().filter((card) => card.tags?.includes(tag));
  }

  async addToCollection(cardId, quantity = 1) {
    const collection = await this.getCollection();
    collection[cardId] = (collection[cardId] || 0) + quantity;
    await AsyncStorage.setItem(STORAGE_KEYS.COLLECTION, JSON.stringify(collection));
  }

  async getCollection() {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.COLLECTION);
    return raw ? JSON.parse(raw) : {};
  }

  exportCard(cardId) {
    const card = this.getCardById(cardId);
    return card ? JSON.stringify(card.toJSON ? card.toJSON() : card, null, 2) : null;
  }

  async importCard(cardJson) {
    const parsed = JSON.parse(cardJson);
    const imported = this.createCardFromData({ ...parsed, id: randomId('custom') });
    await this.saveCard(imported);
    return imported;
  }

  validateCard(card) {
    return validateCard(card);
  }

  getAllCards() {
    return {
      official: Array.from(this.cards.values()),
      custom: Array.from(this.customCards.values()),
    };
  }

  getAllPlayableCards() {
    return [...this.cards.values(), ...this.customCards.values()];
  }

  getAllCommanders() {
    return Array.from(this.commanders.values());
  }

  getCommanderById(id) {
    const commander = this.commanders.get(id);
    return commander ? new Commander(commander.toJSON()) : null;
  }

  cloneCard(card) {
    return this.createCardFromData({
      ...(card.toJSON ? card.toJSON() : card),
      id: randomId('custom'),
    });
  }

  cloneForGameplay(card) {
    return this.createCardFromData(card.toJSON ? card.toJSON() : card);
  }

  async loadCustomCards() {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.CUSTOM_CARDS);
    if (!raw) return;

    JSON.parse(raw).forEach((cardData) => {
      const card = this.createCardFromData(cardData);
      this.customCards.set(card.id, card);
    });
  }

  async persistCustomCards() {
    const payload = Array.from(this.customCards.values()).map((card) =>
      card.toJSON ? card.toJSON() : card
    );
    await AsyncStorage.setItem(STORAGE_KEYS.CUSTOM_CARDS, JSON.stringify(payload));
  }
}

export default new CardMasterService();
