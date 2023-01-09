import { extendTheme, ThemeConfig } from '@chakra-ui/react'

const config: ThemeConfig ={
    initialColorMode: "dark",
    useSystemColorMode: false
}

export const theme = extendTheme({config},
    {
  colors: {
    transparent: 'transparent',
    black: '#000',
    white: '#fff',
    gray: {
      50: '#f7fafc',
      // ...
      900: '#171923',
    },
    brand:{
        100: '4FD1C5',
    },
    styles:{
        global:()=>({
            body: {
                bg: "whiteAplpha.300"
            }
        })
    }
    // ...
  },
})