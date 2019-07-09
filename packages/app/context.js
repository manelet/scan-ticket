import React, { createContext, useContext, useReducer } from 'react'

const initialState = {
  showCamera: false,
  isLoading: false,
  text: null
}

const AppContext = createContext(initialState)

function reducer (state, action) {
  switch (action.type) {
    case 'TOGGLE_CAMERA':
      return { ...state, showCamera: !state.showCamera }
    case 'TOGGLE_LOADING':
      return { ...state, isLoading: !state.isLoading }
    case 'SET_TEXT':
      return { ...state, text: action.text }
  }
}

export function Provider ({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp () {
  const ctx = useContext(AppContext);
  return ctx
}