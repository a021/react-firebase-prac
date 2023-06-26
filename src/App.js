import { useEffect, useState } from "react";
import { Auth } from "./components/auth";
import { db, auth, storage } from "./config/firebase";

import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

import { ref, uploadBytes } from "firebase/storage";
import AddReports from "./AddReports";
function App() {
  const [movieList, setMovieList] = useState([]);
  const [reportsList, setReportsList] = useState([]);
  const [rewardList, setRewardList] = useState([]);

  const movieCollectionRef = collection(db, "movies");
  const reportsCollectionRef = collection(db, "reports");
  const rewardCollectionRef = collection(db, "rewards");

  //Input States
  const [newMovieTitle, setNewMovieTitle] = useState("");
  const [newReleaseDate, setNewReleaseDate] = useState(0);
  const [isNewMovieOscar, setIsNewMovieOscar] = useState(false);

  const [updatedTitle, setUpdatedTitle] = useState("");
  //report
  const [newReportTitle, setNewReportTitle] = useState("");
  const [newReportView, setNewReportView] = useState(0);
  const [newReportMonitized, setNewReportMonitized] = useState(false);
  //rewards
  const [newQuest, setNewQuest] = useState("");
  const [newReward, setNewReward] = useState(0);
  const [newIsItem, setNewIsItem] = useState("");

  //file upload state
  const [fileUpload, setFileUpload] = useState(null);
  //test
  const uploadFile = async () => {
    if (!fileUpload) return;
    const filesFolderRef = ref(storage, `projectFiles/${fileUpload.name}`);
    try {
      await uploadBytes(filesFolderRef, fileUpload);
    } catch (error) {
      console.error(error);
    }
  };

  const getData = async (collectionRef, setData) => {
    try {
      const data = await getDocs(collectionRef); //get data from the collection reference
      const filteredData = data.docs.map((doc) => ({
        //filter the data needed
        ...doc.data(),
        id: doc.id,
        userId: auth?.currentUser?.uid,
      }));

      setData(filteredData); // sets the hook from filtered data
      console.log(filteredData);
    } catch (err) {
      console.error(err);
    }
  };
  const getMovieList = async () => {
    //read the data
    //set the movie list
    try {
      const data = await getDocs(movieCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        userId: auth?.currentUser?.uid,
      }));
      setMovieList(filteredData);
      console.log(filteredData);
    } catch (err) {
      console.error(err);
    }
  };

  const getReportList = async () => {
    try {
      const data = await getDocs(reportsCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        userId: auth?.currentUser?.uid,
      }));

      setReportsList(filteredData);
      console.log(filteredData);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteID = async (dbName, id) => {
    const selectedDoc = doc(db, dbName, id);
    await deleteDoc(selectedDoc);
  };

  const deleteMovie = async (id) => {
    const movieDoc = doc(db, "movies", id);
    await deleteDoc(movieDoc)
      .then(() => {
        getData(movieCollectionRef, setMovieList);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updateMovie = async (id) => {
    const movieDoc = doc(db, "movies", id);
    await updateDoc(movieDoc, { title: updatedTitle });
    getData(movieCollectionRef, setMovieList);
  };

  useEffect(() => {
    getData(rewardCollectionRef, setRewardList);
    getReportList();
    getMovieList();
  }, []);

  const onSubmitMovie = async () => {
    try {
      await addDoc(movieCollectionRef, {
        title: newMovieTitle,
        releaseDate: newReleaseDate,
        receivedAnOscar: isNewMovieOscar,
        userId: auth?.currentUser?.uid,
      });
      getMovieList();
    } catch (err) {
      console.log(err);
    }
  };

  const onSubmitReport = async () => {
    try {
      await addDoc(reportsCollectionRef, {
        title: newReportTitle,
        views: newReportView,
        isMonitized: newReportMonitized,
      });
      getReportList();
    } catch (err) {
      console.error(err);
    }
  };

  const onSubmitReward = async () => {
    try {
      await addDoc(rewardCollectionRef, {
        quest: newQuest,
        reward: newReward,
        isItem: newIsItem,
      });
      getData(rewardCollectionRef, setRewardList);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="App">
      <header className="App-header">
        <Auth />
      </header>

      <div>
        <input
          placeholder="Movie Title..."
          onChange={(e) => {
            setNewMovieTitle(e.target.value);
          }}
        />
        <input
          placeholder="Release Date..."
          type="number"
          onChange={(e) => {
            setNewReleaseDate(e.target.value);
          }}
        />
        <input
          type="checkbox"
          checked={isNewMovieOscar}
          onChange={(e) => {
            setIsNewMovieOscar(e.target.checked);
          }}
        />
        <label>Received An Oscar</label>
        <button onClick={onSubmitMovie}>Submit Movie</button>
        <br />
        <AddReports
          setTitle={setNewReportTitle}
          setView={setNewReportView}
          isMonitized={newReportMonitized}
          setMonitized={setNewReportMonitized}
          submit={onSubmitReport}
        />
      </div>

      <div>
        <input
          placeholder="Quest Here..."
          onChange={(e) => {
            setNewQuest(e.target.value);
          }}
        />
        <input
          placeholder="Rewards Here..."
          type="number"
          onChange={(e) => {
            setNewReward(e.target.value);
          }}
        />
        <input
          placeholder="Quest Here..."
          type="checkbox"
          checked={newIsItem}
          onChange={(e) => {
            setNewIsItem(e.target.checked);
          }}
        />
        <label>Is reward an item?</label>
        <button onClick={onSubmitReward}>Submit Quest</button>
      </div>
      <div>
        {movieList.map((movie) => {
          return (
            <div key={movie.id}>
              <h1 style={{ color: movie.receivedAnOscar ? "green" : "red" }}>
                {movie.title}
              </h1>
              <p>{movie.releaseDate}</p>
              <button
                onClick={() => {
                  deleteMovie(movie.id);
                }}
              >
                Delete Movie
              </button>
              <input
                placeholder="New Movie Title Here..."
                onChange={(e) => {
                  setUpdatedTitle(e.target.value);
                }}
              />
              <button
                onClick={() => {
                  updateMovie(movie.id);
                }}
              >
                Update Movie
              </button>
            </div>
          );
        })}
        <hr />
        <div>
          {reportsList.map((report) => {
            return (
              <div key={report.id}>
                <h1 style={{ color: report.isMonitized ? "yellow" : "red" }}>
                  {report.title}
                </h1>
                <h1>{report.views}</h1>
                <button
                  onClick={() => {
                    deleteID("reports", report.id);
                  }}
                >
                  Delete Report
                </button>
              </div>
            );
          })}
        </div>
        <hr />
        {rewardList.map((reward) => {
          return (
            <div key={reward.id}>
              <h1 style={{ color: reward.isItem ? "blue" : "gold" }}>
                {reward.quest}
              </h1>
              <p>{reward.reward}</p>
            </div>
          );
        })}
        <hr />

        <div>
          <input
            type="file"
            onChange={(e) => {
              setFileUpload(e.target.files[0]);
            }}
          />
          <button onClick={uploadFile}>Upload File</button>
        </div>
      </div>
    </div>
  );
}

export default App;
