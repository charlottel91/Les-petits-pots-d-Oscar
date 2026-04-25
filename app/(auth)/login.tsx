import { Text, TextInput, Alert, StyleSheet, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import { Redirect } from 'expo-router';
import Button from '@/components/ui/Button';
import ButtonLink from '@/components/ui/ButtonLink';

type FormData = {
  email: string;
  password: string;
};

type LoginScreenType = {
  handlePressForm: () => void;
};

export default function LoginScreen({ handlePressForm }: LoginScreenType) {
  const { login, user } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  if (user?.uid) {
    return <Redirect href='/(tabs)/home' />;
  }

  const onSubmit = async (data: FormData) => {
    try {
      await login(data.email, data.password);
    } catch {
      Alert.alert(
        'Erreur',
        'Échec de la connexion. Vérifiez vos identifiants.',
      );
    }
  };

  return (
    <View>
      <View style={styles.inputContainer}>
        <Controller
          control={control}
          name='email'
          rules={{
            required: 'Email requis',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Email invalide',
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder='Email'
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType='email-address'
              autoCapitalize='none'
            />
          )}
        />
        {errors.email && (
          <Text style={styles.error}>{errors.email.message}</Text>
        )}
      </View>
      <View style={styles.inputContainer}>
        <Controller
          control={control}
          name='password'
          rules={{ required: 'Mot de passe requis' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.password && styles.inputError]}
              placeholder='Mot de passe'
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
            />
          )}
        />
        {errors.password && (
          <Text style={styles.error}>{errors.password.message}</Text>
        )}
      </View>
      <View style={styles.button}>
        <Button
          title={isSubmitting ? 'Connexion...' : 'Se connecter'}
          handlePress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        />
      </View>

      <ButtonLink title='Créer un compte' handlePress={handlePressForm} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 25,
  },
  title: {
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 10,
  },
  input: {
    marginBottom: 7,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
  },
  inputError: { borderColor: '#e53935' },
  error: { color: '#e53935', fontSize: 12, marginBottom: 10 },
  button: {
    marginBottom: 10,
  },
  link: { marginTop: 0, textDecorationLine: 'underline', color: '#191134' },
});
