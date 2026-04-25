import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useEffect } from 'react';
import {
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import Button from '@/components/ui/Button';

type FormData = {
  currentPassword: string;
  newEmail: string;
  newPassword: string;
  confirmPassword: string;
};

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  useEffect(() => {
    if (user) {
      reset({ newEmail: user.email ?? '', currentPassword: '', newPassword: '', confirmPassword: '' });
    }
  }, [user, reset]);

  const onSubmit = async (values: FormData) => {
    const emailChanged = values.newEmail !== user?.email;
    const passwordChanged = values.newPassword.length > 0;

    if (!emailChanged && !passwordChanged) {
      Alert.alert('Aucun changement', 'Modifiez l\'email ou le mot de passe avant de sauvegarder.');
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(user!.email!, values.currentPassword);
      await reauthenticateWithCredential(auth.currentUser!, credential);

      if (emailChanged) await updateEmail(auth.currentUser!, values.newEmail);
      if (passwordChanged) await updatePassword(auth.currentUser!, values.newPassword);

      Alert.alert('Succès', 'Informations mises à jour !');
      reset({ newEmail: values.newEmail, currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (e: any) {
      if (e.code === 'auth/wrong-password' || e.code === 'auth/invalid-credential') {
        Alert.alert('Erreur', 'Mot de passe actuel incorrect.');
      } else {
        Alert.alert('Erreur', 'Impossible de mettre à jour les informations.');
      }
    }
  };

  const handleLogout = () => {
    Alert.alert('Déconnexion', 'Voulez-vous vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Déconnecter', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <ThemedView style={styles.wrapper}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps='handled'
        showsVerticalScrollIndicator={false}
      >
        <ThemedText type='title' style={styles.title}>
          Mon compte
        </ThemedText>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mot de passe actuel</Text>
          <Controller
            control={control}
            name='currentPassword'
            rules={{ required: 'Requis pour modifier vos informations' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.currentPassword && styles.inputError]}
                placeholder='••••••••'
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry
              />
            )}
          />
          {errors.currentPassword && (
            <Text style={styles.error}>{errors.currentPassword.message}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <Controller
            control={control}
            name='newEmail'
            rules={{
              required: 'Email requis',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email invalide' },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.newEmail && styles.inputError]}
                placeholder='email@exemple.com'
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType='email-address'
                autoCapitalize='none'
              />
            )}
          />
          {errors.newEmail && (
            <Text style={styles.error}>{errors.newEmail.message}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nouveau mot de passe</Text>
          <Controller
            control={control}
            name='newPassword'
            rules={{
              minLength: { value: 6, message: '6 caractères minimum' },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.newPassword && styles.inputError]}
                placeholder='Laisser vide pour ne pas changer'
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry
              />
            )}
          />
          {errors.newPassword && (
            <Text style={styles.error}>{errors.newPassword.message}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirmer le nouveau mot de passe</Text>
          <Controller
            control={control}
            name='confirmPassword'
            rules={{
              validate: (val) =>
                !watch('newPassword') ||
                val === watch('newPassword') ||
                'Les mots de passe ne correspondent pas',
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.confirmPassword && styles.inputError]}
                placeholder='••••••••'
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
            title={isSubmitting ? 'Enregistrement...' : 'Mettre à jour'}
            handlePress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          />
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  container: { padding: 24, paddingBottom: 48 },
  title: { marginBottom: 32 },
  inputContainer: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 5, color: '#555' },
  input: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    fontSize: 15,
  },
  inputError: { borderColor: '#e53935' },
  error: { color: '#e53935', fontSize: 12, marginTop: 4 },
  button: { marginTop: 8, marginBottom: 24 },
  logoutButton: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e53935',
    alignItems: 'center',
  },
  logoutText: { color: '#e53935', fontSize: 16, fontWeight: '600' },
});
