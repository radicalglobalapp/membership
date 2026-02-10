import React from 'react';
import { StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';

export default function AppBar({ backAction, title, action }) {
  return (
    <Appbar.Header style={styles.header} elevated>
      {backAction}
      <Appbar.Content title={title} titleStyle={{ color: '#fff' }} />
      {action}
    </Appbar.Header>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#007AFF',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
});
