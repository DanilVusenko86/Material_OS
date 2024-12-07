const path = require('path');
const fs = require('fs');
const NodeID3 = require('node-id3');

async function getTrackTags(trackPath) {
  return new Promise((resolve, reject) => {
    NodeID3.read(trackPath, (err, tags) => {
      if (err) {
        return reject(err);
      }
      resolve(tags);
    });
  });
}

async function scanMusicFolder(folderPath, outputPath) {
    const albums = [];
    const subFolders = fs.readdirSync(folderPath).filter(f => fs.statSync(path.join(folderPath, f)).isDirectory());
  
    for (const folder of subFolders) {
      const folderPathFull = path.join(folderPath, folder);
      const musicFiles = fs.readdirSync(folderPathFull).filter(f => f.endsWith('.mp3'));
  
      if (musicFiles.length > 0) {
        const firstTrackPath = path.join(folderPathFull, musicFiles[0]);
        const firstTrackTags = await getTrackTags(firstTrackPath);
  
        let base64Image = 'data:image/png;base64,defaultThumbnailBase64';
  
        if (firstTrackTags.image && firstTrackTags.image.imageBuffer) {
          const base64 = firstTrackTags.image.imageBuffer.toString('base64');
          base64Image = `data:image/png;base64,${base64}`;
        }
  
        const album = {
          name: firstTrackTags.raw.TALB || 'Unknown Album',
          artist: firstTrackTags.raw.TPE1 || 'Unknown Artist',
          cover: base64Image,
          tracks: await Promise.all(musicFiles.map(async track => {
            const trackTags = await getTrackTags(path.join(folderPathFull, track));
  
            return {
              title: trackTags.raw.TIT2 || track,
              path: `/Files/Music/${folder}/${track}` // Adjust path for server
            };
          }))
        };
  
        albums.push(album);
      }
    }
  
    fs.writeFileSync(outputPath, JSON.stringify(albums, null, 2));
    console.log(`Albums data written to ${outputPath}`);
  }
  
  scanMusicFolder('materialos/system/Files/Music/', 'materialos/system/apps/MediaPlayer/json/music.json');
  