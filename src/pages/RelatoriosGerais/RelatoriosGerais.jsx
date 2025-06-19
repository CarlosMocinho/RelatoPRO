import React, { useEffect, useState } from "react";
import { fetchSharedReports } from "./ShareReport"; // Caminho corrigido (relativo ao arquivo atual)

const RelatoriosGerais = () => {
  const [sharedReports, setSharedReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      const reports = await fetchSharedReports();
      setSharedReports(reports);
    };

    fetchReports();
  }, []);

  return (
    <div>
      <h1>Relatórios Gerais</h1>
      <ul>
        {sharedReports.map((report) => (
          <li key={report.id}>
            Relatório ID: {report.reportId} (Compartilhado por: {report.ownerId})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RelatoriosGerais;