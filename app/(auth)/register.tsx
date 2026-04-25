import { Text, TextInput, Alert, StyleSheet, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import { Redirect } from 'expo-router';
import Button from '@/components/ui/Button';
import ButtonLink from '@/components/ui/ButtonLink';

type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
};

type RegisterScreenType = {
  handlePressForm: () => void;
};

export default function RegisterScreen({
  handlePressForm,
}: RegisterScreenType) {
  const { register, user } = useAuth();
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  if (user) {
    return <Redirect href='/(tabs)/home' />;
  }

  const onSubmit = async (data: FormData) => {
    try {
      await register(data.email, data.password);
    } catch {
      Alert.alert('Erreur', "Échec de l'inscription.");
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
          rules={{
            required: 'Mot de passe requis',
            minLength: { value: 6, message: '6 caractères minimum' },
          }}
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

      <View style={styles.inputContainer}>
        <Controller
          control={control}
          name='confirmPassword'
          rules={{
            required: 'Confirmation requise',
            validate: (val) =>
              val === watch('password') ||
              'Les mots de passe ne correspondent pas',
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[
                styles.input,
                errors.confirmPassword && styles.inputError,
              ]}
              placeholder='Confirmer le mot de passe'
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
            />
          )}
        />
        {errors.confirmPassword && (
          <Text style={styles.error}>{errors.confirmPassword.message}</Text>
        )}
      </View>

      <View style={styles.button}>
        <Button
          title={isSubmitting ? 'Inscription...' : "S'inscrire"}
          handlePress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        />
      </View>

      <ButtonLink title='Se connecter' handlePress={handlePressForm} />
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 400,
  },
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
