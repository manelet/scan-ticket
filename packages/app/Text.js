import React from 'react'
import { ScrollView, Text, Button } from 'react-native'

import { useApp } from './context'
import ButtonScan from './ButtonScan'

export default function TextView () {
  const { state, dispatch } = useApp()
  return (
    <ScrollView
      contentContainerStyle={{
        justifyContent: 'flex-start',
        borderWidth: 2,
        borderColor: 'red',
        marginTop: 50
      }}
    >
      <ButtonScan />
      <Text>{state.text}</Text>
      <ButtonScan />
    </ScrollView>    
  )
}
