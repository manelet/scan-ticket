import React from 'react'
import { View, StyleSheet } from 'react-native'

import { useApp } from './context'
import ButtonScan from './ButtonScan'
import TextView from './Text'
import Camera from './Camera'
import Loading from './Loading'

export default function Render () {
  const { state, dispatch } = useApp()

  if (state.isLoading) {
    return <Loading />
  }

  if (state.showCamera) {
    return <Camera />
  }

  return (
    <View style={styles.container}>
      {state.text
        ? <TextView />
        : <ButtonScan />
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
})
