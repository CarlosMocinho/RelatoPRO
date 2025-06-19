import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../../../firebaseConfig";

export async function shareReport(reportId, sharedWithId) {
  if (!auth.currentUser) {
    alert("Você precisa estar logado para compartilhar relatórios.");
    return;
  }

  try {
    const sharedReportsRef = collection(db, "SharedReports");
    await addDoc(sharedReportsRef, {
      reportId: reportId,
      ownerId: auth.currentUser.uid,
      sharedWith: sharedWithId,
      timestamp: serverTimestamp(),
    });
    alert("Relatório compartilhado com sucesso!");
  } catch (error) {
    console.error("Erro ao compartilhar relatório:", error.message);
    alert("Erro ao compartilhar relatório: " + error.message);
  }
}

export const fetchSharedReports = async () => {
  if (!auth.currentUser) {
    alert("Você precisa estar logado para ver relatórios compartilhados.");
    return [];
  }

  try {
    const sharedReportsRef = collection(db, "SharedReports");
    const q = query(sharedReportsRef, where("sharedWith", "==", auth.currentUser.uid));
    const querySnapshot = await getDocs(q);

    const sharedReports = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("Relatórios compartilhados:", sharedReports);
    return sharedReports;
  } catch (error) {
    console.error("Erro ao buscar relatórios compartilhados:", error.message);
    alert("Erro ao buscar relatórios compartilhados: " + error.message);
    return [];
  }
};