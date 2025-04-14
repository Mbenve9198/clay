import { useState } from 'react';
import Papa, { ParseResult } from 'papaparse';
import { supabase } from '@/lib/supabase';

interface CSVData {
  [key: string]: string;
}

export default function CSVImporter() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState<CSVData[]>([]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Leggi il file CSV
      Papa.parse<CSVData>(file, {
        complete: async (results: ParseResult<CSVData>) => {
          const parsedData = results.data;
          
          // Assicurati che i dati siano nel formato corretto
          if (!Array.isArray(parsedData) || parsedData.length === 0) {
            throw new Error('Il file CSV è vuoto o non è nel formato corretto');
          }

          // Salva i dati in Supabase
          const { error } = await supabase
            .from('csv_data')
            .insert(parsedData);

          if (error) throw error;

          // Salva i dati nello state per la visualizzazione
          setData(parsedData);
          setSuccess(true);
        },
        error: (error: Error) => {
          throw new Error(`Errore durante il parsing del CSV: ${error.message}`);
        },
        header: true // Assumi che la prima riga contenga gli header
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Si è verificato un errore durante l\'importazione');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Importa file CSV
        </label>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="mt-1 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
          disabled={loading}
        />
      </div>

      {loading && (
        <div className="text-blue-600">Importazione e salvataggio in corso...</div>
      )}

      {error && (
        <div className="text-red-600 mt-2">{error}</div>
      )}

      {success && (
        <div className="text-green-600 mt-2">
          Importazione completata con successo!
        </div>
      )}

      {data.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Dati Importati:</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {Object.keys(data[0]).map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
} 