import React from 'react';
import { FlatList } from 'react-native';
import Card from './Card';

export default function CardList({ cards, renderFooter }) {
  return (
    <FlatList
      data={cards}
      keyExtractor={(item) => item.id}
      numColumns={2}
      renderItem={({ item }) => <Card card={item} footer={renderFooter ? renderFooter(item) : null} />}
      contentContainerStyle={{ gap: 10, paddingBottom: 24 }}
      columnWrapperStyle={{ gap: 10 }}
    />
  );
}
