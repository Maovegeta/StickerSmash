import Button from '@/components/Button';
import ImageViewer from '@/components/ImageViewer';
import * as ImagePicker from 'expo-image-picker';
import { Link } from 'expo-router';
import { useState } from 'react';
import { ImageSourcePropType, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CircleButton from './components/CircleButton';
import EmojiList from './components/EmojiList';
import EmojiPicker from './components/EmojiPicker';
import EmojiSticker from './components/EmojiSticker';
import IconButton from './components/IconButton';
import { useCounter } from "./context/CounterContext";


const PlaceholderImage = require('@/assets/images/background-image.png');

export default function Index() {
   const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
   const { contador, setContador } = useCounter();
   const [showAppOptions, setShowAppOptions] = useState<boolean>(false);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [pickedEmoji, setPickedEmoji] = useState<ImageSourcePropType | undefined>(undefined);


   const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result)
      setSelectedImage(result.assets[0].uri);
      setShowAppOptions(true);
    } else {
      alert('OPERACION CANCELADA');
    }
  };

   const onReset = () => {
    setShowAppOptions(false);
  };

  const onAddSticker = () => {
    setIsModalVisible(true);
  };

  const onModalClose = () => {
    setIsModalVisible(false);
  };

  const onSaveImageAsync = async () => {
    // we will implement this later
  };

  return (
    <GestureHandlerRootView style={styles.container}>
    <View style={styles.container}>
      <Text style={styles.text}></Text>
        <View style={styles.imageContainer}>
          <ImageViewer imgSource={PlaceholderImage} selectedImage={selectedImage} />
            {pickedEmoji && <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />}
        </View>
        <View style={{ padding: 100 }}>
          <Text>Espacio interno</Text>
        </View>
        <View style={styles.ContContainer}>
          <Text style={styles.text}>Contador: {contador}</Text>
        </View>
          {showAppOptions ? (
            <View style={styles.optionsContainer}>
            <View style={styles.optionsRow}>
            <IconButton icon="refresh" label="Reset" onPress={onReset} />
            <CircleButton onPress={onAddSticker} />
            <IconButton icon="save-alt" label="Save" onPress={onSaveImageAsync} />
          </View>
        </View>
      ) : (
        <View style={styles.footerContainer}>
          <Button theme="primary" label="SELECCIONE" onPress={pickImageAsync} />
          <Button label="Use this photo" onPress={() => setShowAppOptions(true)} />
        </View>
         )}
        <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
         <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
        </EmojiPicker>
        <Link href="./talleres/ejemodal" style={styles.button}>
          TALLERES
        </Link>
        <Link href="./motos/tema" style={styles.button}>
          TEMA
        </Link>
        <Link
        href={{
          pathname: '/details/[id]', 
          params: { id: 'Mao' },
        }}>
        Pagina con [ID]
        </Link>
        
    </View>
    </GestureHandlerRootView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4d4c4cff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  text: {
    color: '#e81e1eff',
    fontSize: 20,
    marginTop: 20
  },
  button: {
    fontSize: 15,
    textDecorationLine: 'underline',
    color: '#151db8ff',
  },
  imageContainer: {
    flex: 1,
      },
    image: {
    width: 220,
    height: 340,
    borderRadius: 18,
  },
  footerContainer: {
    flex: 1 ,
    alignItems: 'center',
  },
  ContContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
   optionsContainer: {
    position: 'absolute',
    bottom: 80,
  },
  optionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});


