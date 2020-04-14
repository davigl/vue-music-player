const deleteElement = (array, target) => {
  return array.filter(item => {
    return item != target;
  });
};

const threatSongs = songs => {
  return songs.map(song => {
    song["isPlaying"] = false;
    song["percent"] = 0;
    song["currentlyTimer"] = "00:00";
  });
};

export { deleteElement, threatSongs };
