import { CARD_TYPE_OPTIONS } from '../constants/cardTypes';

export function validateCard(card) {
  const errors = [];

  if (!card.name) errors.push('Nome obrigatório');
  if (!card.type || !CARD_TYPE_OPTIONS.includes(card.type)) errors.push('Tipo obrigatório');
  if (card.cost < 0 || card.cost > 10) errors.push('Custo 0-10');

  if (card.type === 'unit') {
    if (card.power < 0 || card.power > 10) errors.push('Poder 0-10');
    if (card.defense < 0 || card.defense > 10) errors.push('Defesa 0-10');
  }

  if (card.tags?.length > 4) errors.push('Máximo 4 tags');
  if (card.effect?.length > 500) errors.push('Efeito muito longo');

  return { valid: errors.length === 0, errors };
}
