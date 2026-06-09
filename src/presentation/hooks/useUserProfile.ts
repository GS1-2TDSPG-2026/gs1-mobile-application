import { useCallback, useEffect, useState } from "react";

import { UserProfileRepository } from "../../data/repositories/UserProfileRepository";
import {
  UpdateUserProfileRequest,
  UserProfile,
} from "../../domain/models/UserProfile";
import { useAuth } from "../contexts/AuthContext";

export function useUserProfile() {
  const { session, updateSessionUser } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const userId = session?.usuario.id;

  const loadProfile = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await UserProfileRepository.getById(userId);

      setProfile(data);
    } catch {
      setError("Não foi possível carregar os dados do perfil.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  async function updateProfile(data: UpdateUserProfileRequest) {
    if (!userId) {
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const updatedProfile = await UserProfileRepository.update(userId, data);

      setProfile(updatedProfile);

      await updateSessionUser({
        nome: updatedProfile.nome,
        email: updatedProfile.email,
        perfil: updatedProfile.perfil,
      });
    } catch {
      setError("Não foi possível atualizar o perfil.");
      throw new Error("Erro ao atualizar perfil");
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    profile,
    loading,
    submitting,
    error,
    reload: loadProfile,
    updateProfile,
  };
}