import { StyleSheet } from 'react-native';
import { COLORS } from './colors';

export const components = StyleSheet.create({
  // Plant Card styles
  plantCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
    elevation: 4,
  },
  plantImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  
  // Submission Card styles
  submissionCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 10,
    padding: 0,
    marginBottom: 10,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 2,
    elevation: 1,
  },
  submissionImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  
  // Profile Section styles
  profileSection: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  // Auth Screen styles
  authImage: {
    width: '100%',
    height: 250,
    marginBottom: 32,
  },

  // profile avatar
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  profileAvatarText: {
    color: COLORS.white,
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 80,
  },
  
  // FAB styles
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: COLORS.primary,
    height: 48,
    paddingHorizontal: 24,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    flexDirection: 'row',
  },

  // FloatingActionButton additional styles
  fabContainer: {
    position: 'absolute',
    bottom: 16,
    right: 0,
    alignItems: 'flex-end',
  },
  fabMenuContainer: {
    position: 'absolute',
    bottom: 80,
    right: 16,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    elevation: 4,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
});
