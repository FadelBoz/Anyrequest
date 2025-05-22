import React from 'react';
import { View, Text, Button } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:"green" }}>
      <Text style={{color:"yellow"}}>Bienvenue sur l’application de sondage</Text>
      <Button
      color="orange"
        title="Accéder au formulaire "
        onPress={() => navigation.navigate('Formulaire')}
      />
    </View>
  );
}
