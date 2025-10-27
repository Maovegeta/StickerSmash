import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";


export default function app() {
    return(
        <View style ={styles.container}>
            <SafeAreaProvider>
                <SafeAreaView>
                <Pressable>
                    <Text style={styles.text}>Hola Mundo</Text>
                    <Text style={styles.text1}>Bienvenido</Text>
                </Pressable>
                </SafeAreaView>              
            </SafeAreaProvider>
                
            
        </View>
        
    );
    
}
  const styles = StyleSheet.create({
    text: {
        color: 'yellow',
        fontWeight: 'black',
        backgroundColor: 'gray',
        textAlign: 'center',
        alignContent: 'center',
        borderColor: 'red',
        textRendering: 'red',
        fontSize: 50
    },
    text1: {
        color: 'yellow',
        fontWeight: 'black',
    
        fontSize: 100
    },
    container:{
      alignContent: 'center',  
    }
  }
);

