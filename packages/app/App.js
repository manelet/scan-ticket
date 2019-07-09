import React, { useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native'

import Render from './Render'
import { Provider } from './context'

export default function App() {
  return (
    <Provider>
      <Render />
    </Provider>
  )
}
