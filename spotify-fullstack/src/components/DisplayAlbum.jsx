import React, { useContext, useState, useEffect } from 'react';
import Navbar from './Navbar';
import { useParams } from 'react-router-dom';
import { assets } from '../assets/assets';
import { PlayerContext } from '../context/PlayContext';

// Mock data album (bạn có thể dùng tạm để test UI)
const albumsMock = [
  {
    "_id": "6838d19d321e80b366f4146a",
    "name": "Top 50 Global",
    "desc": "Your weekly update of the most played tracks",
    "bgColour": "#2a4365",
    "image": "https://res.cloudinary.com/dpjv1vimo/image/upload/v1748554141/qvfuzhfeqwofwvwfjulo.jpg",
    "__v": 0
  },
  {
    "_id": "6838d1cf321e80b366f4146c",
    "name": "Top 50 India",
    "desc": "Your weekly update of the most played tracks",
    "bgColour": "#22543d",
    "image": "https://res.cloudinary.com/dpjv1vimo/image/upload/v1748554191/si29wn3gdlznkqnxbybn.jpg",
    "__v": 0
  },
  {
    "_id": "6838d208321e80b366f4146e",
    "name": "Trending India",
    "desc": "Your weekly update of the most played tracks",
    "bgColour": "#742a2a",
    "image": "https://res.cloudinary.com/dpjv1vimo/image/upload/v1748554248/e0qcy3emociwilv1ciln.jpg",
    "__v": 0
  },
  {
    "_id": "6838d240321e80b366f41470",
    "name": "Trending Global",
    "desc": "Your weekly update of the most played tracks",
    "bgColour": "#44337a",
    "image": "https://res.cloudinary.com/dpjv1vimo/image/upload/v1748554305/pe7kecjtumvtrcydxs3b.jpg",
    "__v": 0
  },
  {
    "_id": "6838d273321e80b366f41472",
    "name": "Mega Hits",
    "desc": "Your weekly update of the most played tracks",
    "bgColour": "#234e52",
    "image": "https://res.cloudinary.com/dpjv1vimo/image/upload/v1748554356/zmpj8l7jmpcacyamainu.jpg",
    "__v": 0
  },
  {
    "_id": "6838d29e321e80b366f41474",
    "name": "Happy Favorites",
    "desc": "Your weekly update of the most played tracks",
    "bgColour": "#744210",
    "image": "https://res.cloudinary.com/dpjv1vimo/image/upload/v1748554398/lvshvyy83p2sdy43ierb.jpg",
    "__v": 0
  }
]

const DisplayAlbum = () => {
  const { id } = useParams();
  const { setTrack } = useContext(PlayerContext);

  const [album, setAlbum] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loadingAlbum, setLoadingAlbum] = useState(true);
  const [loadingSongs, setLoadingSongs] = useState(true);

  useEffect(() => {
    setLoadingAlbum(true);
    setLoadingSongs(true);

    
    // Dùng mock data để test album nếu cần, hoặc fetch API thật
    const foundAlbum = albumsMock.find(item => item._id === id);
    if (foundAlbum) {
      setAlbum(foundAlbum);
      setLoadingAlbum(false);
    } else {
      // Nếu không tìm thấy trong mock, fetch từ API thật
      fetch(`http://localhost:4000/api/album/${id}`)
        .then(res => {
          if (!res.ok) throw new Error('Không tìm thấy album');
          return res.json();
        })
        .then(data => {
          setAlbum(data);
          setLoadingAlbum(false);
        })
        .catch(err => {
          console.error(err);
          setLoadingAlbum(false);
        });
    }

    // Lấy bài hát theo albumId
    fetch(`http://localhost:4000/api/song/list?albumId=${id}`)
      .then(res => res.json())
      .then(data => {
        setSongs(data);
        setLoadingSongs(false);
      })
      .catch(err => {
        console.error(err);
        setLoadingSongs(false);
      });
  }, [id]);

  if (loadingAlbum) return <p>Loading album...</p>;
  if (!album) return <p>Album not found</p>;

  return (
    <>
      <Navbar />
      <div className="mt-10 flex gap-8 flex-col md:flex-row md:items-end">
        <img className="w-48 rounded" src={album.image} alt={album.name} />
        <div className="flex flex-col">
          <p>Playlist</p>
          <h2 className="text-5xl font-bold mb-4 md:text-7xl">{album.name}</h2>
          <h4>{album.desc}</h4>
          <p className="mt-1">
            <img
              className="inline-block w-5"
              src={assets.spotify_logo}
              alt="Spotify Logo"
            />{' '}
            <b>Spotify</b> · {album.likes || 'N/A'} likes · <b>{songs.length} songs</b>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 mt-10 mb-4 px-2 text-[#a7a7a7]">
        <p>
          <b className="mr-4">#</b>Title
        </p>
        <p>Album</p>
        <p className="hidden sm:block">Date Added</p>
        <img className="m-auto w-4" src={assets.clock_icon} alt="Duration Icon" />
      </div>

      <hr />

      {loadingSongs ? (
        <p>Loading songs...</p>
      ) : (
        songs.map((item, index) => (
          <div
            key={item._id}
            onClick={() => setTrack(item)}
            className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-2 items-center text-[#a7a7a7] hover:bg-[#ffffff2b] cursor-pointer"
          >
            <p className="text-white">
              <b className="mr-4 text-[#a7a7a7]">{index + 1}</b>
              <img className="inline w-10 mr-5" src={item.image} alt={item.name} />
              {item.name}
            </p>
            <p className="text-[15px]">{album.name}</p>
            <p className="text-[15px] hidden sm:block">
              {new Date(item.dateAdded).toLocaleDateString()}
            </p>
            <p className="text-[15px] text-center">{item.duration}</p>
          </div>
        ))
      )}
    </>
  );
};

export default DisplayAlbum;