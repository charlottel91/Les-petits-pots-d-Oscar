import {
  View,
  Text,
  Modal,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useState, useEffect } from 'react';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useForm, Controller } from 'react-hook-form';
import { vegetables, fruits, proteins } from '@/data/food';
import { useMealQuery, useSaveMeal, MealEntry } from '@/hooks/useMealData';
import { useBabyQuery } from '@/hooks/useBabyData';
import Button from '@/components/ui/Button';
import { ThemedText } from '@/components/themed-text';

LocaleConfig.locales['fr'] = {
  monthNames: [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre',
  ],
  monthNamesShort: [
    'Janv.',
    'Févr.',
    'Mars',
    'Avr.',
    'Mai',
    'Juin',
    'Juil.',
    'Août',
    'Sept.',
    'Oct.',
    'Nov.',
    'Déc.',
  ],
  dayNames: [
    'Dimanche',
    'Lundi',
    'Mardi',
    'Mercredi',
    'Jeudi',
    'Vendredi',
    'Samedi',
  ],
  dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
};
LocaleConfig.defaultLocale = 'fr';

type FormData = {
  vegetables: string[];
  fruits: string[];
  proteins: string[];
  comment: string;
};

function FoodSelector({
  label,
  items,
  selected,
  onToggle,
}: {
  label: string;
  items: string[];
  selected: string[];
  onToggle: (item: string) => void;
}) {
  return (
    <View style={styles.selectorContainer}>
      <Text style={styles.selectorLabel}>{label}</Text>
      <View style={styles.chipsRow}>
        {items.map((item) => {
          const active = selected.includes(item);
          return (
            <TouchableOpacity
              key={item}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => onToggle(item)}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {item}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { data: baby } = useBabyQuery();
  const babyId = baby?.id ?? null;

  const { data: mealData, isLoading: loadingMeal } = useMealQuery(babyId, selectedDate);
  const saveMeal = useSaveMeal();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<FormData>({
    defaultValues: { vegetables: [], fruits: [], proteins: [], comment: '' },
  });

  useEffect(() => {
    if (!loadingMeal) {
      reset(mealData ?? { vegetables: [], fruits: [], proteins: [], comment: '' });
    }
  }, [mealData, loadingMeal, reset]);

  const watchedVeg = watch('vegetables');
  const watchedFruits = watch('fruits');
  const watchedProteins = watch('proteins');

  const toggleItem = (
    field: 'vegetables' | 'fruits' | 'proteins',
    item: string,
  ) => {
    const current =
      field === 'vegetables' ? watchedVeg : field === 'fruits' ? watchedFruits : watchedProteins;
    setValue(field, current.includes(item) ? current.filter((i) => i !== item) : [...current, item]);
  };

  const openDay = (date: string) => {
    setSelectedDate(date);
    setModalVisible(true);
  };

  const onSubmit = async (values: FormData) => {
    if (!selectedDate) return;
    try {
      await saveMeal.mutateAsync({ babyId: babyId!, date: selectedDate, entry: values as MealEntry });
      setModalVisible(false);
      Alert.alert('Succès', 'Repas enregistré !');
    } catch {
      Alert.alert('Erreur', "Impossible d'enregistrer le repas.");
    }
  };

  const formatDisplayDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  };

  return (
    <View style={styles.container}>
      <ThemedText type='default' style={{ margin: 20 }}>
        Ajoute les aliments consommés chaque jour pour la diversification
      </ThemedText>
      <Calendar
        onDayPress={(day) => openDay(day.dateString)}
        theme={{
          todayTextColor: '#910791',
          selectedDayBackgroundColor: '#910791',
          arrowColor: '#910791',
          dotColor: '#910791',
        }}
        enableSwipeMonths
      />

      <Modal
        visible={modalVisible}
        animationType='slide'
        presentationStyle='pageSheet'
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {selectedDate ? formatDisplayDate(selectedDate) : ''}
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>

          {loadingMeal ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size='large' color='#910791' />
            </View>
          ) : (
            <ScrollView
              style={styles.modalScroll}
              contentContainerStyle={styles.modalContent}
              keyboardShouldPersistTaps='handled'
            >
              <Controller
                control={control}
                name='vegetables'
                render={() => (
                  <FoodSelector
                    label='🥕 Légumes'
                    items={vegetables}
                    selected={watchedVeg}
                    onToggle={(item) => toggleItem('vegetables', item)}
                  />
                )}
              />

              <Controller
                control={control}
                name='fruits'
                render={() => (
                  <FoodSelector
                    label='🍎 Fruits'
                    items={fruits}
                    selected={watchedFruits}
                    onToggle={(item) => toggleItem('fruits', item)}
                  />
                )}
              />

              <Controller
                control={control}
                name='proteins'
                render={() => (
                  <FoodSelector
                    label='🍗 Protéines'
                    items={proteins}
                    selected={watchedProteins}
                    onToggle={(item) => toggleItem('proteins', item)}
                  />
                )}
              />

              <View style={styles.commentContainer}>
                <Text style={styles.selectorLabel}>💬 Commentaire</Text>
                <Controller
                  control={control}
                  name='comment'
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.commentInput}
                      placeholder='Notes sur le repas...'
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      multiline
                      numberOfLines={3}
                    />
                  )}
                />
              </View>

              <View style={styles.saveButton}>
                <Button
                  title={isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                  handlePress={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                />
              </View>
            </ScrollView>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  modalContainer: { flex: 1, backgroundColor: '#fff' },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#333' },
  closeBtn: { fontSize: 20, color: '#666', padding: 4 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalScroll: { flex: 1 },
  modalContent: { padding: 20, paddingBottom: 48 },
  selectorContainer: { marginBottom: 24 },
  selectorLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f5f5f5',
  },
  chipActive: { backgroundColor: '#910791', borderColor: '#910791' },
  chipText: { fontSize: 13, color: '#555' },
  chipTextActive: { color: '#fff', fontWeight: '600' },
  commentContainer: { marginBottom: 24 },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    textAlignVertical: 'top',
    minHeight: 90,
  },
  saveButton: { marginTop: 8 },
});
