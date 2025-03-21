// src/hkoos / useCV.ts;
// Custom hook para utilizar los datos del CV (Patrón Hook personalizado)

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { CVData } from "@/types/cv.types";
import { cvService } from "@/services/cv.service";

export const useCV = () => {
  const router = useRouter();
  const { locale } = router;
  const [cvData, setCVData] = useState<CVData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await cvService.getCVData(locale || "es");
        setCVData(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An error occurred"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [locale]);

  return { cvData, loading, error };
};
