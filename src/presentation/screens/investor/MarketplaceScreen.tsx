import { FlatList, StyleSheet, Text, View } from "react-native";

import { colors, spacing, typography } from "../../../core/theme";

const mockLots = [
  {
    id: "1",
    nome: "Lote Spirulina Premium",
    pesoKg: 120,
    preco: 18500,
    status: "DISPONÍVEL",
  },
  {
    id: "2",
    nome: "Crédito Carbono Bioativo",
    pesoKg: 0,
    preco: 9200,
    status: "AUDITADO",
  },
];

export function MarketplaceScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Marketplace</Text>

      <Text style={styles.subtitle}>
        Lotes de biomassa e créditos de carbono disponíveis para negociação.
      </Text>

      <FlatList
        data={mockLots}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.badge}>{item.status}</Text>
            <Text style={styles.cardTitle}>{item.nome}</Text>

            {item.pesoKg > 0 && (
              <Text style={styles.info}>Peso: {item.pesoKg} kg</Text>
            )}

            <Text style={styles.price}>
              R$ {item.preco.toLocaleString("pt-BR")}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  title: {
    color: colors.textLight,
    fontSize: typography.title,
    fontWeight: "bold",
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.secondary,
    fontSize: typography.body,
    marginBottom: spacing.xl,
  },
  list: {
    paddingBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: colors.carbon,
    color: colors.textLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    fontSize: typography.small,
    fontWeight: "bold",
    marginBottom: spacing.md,
  },
  cardTitle: {
    color: colors.text,
    fontSize: typography.subtitle,
    fontWeight: "bold",
  },
  info: {
    color: colors.muted,
    fontSize: typography.caption,
    marginTop: spacing.sm,
  },
  price: {
    color: colors.primary,
    fontSize: typography.subtitle,
    fontWeight: "bold",
    marginTop: spacing.md,
  },
});