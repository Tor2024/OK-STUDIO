import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, DocumentData } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

export function useFirestoreCollection<T = DocumentData>(collectionPath: string, orderField?: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let q = query(collection(db, collectionPath));
    if (orderField) {
      q = query(collection(db, collectionPath), orderBy(orderField, 'desc'));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];
      setData(items);
      setLoading(false);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, collectionPath);
      setError(err.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [collectionPath, orderField]);

  return { data, loading, error };
}
