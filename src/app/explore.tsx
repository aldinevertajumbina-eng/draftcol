import { Image, StyleSheet, Text, View } from 'react-native';

export default function ExploreScreen(){
  return(
    <View style={styles.container}>

      <Text style={styles.titulo}>
        Jugadores
      </Text>

      <Text style={styles.Mensaje}>
        Conoce nuevos talentos del fútbol colombiano
      </Text>


      <Image
        source={{
          uri:'https://i.ibb.co/7tG71dMg/18-DA9877-ADCB-4-E87-AB4-F-18072-A04-E40-D.jpg'
        }}
        style={styles.imagenJugador}
      />

      <Text style={styles.nombre}>
        Juan Pérez
      </Text>

      <Text style={styles.informacion}>
        Delantero - 19 años
      </Text>

      <Text style={styles.informacion}>
        Pasto, Nariño
      </Text>


      <Image
        source={{
          uri:'https://i.ibb.co/4ZV3H66f/Whats-App-Image-2026-08-31-at-12-33-30-PM.jpg'
        }}
        style={styles.imagenJugador}
      />

      <Text style={styles.nombre}>
        Carlos Gómez
      </Text>

      <Text style={styles.informacion}>
        Mediocampista - 18 años
      </Text>

      <Text style={styles.informacion}>
        Medellín, Antioquia
      </Text>

    </View>
  )
}


const styles = StyleSheet.create({

  container:{
    flex:1,
    alignItems:'center',
  },

  titulo:{
    fontSize:30,
    marginTop:40,
  },

  Mensaje:{
    fontSize:18,
    marginTop:10,
    marginBottom:20,
  },

  imagenJugador:{
    width:120,
    height:120,
    marginTop:20,
  },

  nombre:{
    fontSize:22,
    marginTop:10,
  },

  informacion:{
    fontSize:16,
    marginTop:5,
  },

});