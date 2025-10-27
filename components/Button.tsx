import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Pressable, StyleSheet, Text, View } from 'react-native';


type Props = {
  label: string;
  theme?: 'primary';
  onPress?: () => void;
};

export default function Button({ label, theme, onPress }: Props) {
   if (theme === 'primary') {
  return (
      <View
        style={[
          styles.buttonContainer,
          { borderWidth: 2, borderColor: '#5e5e5eff', borderRadius: 5 },
        ]}>
        <Pressable
          style={[styles.button, { backgroundColor: '#c64040ff' }]}
          onPress={onPress}>
          <FontAwesome name="star" size={22} color="#2f25baff" style={styles.buttonIcon} />
          <Text style={[styles.buttonLabel, { color: '#171717ff' }]}>{label}</Text>
        </Pressable>
      </View>
    );
  }
  return(
    <View style={styles.buttonContainer}>
      <Pressable style={styles.button} onPress={() => alert('You pressed a button.')}>
        <Text style={styles.buttonLabel}>{label}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 220,
    height: 50,
    marginHorizontal: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  button: {
    borderRadius: 10,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonLabel: {
    color: '#e81717ff',
    fontSize: 16,
  },
    buttonIcon: {
    paddingRight: 5,
  },
});