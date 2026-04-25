import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useEffect } from 'react';
import { useBabyData, BabyData } from '@/hooks/useBabyData';
import Button from '@/components/ui/Button';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Image } from 'expo-image';

type FormData = {
  size: string;
  weight: string;
};

export default function HomeScreen() {
  const { data, loading, save } = useBabyData();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  useEffect(() => {
    if (data) {
      reset({
        size: data.size.toString(),
        weight: data.weight.toString(),
      });
    }
  }, [data, reset]);

  const onSubmit = async (values: FormData) => {
    const parsed: BabyData = {
      size: parseFloat(values.size.replace(',', '.')),
      weight: parseFloat(values.weight.replace(',', '.')),
    };

    if (isNaN(parsed.size) || isNaN(parsed.weight)) {
      Alert.alert('Erreur', 'Veuillez entrer des valeurs valides.');
      return;
    }

    try {
      await save(parsed);
      Alert.alert('Succès', 'Données enregistrées !');
    } catch {
      Alert.alert('Erreur', "Impossible d'enregistrer les données.");
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size='large' color='#910791' />
      </View>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Image
        source={require('@/assets/images/baby.png')}
        style={styles.image}
      />
      <ThemedText type='title' style={styles.title}>
        Mon bébé
      </ThemedText>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Taille (cm)</Text>
        <Controller
          control={control}
          name='size'
          rules={{
            required: 'Taille requise',
            pattern: {
              value: /^\d+([.,]\d{0,3})?$/,
              message: 'Valeur invalide',
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.size && styles.inputError]}
              placeholder='Ex: 70.5'
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType='decimal-pad'
            />
          )}
        />
        {errors.size && <Text style={styles.error}>{errors.size.message}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Poids (kg)</Text>
        <Controller
          control={control}
          name='weight'
          rules={{
            required: 'Poids requis',
            pattern: {
              value: /^\d+([.,]\d{0,3})?$/,
              message: 'Valeur invalide',
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.weight && styles.inputError]}
              placeholder='Ex: 8.250'
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType='decimal-pad'
            />
          )}
        />
        {errors.weight && (
          <Text style={styles.error}>{errors.weight.message}</Text>
        )}
      </View>

      <View style={styles.button}>
        <Button
          title={
            isSubmitting
              ? 'Enregistrement...'
              : data
                ? 'Mettre à jour'
                : 'Enregistrer'
          }
          handlePress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 24,
  },
  image: {
    height: 200,
    width: 200,
    marginHorizontal: 'auto',
    marginTop: 20,
    marginBottom: 40,
  },
  title: {
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: '#555',
  },
  input: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#e53935',
  },
  error: {
    color: '#e53935',
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    marginTop: 8,
  },
});
