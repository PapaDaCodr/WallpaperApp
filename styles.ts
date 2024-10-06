// styles.ts
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const numColumns = 2;
export const itemWidth = (width - 30) / numColumns;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    backgroundColor: '#4a4a4a',
    padding: 20,
    alignItems: 'center',
  },
  headerText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  wallpaperList: {
    padding: 5,
  },
  wallpaperItem: {
    margin: 5,
  },
  wallpaperImage: {
    width: itemWidth,
    height: itemWidth * 1.5,
    borderRadius: 10,
  },
  wallpaperUser: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: '#ffffff',
    padding: 5,
    borderRadius: 5,
    fontSize: 12,
  },
  loader: {
    marginVertical: 20,
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: width * 0.9,
    height: (width * 0.9) * 1.5,
    borderRadius: 10,
  },
  modalInfo: {
    marginTop: 10,
    alignItems: 'center',
  },
  modalUser: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalTags: {
    color: '#cccccc',
    fontSize: 14,
    marginTop: 5,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  downloadButton: {
    backgroundColor: '#4CAF50',
  },
  closeButton: {
    backgroundColor: '#f44336',
  },
  downloadModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadModalContent: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  downloadModalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  downloadModalProgress: {
    fontSize: 16,
    marginTop: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#e0e0e0',
  },
  filterButton: {
    padding: 8,
    borderRadius: 5,
    backgroundColor: '#4a4a4a',
  },
  filterButtonText: {
    color: '#ffffff',
    fontSize: 14,
  },
  activeFilterButton: {
    backgroundColor: '#2196F3',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#4a4a4a',
    padding: 10,
  },
  tabButton: {
    padding: 10,
  },
  tabButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#ffffff',
  },
});