import { StyleSheet, Text, TouchableOpacity } from 'react-native';

type ButtonType = {
  title: string;
  handlePress: any;
  disabled: boolean;
};

export default function Button({ title, handlePress, disabled }: ButtonType) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      disabled={disabled}
    >
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    elevation: 8,
    backgroundColor: '#910791',
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 600,
    alignSelf: 'center',
    padding: 15,
  },
});
