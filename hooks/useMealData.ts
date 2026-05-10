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

const fetchMeal = async (uid: string, babyId: string, date: string): Promise<MealEntry | null> => {
  const ref = doc(db, 'users', uid, 'babies', babyId, 'meals', date);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as MealEntry) : null;
};

const storeMeal = async (uid: string, babyId: string, date: string, entry: MealEntry) => {
  await setDoc(doc(db, 'users', uid, 'babies', babyId, 'meals', date), entry);
};

export function useMealQuery(babyId: string | null, date: string | null) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['meal', user?.uid, babyId, date],
    queryFn: () => fetchMeal(user!.uid, babyId!, date!),
    enabled: !!user && !!babyId && !!date,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSaveMeal() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ babyId, date, entry }: { babyId: string; date: string; entry: MealEntry }) =>
      storeMeal(user!.uid, babyId, date, entry),
    onSuccess: (_, { babyId, date, entry }) => {
      queryClient.setQueryData(['meal', user?.uid, babyId, date], entry);
    },
  });
}
