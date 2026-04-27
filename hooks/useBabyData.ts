import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

export type BabyData = {
  size: number;
  weight: number;
  birthDate: string;
};

export function useBabyData() {
  const { user } = useAuth();
  const [data, setData] = useState<BabyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const ref = doc(db, 'users', user.uid);
    getDoc(ref).then((snap) => {
      if (snap.exists()) {
        setData(snap.data() as BabyData);
      }
      setLoading(false);
    });
  }, [user]);

  const save = async (values: BabyData) => {
    if (!user) return;
    const ref = doc(db, 'users', user.uid);
    await setDoc(ref, { ...values, updatedAt: serverTimestamp() });
    setData(values);
  };

  return { data, loading, save };
}
