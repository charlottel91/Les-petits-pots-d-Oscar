import { StyleSheet, Text, TouchableOpacity } from 'react-native';

type ButtonLinkType = {
  title: string;
  handlePress: any;
};
export default function ButtonLink({ title, handlePress }: ButtonLinkType) {
  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: 600,
    alignSelf: 'center',
    padding: 15,
    textDecorationLine: 'underline',
    color: '#191134',
  },
});
