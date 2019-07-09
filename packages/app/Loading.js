import React from 'react'
import { ActivityIndicator, Text, View } from 'react-native'

function Loading () {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, .6)'
      }}
    >
      <ActivityIndicator size='large' color='white' />
      <Text style={{ color: 'white' }}>
        Loading ...
      </Text>
    </View>    
  )
}

export default Loading
