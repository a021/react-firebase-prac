export const getData = async (collectionRef, setData) => {
  try {
    const data = await getDocs(collectionRef); //get data from the collection reference
    const filteredData = data.docs.map((doc) => ({
      //filter the data needed
      ...doc.data(),
      id: doc.id,
    }));

    setData(filteredData); // sets the hook from filtered data
    console.log(filteredData);
  } catch (err) {
    console.error(err);
  }
};

export const deleteID = async (dbName, id) => {
  const selectedDoc = doc(db, dbName, id);
  await deleteDoc(selectedDoc);
};

export const onSubmitMovie = async () => {
  try {
    await addDoc(movieCollectionRef, {
      title: newMovieTitle,
      releaseDate: newReleaseDate,
      receivedAnOscar: isNewMovieOscar,
    });
    getMovieList();
  } catch (err) {
    console.log(err);
  }
};
