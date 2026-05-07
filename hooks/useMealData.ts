import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

export type MealEntry = {
  vegetables: string[];
  fruits: string[];
  proteins: string[];
  comment: string;
};

const fetchMeal = async (uid: string, date: string): Promise<MealEntry | null> => {
  const ref = doc(db, 'users', uid, 'meals', date);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as MealEntry) : null;
};

const storeMeal = async (uid: string, date: string, entry: MealEntry) => {
  const ref = doc(db, 'users', uid, 'meals', date);
  await setDoc(ref, entry);
};

export function useMealQuery(date: string | null) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['meal', user?.uid, date],
    queryFn: () => fetchMeal(user!.uid, date!),
    enabled: !!user && !!date,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSaveMeal() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ date, entry }: { date: string; entry: MealEntry }) =>
      storeMeal(user!.uid, date, entry),
    onSuccess: (_, { date, entry }) => {
      queryClient.setQueryData(['meal', user?.uid, date], entry);
    },
  });
}
