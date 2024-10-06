import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, StatusBar, FlatList, Image, Dimensions, TouchableOpacity, ActivityIndicator, Modal, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import { fetchWallpapers, Wallpaper } from './api';

const { width } = Dimensions.get('window');
const numColumns = 2;
const itemWidth = (width - 30) / numColumns;


  /**
   * The main app component.
   * Shows a list of wallpapers, allows the user to select one and see its details,
   * and allows the user to download the selected wallpaper to their media library.
   */

export default function App() {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  useEffect(() => {
    loadWallpapers();
  }, []);

  const loadWallpapers = async (refresh: boolean = false) => {
    if (loading) return;
    setLoading(true);
    const newPage = refresh ? 1 : page;
    const data = await fetchWallpapers(newPage);
    setWallpapers(prevWallpapers => refresh ? data : [...prevWallpapers, ...data]);
    setPage(newPage + 1);
    setLoading(false);
  };

  /**
   * Download a wallpaper to the user's media library.
   * @param wallpaper The wallpaper to download.
   */
  const downloadWallpaper = async (wallpaper: Wallpaper) => {
    // Ask for permission to access the media library
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant permission to save wallpapers.');
      return;
    }

    // Show a download progress modal
    setDownloading(true);
    setDownloadProgress(0);

    // Create a file Uri for the downloaded image
    const fileUri = FileSystem.documentDirectory + `wallpaper_${wallpaper.id}.jpg`;

    // Create a download resumable that will download the wallpaper and save it to the file Uri
    const downloadResumable = FileSystem.createDownloadResumable(
      wallpaper.largeImageURL,
      fileUri,
      {},
      // Update the download progress
      (downloadProgress) => {
        const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
        setDownloadProgress(progress);
      }
    );

    try {
      // Start the download
      const downloadResult = await downloadResumable.downloadAsync();
      if (downloadResult) {
        // Get the Uri of the downloaded file
        const { uri } = downloadResult;
        // Create an asset from the Uri
        const asset = await MediaLibrary.createAssetAsync(uri);
        // Save the asset to the "Wallpapers" album
        await MediaLibrary.createAlbumAsync('Wallpapers', asset, false);
        // Show a success alert
        Alert.alert('Success', 'Wallpaper saved to your photos!');
      } else {
        console.error('Download failed: no result returned');
        Alert.alert('Error', 'Failed to download wallpaper. Please try again.');
      }
    } finally {
      // Hide the download progress modal
      setDownloading(false);
      // Reset the selected wallpaper
      setSelectedWallpaper(null);
    }
  };


  const renderWallpaperItem = ({ item }: { item: Wallpaper }) => (
    <TouchableOpacity style={styles.wallpaperItem} onPress={() => setSelectedWallpaper(item)}>
      <Image
        source={{ uri: item.webformatURL }}
        style={styles.wallpaperImage}
      />
      <Text style={styles.wallpaperUser}>{item.user}</Text>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  };

  const renderDetailModal = () => (
    <Modal
      visible={!!selectedWallpaper}
      transparent={true}
      animationType="slide"
    >
      <View style={styles.modalContainer}>
        {selectedWallpaper && (
          <>
            <Image
              source={{ uri: selectedWallpaper.largeImageURL }}
              style={styles.modalImage}
            />
            <View style={styles.modalInfo}>
              <Text style={styles.modalUser}>{selectedWallpaper.user}</Text>
              <Text style={styles.modalTags}>{selectedWallpaper.tags}</Text>
            </View>
            <TouchableOpacity
              style={styles.downloadButton}
              onPress={() => downloadWallpaper(selectedWallpaper)}
            >
              <Text style={styles.downloadButtonText}>Download</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedWallpaper(null)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </Modal>
  );

  const renderDownloadModal = () => (
    <Modal
      visible={downloading}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.downloadModalContainer}>
        <View style={styles.downloadModalContent}>
          <Text style={styles.downloadModalText}>Downloading...</Text>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.downloadModalProgress}>{`${Math.round(downloadProgress * 100)}%`}</Text>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerText}>Wallpaper App</Text>
      </View>
      <FlatList
        data={wallpapers}
        renderItem={renderWallpaperItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={numColumns}
        contentContainerStyle={styles.wallpaperList}
        onEndReached={() => loadWallpapers()}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        refreshing={loading}
        onRefresh={() => loadWallpapers(true)}
      />
      {renderDetailModal()}
      {renderDownloadModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  downloadButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  downloadButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
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
});