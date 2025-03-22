"use client";

// src/hooks/useCV.ts
// Custom hook para utilizar los datos del CV (Patrón Hook personalizado)

import { useEffect, useState } from "react";
import { CVData } from "@/types/cv.types";
import { cvService } from "@/services/cv.service";
import { Locale } from "@/i18n/config";

export const useCV = (locale: Locale) => {
  const [cvData, setCVData] = useState<CVData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await cvService.getCVData(locale);
        setCVData(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An error occurred"));
        console.error("Error fetching CV data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [locale]);

  const refetch = async () => {
    try {
      setLoading(true);
      const data = await cvService.getCVData(locale);
      setCVData(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An error occurred"));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { cvData, loading, error, refetch };
};
