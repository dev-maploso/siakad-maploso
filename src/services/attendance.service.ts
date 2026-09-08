import api from "./api";
import type {
  AttendanceResponse,
} from "@/types/attendance";

export interface AttendanceParams {
  registrasi_kelas_id: number;
  semester_id: number;
  per_page?: number;
  page?: number;
}

export default {
  getHistory(params: AttendanceParams) {
    return api.get<AttendanceResponse>(
      "/attendance",
      {
        params,
      }
    );
  },
};