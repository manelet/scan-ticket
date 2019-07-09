import React from 'react'
import { Button, StyleSheet } from 'react-native'

import { useApp } from './context'

export default function ButtonScan () {
  const { state, dispatch } = useApp()

  return (
    <Button
      buttonStyle={styles.button}
      style={styles.button}
      onPress={() => {
        dispatch({ type: 'TOGGLE_CAMERA' })
        dispatch({ type: 'SET_TEXT', text: null })
      }}
      title='Scan'
      color='magenta'
    />     
  )
}

const styles = StyleSheet.create({
  button: {
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: '#000'
  }
})
