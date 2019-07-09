import React, { useState, useEffect } from 'react'
import { ActivityIndicator, Text, View, TouchableOpacity, Platform } from 'react-native'
import * as Permissions from 'expo-permissions'
import { Camera } from 'expo-camera'
import { Ionicons, EvilIcons } from '@expo/vector-icons';
// import * as ImageManipulator from 'expo-image-manipulator';

import { useApp } from './context'

export default function CameraComponent ({ setShow, setText }) {
  const { state, dispatch } = useApp()
  const [hasCameraPermission, setHasCameraPermission] = useState(null)
  const [type, setType] = useState(Camera.Constants.Type.back)
  let camera

  async function onPictureSaved ({ exif, ...photo}) {
    dispatch({ type: 'TOGGLE_LOADING' })

    const data = new FormData()
    const splitted = photo.uri.split('/')
    const name = splitted[splitted.length - 1].split('.')[0]

    data.append("photo", {
      name,
      type: 'jpg',
      uri: Platform.OS === "android" ? photo.uri : photo.uri.replace("file://", ""),
      exif: JSON.stringify(exif)
    })

    if (exif) {
      data.append('exif', JSON.stringify(exif))

      // if (exif.Orientation) {
      //   try {
      //     console.log('entro a manipular');
      //     const manipulated = await ImageManipulator.manipulateAsync(
      //       photo.uri.replace("file://", ""),
      //       {
      //         rotate: exif.Orientation
      //       },
      //       {
      //         compress: 1,
      //         format: ImageManipulator.SaveFormat.PNG
      //       }
      //     )
      //   } catch (err) {
      //     console.log('err', err);
      //     throw err
      //   }

      //   console.log('mani', manipulated);
      // }
    }
  
    fetch('http://192.168.1.33:3010/upload', {
      method: 'POST',
      body: data
    })
      .then(response => response.json())
      .then(response => {
        dispatch({ type: 'SET_TEXT', text: response.text })
        dispatch({ type: 'TOGGLE_CAMERA' })
      })
      .catch(err => {
        throw err
      })
      .finally(() => dispatch({ type: 'TOGGLE_LOADING' }))
  }

  const takePicture = () => {
    camera.takePictureAsync({ onPictureSaved, exif: true })
  }

  useEffect(() => {
    async function getStatus () {
      const { status } = await Permissions.askAsync (Permissions.CAMERA)
      setHasCameraPermission(status === 'granted')
    }
    getStatus()
  }, [])

  if (hasCameraPermission === null) {
    return <View />
  }

  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>
  }

  return (
    <View style={{ flex: 1 }}>
      <Camera
        style={{ flex: 1 }}
        type={type}
        ref={ref => camera = ref}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            flexDirection: 'row',
            height: 50,
            alignSelf: 'flex-start'
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              alignSelf: 'flex-start',
              alignItems: 'flex-end',
              marginTop: 50,
              // borderWidth: 2,
              // borderColor: 'blue'              
            }}
            onPress={() => dispatch({ type: 'TOGGLE_CAMERA' })}
          >
            <EvilIcons size={48} name='close' color='white' />
          </TouchableOpacity>
        </View>

        <View
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            flexDirection: 'row',
            // borderWidth: 2,
            // borderColor: 'green',
            alignSelf: 'flex-end'
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              alignSelf: 'flex-end',
              alignItems: 'center',
              // borderWidth: 2,
              // borderColor: 'red'
            }}
            onPress={takePicture}
          >
            <Text style={{
              fontSize: 18,
              marginBottom: 10,
              color: 'white',
              // borderWidth: 2,
              // borderColor: 'cyan'
            }}>
              <Ionicons name='ios-qr-scanner' color='white' size={64} />
            </Text>
          </TouchableOpacity>
        </View>     
      </Camera>
    </View>
  )
}
