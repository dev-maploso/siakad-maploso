import api from "./api";
import type {
  RegistrasiKelasResponse,
} from "@/types/registrasi-kelas";

export interface RegistrasiKelasParams {
  page?: number;
  per_page?: number;
  semester_id?: number;
  tahun_ajaran_id?: number;
  status?: string;
}

export default {
  getAll(
    params: RegistrasiKelasParams = {}
  ) {
    return api.get<RegistrasiKelasResponse>(
      "/registrasi-kelas",
      {
        params,
      }
    );
  },
};