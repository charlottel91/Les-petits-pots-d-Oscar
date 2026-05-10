import {
  doc,
  setDoc,
  collection,
  addDoc,
  getDocs,
  query,
  limit,
} from 'firebase/firestore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

export type BabyData = {
  size: number;
  weight: number;
  birthDate: string;
};

export type Baby = BabyData & { id: string };

const fetchBaby = async (uid: string): Promise<Baby | null> => {
  const snap = await getDocs(query(collection(db, 'users', uid, 'babies'), limit(1)));
  if (!snap.empty) {
    const d = snap.docs[0];
    return { id: d.id, ...(d.data() as BabyData) };
  }
  return null;
};

const storeBaby = async (uid: string, data: BabyData, babyId?: string): Promise<string> => {
  if (babyId) {
    await setDoc(doc(db, 'users', uid, 'babies', babyId), data, { merge: true });
    return babyId;
  }
  const ref = await addDoc(collection(db, 'users', uid, 'babies'), data);
  return ref.id;
};

export function useBabyQuery() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['baby', user?.uid],
    queryFn: () => fetchBaby(user!.uid),
    enabled: !!user,
    staleTime: 10 * 60 * 1000,
  });
}

export function useSaveBaby() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, babyId }: { data: BabyData; babyId?: string }) =>
      storeBaby(user!.uid, data, babyId),
    onSuccess: (newId, { data }) => {
      queryClient.setQueryData(['baby', user?.uid], { id: newId, ...data });
    },
  });
}
